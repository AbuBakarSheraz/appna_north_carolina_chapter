'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, ImageUp, Loader2, QrCode, RotateCcw, XCircle } from 'lucide-react';
import { validateTicketQr } from '../../../../lib/events';

export default function AdminScannerPage() {
  const scannerRef = useRef(null);
  const validatingRef = useRef(false);
  const [Html5Qrcode, setHtml5Qrcode] = useState(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const mod = await import('html5-qrcode');
      setHtml5Qrcode(() => mod.Html5Qrcode);
    })();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const validate = async (payload) => {
    if (validatingRef.current) return;
    validatingRef.current = true;
    setLoading(true);
    try {
      const { data } = await validateTicketQr(payload);
      setResult(data);
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
        setRunning(false);
      }
    } catch (err) {
      setResult({ status: 'Invalid', valid: false, message: err?.response?.data?.message || 'QR validation failed.' });
    } finally {
      setLoading(false);
      validatingRef.current = false;
    }
  };

  const startCamera = async () => {
    if (!Html5Qrcode) return;
    setResult(null);
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;
    await scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 260, height: 260 } },
      (decodedText) => validate(decodedText),
    );
    setRunning(true);
  };

  const stopCamera = async () => {
    if (scannerRef.current?.isScanning) await scannerRef.current.stop();
    setRunning(false);
  };

  const scanFile = async (file) => {
    if (!Html5Qrcode || !file) return;
    setResult(null);
    const scanner = new Html5Qrcode('qr-file-reader');
    try {
      const decoded = await scanner.scanFile(file, true);
      await validate(decoded);
    } catch {
      setResult({ status: 'Invalid', valid: false, message: 'No QR code was found in that image.' });
    } finally {
      scanner.clear().catch(() => {});
    }
  };

  return (
    <main className="min-h-screen bg-[#f0f2f7] px-4 py-8 sm:px-8">
      <section className="mx-auto max-w-4xl">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1a2744]">Admin Check-In</p>
          <h1 className="mt-1 text-3xl font-semibold text-gray-950">QR Ticket Scanner</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_.7fr]">
          <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div id="qr-reader" className="min-h-80 overflow-hidden rounded-lg bg-gray-950" />
            <div id="qr-file-reader" className="hidden" />
            <div className="mt-4 flex flex-wrap gap-3">
              {!running ? (
                <button onClick={startCamera} disabled={!Html5Qrcode || loading} className="inline-flex items-center gap-2 rounded-lg bg-[#1a2744] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                  <Camera size={15} /> Start Camera
                </button>
              ) : (
                <button onClick={stopCamera} className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
                  <XCircle size={15} /> Stop Camera
                </button>
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700">
                <ImageUp size={15} /> Upload QR Image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => scanFile(e.target.files?.[0])} />
              </label>
              <button onClick={() => setResult(null)} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700">
                <RotateCcw size={15} /> Clear
              </button>
            </div>
          </section>

          <aside className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-950"><QrCode size={18} /> Validation Result</h2>
            {loading ? (
              <div className="flex h-48 items-center justify-center"><Loader2 className="animate-spin text-[#1a2744]" /></div>
            ) : !result ? (
              <p className="rounded-lg bg-gray-50 p-5 text-sm text-gray-500">Scan a ticket QR code to validate and mark check-in.</p>
            ) : (
              <div className={`rounded-lg border p-5 ${result.valid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                {result.valid ? <CheckCircle2 className="mb-3 text-green-600" size={30} /> : <XCircle className="mb-3 text-red-600" size={30} />}
                <p className={`text-xl font-semibold ${result.valid ? 'text-green-800' : 'text-red-800'}`}>{result.status}</p>
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  {result.ticketId && <p><span className="font-semibold">Ticket:</span> {result.ticketId}</p>}
                  {result.holderName && <p><span className="font-semibold">Holder:</span> {result.holderName}</p>}
                  {result.eventName && <p><span className="font-semibold">Event:</span> {result.eventName}</p>}
                  {result.ticketStatus && <p><span className="font-semibold">Ticket Status:</span> {result.ticketStatus}</p>}
                  {result.approvalStatus && <p><span className="font-semibold">Approval Status:</span> {result.approvalStatus}</p>}
                  {result.checkInTime && <p><span className="font-semibold">Check-in Time:</span> {new Date(result.checkInTime).toLocaleString()}</p>}
                  {result.message && <p>{result.message}</p>}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
