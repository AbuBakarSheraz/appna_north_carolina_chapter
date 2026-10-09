'use client';

import TicketScanner from '../../../../components/TicketScanner';
import { resetTicketCheckIn, validateTicketQr } from '../../../../lib/events';

export default function AdminScannerPage() {
  return <TicketScanner onValidate={validateTicketQr} onResetCheckIn={resetTicketCheckIn} eyebrow="Admin Check-In" />;
}
