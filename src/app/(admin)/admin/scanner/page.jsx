'use client';

import TicketScanner from '../../../../components/TicketScanner';
import { validateTicketQr } from '../../../../lib/events';

export default function AdminScannerPage() {
  return <TicketScanner onValidate={validateTicketQr} eyebrow="Admin Check-In" />;
}
