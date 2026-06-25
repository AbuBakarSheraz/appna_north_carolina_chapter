'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, CreditCard, Loader2, WalletCards } from 'lucide-react';

const PAYPAL_SDK_ID = 'paypal-js-sdk';
const APPLE_PAY_SDK_ID = 'apple-pay-js-sdk';

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

function paypalSdkUrl(clientId) {
  const params = new URLSearchParams({
    'client-id': clientId,
    currency: 'USD',
    intent: 'capture',
    components: 'buttons,applepay',
    'enable-funding': 'card,venmo,paylater',
  });
  return `https://www.paypal.com/sdk/js?${params.toString()}`;
}

export default function PayPalPaymentOptions({
  amount,
  description = 'APPNA North Carolina payment',
  disabled = false,
  createOrder,
  onApprove,
  onError,
  fallbackLabel = 'Continue to PayPal checkout',
  onFallbackCheckout,
}) {
  const paypalRef = useRef(null);
  const cardRef = useRef(null);
  const applePayRef = useRef(null);
  const renderedButtons = useRef([]);
  const orderContext = useRef(null);

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [eligible, setEligible] = useState({ paypal: false, card: false, applePay: false });

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      if (!clientId) {
        setStatus('error');
        setMessage('PayPal client ID is not configured for this site.');
        return;
      }

      try {
        setStatus('loading');
        await loadScript(PAYPAL_SDK_ID, paypalSdkUrl(clientId));
        await loadScript(APPLE_PAY_SDK_ID, 'https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js').catch(() => {});

        if (cancelled || !window.paypal) return;

        renderedButtons.current.forEach((button) => {
          try {
            button.close();
          } catch {}
        });
        renderedButtons.current = [];

        const nextEligible = { paypal: false, card: false, applePay: false };

        const renderButton = async (ref, fundingSource, key) => {
          if (!ref.current || !fundingSource) return;
          ref.current.innerHTML = '';

          const button = window.paypal.Buttons({
            fundingSource,
            style: {
              layout: 'vertical',
              height: 45,
              shape: 'rect',
              tagline: false,
            },
            createOrder: async () => {
              setProcessing(true);
              setMessage('');
              const result = await createOrder();
              const orderId = typeof result === 'string' ? result : result?.orderId;

              if (!orderId) {
                throw new Error('Payment order was not created.');
              }

              orderContext.current = result;
              return orderId;
            },
            onApprove: async (data) => {
              try {
                await onApprove(data.orderID, orderContext.current);
              } finally {
                setProcessing(false);
              }
            },
            onCancel: () => setProcessing(false),
            onError: (err) => {
              setProcessing(false);
              setMessage(err?.message || 'PayPal could not start this payment.');
              onError?.(err);
            },
          });

          if (!button.isEligible()) return;
          nextEligible[key] = true;
          await button.render(ref.current);
          renderedButtons.current.push(button);
        };

        await renderButton(paypalRef, window.paypal.FUNDING?.PAYPAL, 'paypal');
        await renderButton(cardRef, window.paypal.FUNDING?.CARD, 'card');

        if (applePayRef.current) {
          applePayRef.current.innerHTML = '';
          const ApplePaySession = window.ApplePaySession;
          const applepayFactory = window.paypal.Applepay;

          if (ApplePaySession?.canMakePayments?.() && applepayFactory) {
            try {
              const applepay = applepayFactory();
              const config = await applepay.config();

              if (config?.isEligible) {
                nextEligible.applePay = true;
                applePayRef.current.innerHTML = '<apple-pay-button buttonstyle="black" type="buy" locale="en-US"></apple-pay-button>';
                const button = applePayRef.current.querySelector('apple-pay-button');

                button?.addEventListener('click', () => {
                  const session = new ApplePaySession(4, {
                    countryCode: config.countryCode || 'US',
                    currencyCode: 'USD',
                    merchantCapabilities: config.merchantCapabilities,
                    supportedNetworks: config.supportedNetworks,
                    requiredBillingContactFields: ['postalAddress'],
                    total: {
                      label: 'APPNA North Carolina',
                      type: 'final',
                      amount: Number(amount).toFixed(2),
                    },
                  });

                  session.onvalidatemerchant = (event) => {
                    applepay.validateMerchant({
                      validationUrl: event.validationURL,
                      displayName: 'APPNA North Carolina',
                    })
                      .then((result) => session.completeMerchantValidation(result.merchantSession))
                      .catch((err) => {
                        setMessage('Apple Pay merchant validation failed.');
                        onError?.(err);
                        session.abort();
                      });
                  };

                  session.onpaymentauthorized = async (event) => {
                    try {
                      setProcessing(true);
                      setMessage('');
                      const result = await createOrder();
                      const orderId = typeof result === 'string' ? result : result?.orderId;

                      if (!orderId) throw new Error('Payment order was not created.');

                      orderContext.current = result;
                      await applepay.confirmOrder({
                        orderId,
                        token: event.payment.token,
                        billingContact: event.payment.billingContact,
                      });
                      await onApprove(orderId, orderContext.current);
                      session.completePayment(ApplePaySession.STATUS_SUCCESS);
                    } catch (err) {
                      setMessage(err?.message || 'Apple Pay could not complete this payment.');
                      onError?.(err);
                      session.completePayment(ApplePaySession.STATUS_FAILURE);
                    } finally {
                      setProcessing(false);
                    }
                  };

                  session.begin();
                });
              }
            } catch (err) {
              onError?.(err);
            }
          }
        }

        if (!cancelled) {
          setEligible(nextEligible);
          setStatus('ready');
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setMessage(err?.message || 'Payment methods could not be loaded.');
          onError?.(err);
        }
      }
    }

    setup();

    return () => {
      cancelled = true;
      renderedButtons.current.forEach((button) => {
        try {
          button.close();
        } catch {}
      });
      renderedButtons.current = [];
    };
  }, [amount, clientId, createOrder, onApprove, onError]);

  const showFallback = status === 'error' && onFallbackCheckout;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-950">Secure payment methods</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className="flex items-center gap-1 text-[#7a1f3d]">
          <WalletCards size={18} />
          <span className="text-sm font-semibold">${Number(amount).toFixed(2)}</span>
        </div>
      </div>

      {status === 'loading' && (
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" />
          Loading PayPal payment methods...
        </div>
      )}

      <div className={disabled || processing ? 'pointer-events-none opacity-60' : ''}>
        <div ref={paypalRef} />
        <div ref={cardRef} className="mt-2" />
        <div ref={applePayRef} className="mt-2 min-h-[45px]" />
      </div>

      {status === 'ready' && !eligible.applePay && (
        <div className="flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-500">
          <CheckCircle2 size={15} className="mt-0.5 text-gray-400" />
          Apple Pay appears only on eligible devices/browsers after the PayPal Apple Pay feature and domain are enabled.
        </div>
      )}

      {message && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5" />
          {message}
        </div>
      )}

      {showFallback && (
        <button
          type="button"
          disabled={disabled || processing}
          onClick={onFallbackCheckout}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7a1f3d] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {processing ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
          {fallbackLabel}
        </button>
      )}
    </section>
  );
}
