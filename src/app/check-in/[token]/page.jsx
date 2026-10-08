'use client';

import { useParams } from 'next/navigation';
import TicketScanner from '../../../components/TicketScanner';
import { validatePublicTicketQr } from '../../../lib/events';

export default function PublicCheckInPage() {
  const params = useParams();
  const token = typeof params?.token === 'string' ? params.token : '';

  return (
    <TicketScanner
      eyebrow="Volunteer Check-In"
      onValidate={(qrPayload) => validatePublicTicketQr(qrPayload, token)}
    />
  );
}
