'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, CreditCard, Loader2, Smartphone, WalletCards } from 'lucide-react';

const SQUARE_SDK_ID = 'square-web-payments-sdk';

function loadScript(id, src) {
  if (typeof window === 'undefined') return Promise.reject(new Error('Browser is required.'));

  const existing = document.getElementById(id);
  if (existing) {
    if (existing.dataset.loaded === 'true') return Promise.resolve();
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${id}.`)), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${id}.`));
    document.body.appendChild(script);
  });
}

function squareSdkUrl(environment) {
  return environment === 'production'
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js';
}

function idempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function tokenError(tokenResult) {
  const detail = tokenResult?.errors?.map((item) => item.message).filter(Boolean).join(' ');
  return detail || `Square tokenization failed with status: ${tokenResult?.status || 'UNKNOWN'}.`;
}

export default function SquarePaymentOptions({
  amount,
  description = 'APPNA North Carolina payment',
  disabled = false,
  buyer = {},
  onToken,
  onError,
  fallbackLabel = 'Continue to hosted Square checkout',
  onFallbackCheckout,
}) {
  const instanceId = useRef(Math.random().toString(36).slice(2));
  const cardId = `square-card-${instanceId.current}`;
  const applePayId = `square-apple-pay-${instanceId.current}`;
  const cashAppId = `square-cash-app-${instanceId.current}`;
  const methodsRef = useRef([]);

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [card, setCard] = useState(null);
  const [applePay, setApplePay] = useState(null);
  const [eligible, setEligible] = useState({ card: false, applePay: false, cashAppPay: false });

  const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
  const environment = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox';
  const sdkUrl = squareSdkUrl(environment);
  const displayAmount = Number(amount || 0).toFixed(2);

  const paymentRequest = useCallback((payments) => payments.paymentRequest({
    countryCode: 'US',
    currencyCode: 'USD',
    total: {
      amount: displayAmount,
      label: 'APPNA North Carolina',
    },
  }), [displayAmount]);

  const verificationDetails = useMemo(() => ({
    amount: displayAmount,
    currencyCode: 'USD',
    intent: 'CHARGE',
    customerInitiated: true,
    sellerKeyedIn: false,
    billingContact: {
      givenName: buyer.firstName || buyer.fullName?.split(' ')?.[0] || undefined,
      familyName: buyer.lastName || buyer.fullName?.split(' ')?.slice(1).join(' ') || undefined,
      email: buyer.email || undefined,
      phone: buyer.phone || undefined,
      countryCode: 'US',
    },
  }), [buyer.email, buyer.firstName, buyer.fullName, buyer.lastName, buyer.phone, displayAmount]);

  const processToken = useCallback(async (sourceId, paymentMethod, tokenResult) => {
    setProcessing(true);
    setMessage('');
    try {
      await onToken?.({
        sourceId,
        paymentMethod,
        tokenResult,
        idempotencyKey: idempotencyKey(),
      });
    } catch (err) {
      const nextMessage = err?.response?.data?.message || err?.message || 'Square payment could not be completed.';
      setMessage(nextMessage);
      onError?.(err);
    } finally {
      setProcessing(false);
    }
  }, [onError, onToken]);

  const tokenize = useCallback(async (paymentMethod, paymentMethodName) => {
    const tokenResult = paymentMethodName === 'card'
      ? await paymentMethod.tokenize(verificationDetails)
      : await paymentMethod.tokenize();

    if (tokenResult?.status === 'OK' && tokenResult?.token) {
      return tokenResult;
    }

    throw new Error(tokenError(tokenResult));
  }, [verificationDetails]);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      if (!applicationId || !locationId) {
        setStatus('error');
        setMessage('Square application ID or location ID is not configured for this site.');
        return;
      }

      try {
        setStatus('loading');
        setMessage('');
        await loadScript(SQUARE_SDK_ID, sdkUrl);
        if (cancelled || !window.Square) return;

        methodsRef.current.forEach((method) => {
          try {
            method?.destroy?.();
          } catch {}
        });
        methodsRef.current = [];

        const payments = window.Square.payments(applicationId, locationId);
        const nextEligible = { card: false, applePay: false, cashAppPay: false };

        const nextCard = await payments.card();
        await nextCard.attach(`#${cardId}`);
        methodsRef.current.push(nextCard);
        nextEligible.card = true;
        if (!cancelled) setCard(nextCard);

        try {
          const nextApplePay = await payments.applePay(paymentRequest(payments));
          methodsRef.current.push(nextApplePay);
          nextEligible.applePay = true;
          if (!cancelled) setApplePay(nextApplePay);
        } catch {
          if (!cancelled) setApplePay(null);
        }

        try {
          const cashAppPay = await payments.cashAppPay(paymentRequest(payments), {
            redirectURL: window.location.href,
            referenceId: `appna-${Date.now()}`,
          });
          await cashAppPay.attach(`#${cashAppId}`);
          cashAppPay.addEventListener('ontokenization', (event) => {
            const { tokenResult, error } = event.detail || {};
            if (error) {
              setMessage(error?.message || 'Cash App Pay could not authorize this payment.');
              onError?.(error);
              return;
            }
            if (tokenResult?.status === 'OK' && tokenResult?.token) {
              processToken(tokenResult.token, 'cashAppPay', tokenResult);
              return;
            }
            setMessage(tokenError(tokenResult));
          });
          methodsRef.current.push(cashAppPay);
          nextEligible.cashAppPay = true;
        } catch {}

        if (!cancelled) {
          setEligible(nextEligible);
          setStatus('ready');
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setMessage(err?.message || 'Square payment methods could not be loaded.');
          onError?.(err);
        }
      }
    }

    setup();

    return () => {
      cancelled = true;
      methodsRef.current.forEach((method) => {
        try {
          method?.destroy?.();
        } catch {}
      });
      methodsRef.current = [];
    };
  }, [applicationId, cardId, cashAppId, locationId, onError, paymentRequest, processToken, sdkUrl]);

  const handleCardPayment = async () => {
    if (!card) return;
    try {
      const tokenResult = await tokenize(card, 'card');
      await processToken(tokenResult.token, 'card', tokenResult);
    } catch (err) {
      setMessage(err?.message || 'Card payment could not be started.');
      onError?.(err);
    }
  };

  const handleApplePayPayment = async () => {
    if (!applePay) return;
    try {
      const tokenResult = await tokenize(applePay, 'applePay');
      await processToken(tokenResult.token, 'applePay', tokenResult);
    } catch (err) {
      setMessage(err?.message || 'Apple Pay could not be started.');
      onError?.(err);
    }
  };

  const showFallback = onFallbackCheckout && (status === 'error' || status === 'ready');

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-950">Secure Square payment</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className="flex items-center gap-1 text-[#7a1f3d]">
          <WalletCards size={18} />
          <span className="text-sm font-semibold">${displayAmount}</span>
        </div>
      </div>

      {status === 'loading' && (
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" />
          Loading Square payment methods...
        </div>
      )}

      <div className={disabled || processing ? 'pointer-events-none opacity-60' : ''}>
        <div id={applePayId} className="min-h-[44px]">
          {eligible.applePay && (
            <button
              type="button"
              onClick={handleApplePayPayment}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black px-4 text-sm font-semibold text-white"
            >
              <Smartphone size={16} />
              Apple Pay
            </button>
          )}
        </div>

        <div id={cashAppId} className="mt-2 min-h-[44px]" />

        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
          <div id={cardId} />
          <button
            type="button"
            disabled={!eligible.card || disabled || processing}
            onClick={handleCardPayment}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#7a1f3d] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {processing ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
            Pay ${displayAmount}
          </button>
        </div>
      </div>

      {status === 'ready' && !eligible.applePay && (
        <div className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-500">
          <CheckCircle2 size={15} className="mt-0.5 text-gray-400" />
          Apple Pay appears on eligible Safari devices after the Square Apple Pay domain is configured.
        </div>
      )}

      {message && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5" />
          {message}
        </div>
      )}

      {showFallback && (
        <button
          type="button"
          disabled={disabled || processing}
          onClick={onFallbackCheckout}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 disabled:opacity-50"
        >
          <CreditCard size={16} />
          {fallbackLabel}
        </button>
      )}
    </section>
  );
}
