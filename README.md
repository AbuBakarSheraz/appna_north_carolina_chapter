# APPNA NC Frontend

Next.js frontend for APPNA North Carolina marketing pages, member portal, admin panel, Square checkout, event ticket purchases, and QR ticket views.

## Setup

```bash
npm install
npm run build
npm run start
```

For local development:

```bash
npm run dev
```

## Environment

Copy `.env.example` to `.env.local` for local development, or configure the same variables in your production host.

Required variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.appnanc.org/api
NEXT_PUBLIC_SITE_URL=https://appnanc.org

NEXT_PUBLIC_SQUARE_APPLICATION_ID=your-square-application-id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your-square-location-id
NEXT_PUBLIC_SQUARE_ENVIRONMENT=production
```

Use `NEXT_PUBLIC_SQUARE_ENVIRONMENT=sandbox` with sandbox app/location IDs while testing.

## Square Payments

The frontend uses Square Web Payments SDK for card, Apple Pay, and Cash App Pay. Hosted Square checkout remains available as a fallback.

Apple Pay requires Square domain verification for the production domain before it appears on eligible Safari devices.

PayPal is not used by the current frontend payment flow.
