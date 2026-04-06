'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2, ArrowRight, User, Stethoscope,
  MapPin, Building2, CreditCard, Bell, Calendar,
  Users, BookOpen, Loader2, LogOut, ChevronRight,
  Download, Shield, Lock, Award, Sparkles,
} from 'lucide-react';
import { getFullProfile } from '../../../lib/profile';
import { logout } from '../../../lib/auth';
import { clearAccessToken } from '../../../store/auth';

// ─────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────
const PROFILE_STEPS = [
  { id: 1, label: 'Basic Information',  icon: User        },
  { id: 2, label: 'Medical Education',  icon: Stethoscope },
  { id: 3, label: 'Home Address',       icon: MapPin      },
  { id: 4, label: 'Office Information', icon: Building2   },
  { id: 5, label: 'Membership Plan',    icon: CreditCard  },
];

const DASHBOARD_CARDS = [
  { label: 'Member Directory', icon: Users,    desc: 'Browse fellow APPNA NC physicians',  href: '/directory',  color: '#7a1f3d' },
  { label: 'Upcoming Events',  icon: Calendar, desc: 'CME workshops, dinners & galas',     href: '/events',     color: '#1a5276' },
  { label: 'Resources',        icon: BookOpen, desc: 'Clinical guidelines & publications', href: '/resources',  color: '#1a6639' },
  { label: 'Announcements',    icon: Bell,     desc: 'Chapter news and updates',           href: '/news',       color: '#7d6608' },
];

const PLAN_LABELS = { STUDENT: 'Student Member', ANNUAL: 'Annual Member', LIFETIME: 'Lifetime Member' };
const PLAN_COLORS = { STUDENT: '#4a7c59', ANNUAL: '#7a1f3d', LIFETIME: '#1a3a5c' };

// ─────────────────────────────────────────────────────────────────
// MEMBERSHIP CARD SECTION
// Three states:
//   locked   — profile incomplete (not yet eligible)
//   pending  — profile complete, payment not confirmed
//   active   — payment confirmed, full card + download
// ─────────────────────────────────────────────────────────────────
function MembershipCardSection({ profile }) {
  const isActive  = profile?.membership?.isActive;
  const isComplete = profile?.isProfileCompleted;

  if (!isComplete && !isActive) {
    return <LockedCardTeaser profileStep={profile?.profileStep ?? 0} />;
  }
  if (isComplete && !isActive) {
    return <PendingCardTeaser />;
  }
  return <ActiveMembershipCard profile={profile} />;
}

// ── State 1: Profile incomplete — blurred locked card ────────────
function LockedCardTeaser({ profileStep }) {
  const percent = Math.round((profileStep / 5) * 100);
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="px-6 sm:px-8 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={13} className="text-gray-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Membership Card</span>
        </div>
        <h2 className="display-font text-2xl font-semibold text-gray-900">Claim Your Membership Card</h2>
        <p className="text-sm text-gray-400 mt-0.5">Complete your profile to unlock your official APPNA NC credential.</p>
      </div>

      {/* Blurred card preview */}
      <div className="px-6 sm:px-8 pb-6">
        <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '1.586', maxWidth: 480 }}>
          {/* Ghost card background */}
          <div className="absolute inset-0 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #2d0a18 0%, #7a1f3d 55%, #4a0e22 100%)' }} />
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-md bg-white/10 rounded-2xl" />
          {/* Lock icon centred */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Lock size={24} className="text-white/70" />
            </div>
            <div className="text-center">
              <p className="text-white/80 text-sm font-semibold">Profile {percent}% complete</p>
              <p className="text-white/50 text-xs mt-1">Complete all 5 steps to unlock</p>
            </div>
            {/* Mini progress bar */}
            <div className="w-40 h-1.5 bg-white/20 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-white/70 rounded-full transition-all duration-700"
                style={{ width: `${percent}%` }} />
            </div>
          </div>
        </div>

        <Link href="/complete-profile"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#7a1f3d] hover:underline">
          Continue profile setup <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// ── State 2: Profile done, awaiting payment ──────────────────────
function PendingCardTeaser() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 shadow-sm overflow-hidden">
      <div className="px-6 sm:px-8 py-6 flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Sparkles size={22} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">Almost There</p>
          <h2 className="display-font text-xl font-semibold text-gray-900">Your card is ready to issue</h2>
          <p className="text-sm text-amber-700/80 mt-1 leading-relaxed">
            Your profile is complete! Once your payment is confirmed, your official APPNA NC membership card
            will appear here — ready to download and print.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── State 3: Active — full card + download ───────────────────────
function ActiveMembershipCard({ profile }) {
  const [flipped,     setFlipped]     = useState(false);
  const [downloading, setDownloading] = useState(false);

  const membership = profile.membership;
  const basic      = profile.basicInfo;
  const planColor  = PLAN_COLORS[membership?.type] ?? '#7a1f3d';
  const planLabel  = PLAN_LABELS[membership?.type] ?? 'Member';

  // Build the display name with prefix and suffix
  const memberName = basic
    ? [
        profile.prefix === 'DR' ? 'Dr.' : '',
        basic.firstName,
        basic.lastName,
        profile.suffix && profile.suffix !== 'NA' ? ', ' + profile.suffix.replace('_', '.') : '',
      ].filter(Boolean).join(' ')
    : profile.username;

  const memberId = `ANC-${(membership?.id ?? '00000000').slice(0, 8).toUpperCase()}`;

  const validUntil = membership?.expiresAt
    ? new Date(membership.expiresAt).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })
    : 'LIFETIME';

  const memberSince = membership?.startedAt
    ? new Date(membership.startedAt).getFullYear()
    : new Date().getFullYear();

  const specialty = profile.medicalEducation?.primarySpecialty ?? '';

  // ── Canvas download ───────────────────────────────────────────────
  // Draws a CR80-ratio (1012×638 px) card on an off-screen canvas
  // then triggers a PNG download. Zero external dependencies.
  const downloadCard = useCallback(async () => {
    setDownloading(true);
    try {
      const W = 1012, H = 638;
      const cvs = document.createElement('canvas');
      cvs.width = W; cvs.height = H;
      const ctx = cvs.getContext('2d');

      // ── Rounded-rect helper (polyfill for older browsers) ──
      const rr = (x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      };

      // 1. Background gradient
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0,   '#2d0a18');
      bg.addColorStop(0.5, planColor);
      bg.addColorStop(1,   '#4a0e22');
      ctx.fillStyle = bg;
      rr(0, 0, W, H, 28); ctx.fill();

      // 2. Decorative circles
      const circle = (cx, cy, r, alpha) => {
        ctx.save(); ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      };
      circle(W - 80, -80, 280, 0.07);
      circle(120, H + 60, 240, 0.05);

      // 3. Horizontal divider line
      ctx.save(); ctx.globalAlpha = 0.15;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(60, H - 188); ctx.lineTo(W - 60, H - 188); ctx.stroke();
      ctx.restore();

      // 4. Brand name
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.font = 'bold 28px Georgia, serif';
      ctx.fillText('APPNA NC', 60, 82);

      // 5. Sub-brand
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '14px Arial, sans-serif';
      ctx.fillText('Association of Physicians of Pakistani-origin of North Carolina', 60, 110);

      // 6. Plan badge (top-right pill)
      ctx.save();
      const badgeText = planLabel.toUpperCase();
      ctx.font = 'bold 12px Arial, sans-serif';
      const bw = ctx.measureText(badgeText).width + 28;
      const bx = W - 60 - bw, by = 56;
      ctx.fillStyle = 'rgba(255,255,255,0.13)';
      rr(bx, by, bw, 28, 14); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillText(badgeText, bx + 14, by + 19);
      ctx.restore();

      // 7. EMV chip (decorative)
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1;
      rr(60, 155, 54, 38, 5); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 0.8;
      [163, 171, 179, 187].forEach(y => {
        ctx.beginPath(); ctx.moveTo(62, y); ctx.lineTo(112, y); ctx.stroke();
      });
      ctx.beginPath(); ctx.moveTo(87, 155); ctx.lineTo(87, 193); ctx.stroke();
      ctx.restore();

      // 8. Watermark A
      ctx.save(); ctx.globalAlpha = 0.055;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 160px Georgia, serif';
      ctx.fillText('A', W - 155, H - 20);
      ctx.restore();

      // 9. Member name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px Georgia, serif';
      ctx.fillText(memberName, 60, H - 222);

      // 10. Specialty
      if (specialty) {
        ctx.fillStyle = 'rgba(255,255,255,0.58)';
        ctx.font = '18px Arial, sans-serif';
        ctx.fillText(specialty, 60, H - 196);
      }

      // 11. Meta labels + values
      const meta = [
        { label: 'MEMBER ID',    value: memberId,          x: 60  },
        { label: 'MEMBER SINCE', value: String(memberSince), x: 310 },
        { label: 'VALID UNTIL',  value: validUntil,          x: 520 },
      ];
      meta.forEach(({ label, value, x }) => {
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.font = '12px Arial, sans-serif';
        ctx.fillText(label, x, H - 148);
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.font = 'bold 17px Courier New, monospace';
        ctx.fillText(value, x, H - 124);
      });

      // 12. Trigger download
      const a = document.createElement('a');
      a.download = `APPNA-NC-Membership-${memberId}.png`;
      a.href = cvs.toDataURL('image/png', 1.0);
      a.click();
    } catch (err) {
      console.error('Card download failed:', err);
    } finally {
      setDownloading(false);
    }
  }, [memberName, memberId, planLabel, planColor, validUntil, memberSince, specialty]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="px-6 sm:px-8 pt-6 pb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award size={13} className="text-[#7a1f3d]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7a1f3d]">Member Credential</span>
          </div>
          <h2 className="display-font text-2xl font-semibold text-gray-900">Your Membership Card</h2>
          <p className="text-sm text-gray-400 mt-0.5">Official APPNA NC digital credential. Click to flip, download to save.</p>
        </div>
        <button onClick={downloadCard} disabled={downloading}
          style={{ background: 'linear-gradient(135deg, #7a1f3d, #9b2d51)', boxShadow: '0 4px 16px rgba(122,31,61,0.28)' }}
          className="flex-shrink-0 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white
            disabled:opacity-50 transition-all hover:-translate-y-0.5 active:translate-y-0">
          {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Download PNG
        </button>
      </div>

      {/* Card */}
      <div className="px-6 sm:px-8 pb-8">
        <div className="card-flip-wrapper" onClick={() => setFlipped(f => !f)} role="button" aria-label="Flip card">
          <div className={`card-flip-inner${flipped ? ' is-flipped' : ''}`}>

            {/* ── FRONT ── */}
            <div className="card-face card-front"
              style={{ background: `linear-gradient(135deg, #2d0a18 0%, ${planColor} 55%, #4a0e22 100%)` }}>
              <div className="c-circle c-circle-1" />
              <div className="c-circle c-circle-2" />
              {/* Top row */}
              <div className="c-row-top">
                <div>
                  <div className="c-brand">APPNA NC</div>
                  <div className="c-sub">North Carolina Chapter</div>
                </div>
                <div className="c-badge">{planLabel}</div>
              </div>
              {/* Chip */}
              <div className="c-chip">
                <div className="c-chip-h" /><div className="c-chip-h" />
                <div className="c-chip-h" /><div className="c-chip-h" />
                <div className="c-chip-v" />
              </div>
              {/* Bottom info */}
              <div className="c-bottom">
                <div className="c-name">{memberName}</div>
                {specialty && <div className="c-spec">{specialty}</div>}
                <div className="c-meta-row">
                  <div><div className="c-meta-lbl">MEMBER ID</div><div className="c-meta-val">{memberId}</div></div>
                  <div><div className="c-meta-lbl">SINCE</div><div className="c-meta-val">{memberSince}</div></div>
                  <div><div className="c-meta-lbl">VALID UNTIL</div><div className="c-meta-val">{validUntil}</div></div>
                </div>
              </div>
              <div className="c-wm">A</div>
            </div>

            {/* ── BACK ── */}
            <div className="card-face card-back"
              style={{ background: `linear-gradient(135deg, #1a0810 0%, ${planColor} 60%, #2d0a18 100%)` }}>
              <div className="c-circle c-circle-1" />
              <div className="c-circle c-circle-2" />
              {/* Magnetic stripe */}
              <div className="c-stripe" />
              {/* Info grid */}
              <div className="c-back-grid">
                <div className="c-back-item span-2">
                  <div className="c-meta-lbl">FULL NAME</div>
                  <div className="c-back-val">{memberName}</div>
                </div>
                <div className="c-back-item">
                  <div className="c-meta-lbl">MEMBERSHIP TYPE</div>
                  <div className="c-back-val">{planLabel}</div>
                </div>
                {specialty && (
                  <div className="c-back-item">
                    <div className="c-meta-lbl">PRIMARY SPECIALTY</div>
                    <div className="c-back-val">{specialty}</div>
                  </div>
                )}
                <div className="c-back-item">
                  <div className="c-meta-lbl">MEMBER ID</div>
                  <div className="c-back-val" style={{ fontFamily: 'Courier New, monospace', fontWeight: 700 }}>{memberId}</div>
                </div>
                <div className="c-back-item span-2">
                  <div className="c-meta-lbl">CHAPTER</div>
                  <div className="c-back-val">Association of Physicians of Pakistani-origin of North Carolina</div>
                </div>
              </div>
              {/* Footer */}
              <div className="c-back-footer">
                <Shield size={10} className="flex-shrink-0 mt-0.5" />
                <span>This card is the property of APPNA NC. If found, please contact info@appnanc.org</span>
              </div>
              <div className="c-wm">A</div>
            </div>

          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3 select-none">
          Click the card to flip it · Download saves a high-res PNG
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PROFILE COMPLETION BANNER
// ─────────────────────────────────────────────────────────────────
function ProfileCompletionBanner({ profileStep }) {
  const percent = Math.round(((profileStep ?? 0) / PROFILE_STEPS.length) * 100);
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-[#7a1f3d]/10 bg-white">
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #7a1f3d, #9b2d51)' }} />
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7a1f3d] uppercase tracking-widest mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7a1f3d] animate-pulse" />
              Action Required
            </span>
            <h2 className="display-font text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">Complete your profile</h2>
            <p className="text-sm text-gray-500">
              {percent === 0
                ? 'Your account is created. Fill in your details to activate membership.'
                : `You're ${percent}% there — keep going to unlock full access.`}
            </p>
          </div>
          <Link href="/complete-profile"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white flex-shrink-0 transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7a1f3d, #9b2d51)', boxShadow: '0 4px 16px rgba(122,31,61,0.3)' }}>
            {(profileStep ?? 0) === 0 ? 'Start now' : 'Continue'} <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>{profileStep ?? 0} of {PROFILE_STEPS.length} steps done</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${percent}%`, background: 'linear-gradient(90deg, #7a1f3d, #9b2d51)' }} />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {PROFILE_STEPS.map((s) => {
            const done = s.id <= (profileStep ?? 0);
            const active = s.id === (profileStep ?? 0) + 1;
            const Icon = s.icon;
            return (
              <div key={s.id}
                style={{ borderColor: done ? '#7a1f3d20' : active ? '#7a1f3d30' : '#e5e7eb', background: done ? '#7a1f3d08' : active ? '#fdf2f5' : '#fafafa' }}
                className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all">
                <div style={{ background: done ? '#7a1f3d' : active ? '#7a1f3d15' : '#f0f0f0', color: done ? 'white' : active ? '#7a1f3d' : '#9ca3af' }}
                  className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all">
                  {done ? <CheckCircle2 size={14} /> : <Icon size={13} />}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${done ? 'text-gray-700' : active ? 'text-[#7a1f3d]' : 'text-gray-400'}`}>{s.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{done ? 'Completed' : active ? 'Up next' : 'Pending'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPLETED DASHBOARD CONTENT
// ─────────────────────────────────────────────────────────────────
function CompletedDashboard({ profile }) {
  const memberSince = profile.membership?.startedAt
    ? new Date(profile.membership.startedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';
  const expiresAt = profile.membership?.expiresAt
    ? new Date(profile.membership.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Never (Lifetime)';

  return (
    <div className="space-y-6">
      {/* Status strip */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#7a1f3d] mb-1">Membership Status</p>
            <h3 className="display-font text-2xl font-semibold text-gray-900 mb-0.5">
              {profile.membership?.type
                ? profile.membership.type.charAt(0) + profile.membership.type.slice(1).toLowerCase()
                : 'Active'}{' '}Member
            </h3>
            <p className="text-sm text-gray-500">Member since {memberSince} · {expiresAt === 'Never (Lifetime)' ? 'Lifetime membership' : `Renews ${expiresAt}`}</p>
          </div>
          <div className="flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7a1f3d, #9b2d51)' }}>
            <CreditCard size={22} className="text-white" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold text-green-700">Active</span>
        </div>
      </div>

      {/* Membership card — always rendered (shows active card here) */}
      <MembershipCardSection profile={profile} />

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DASHBOARD_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5
                shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                style={{ background: `${card.color}12`, color: card.color }}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{card.label}</p>
                <p className="text-xs text-gray-400 truncate">{card.desc}</p>
              </div>
              <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getFullProfile();
        setProfile(data);
      } catch { /* 401 handled by axios interceptor → redirects to /login */ }
      finally { setLoading(false); }
    })();
  }, []);

  const handleLogout = async () => {
    try { await logout(); } catch { }
    clearAccessToken();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-[#7a1f3d]" />
          <p className="text-sm text-gray-500 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.basicInfo
    ? `${profile.basicInfo.firstName} ${profile.basicInfo.lastName}`
    : profile?.username ?? 'Doctor';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

        .dash-root   { font-family: 'Outfit', sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', serif; }
        .fade-in { animation: dFade 0.4s ease both; }
        @keyframes dFade { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

        /* ── Card flip mechanics ── */
        .card-flip-wrapper {
          perspective: 1400px;
          cursor: pointer;
          width: 100%;
          max-width: 540px;
          /* maintain CR80 ratio 85.6 x 54mm */
          aspect-ratio: 1.586;
          position: relative;
        }
        .card-flip-inner {
          position: absolute; inset: 0;
          transition: transform 0.7s cubic-bezier(.16,1,.3,1);
          transform-style: preserve-3d;
        }
        .card-flip-inner.is-flipped { transform: rotateY(180deg); }

        .card-face {
          position: absolute; inset: 0;
          border-radius: 20px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
          box-shadow: 0 28px 64px rgba(0,0,0,0.38), 0 4px 16px rgba(0,0,0,0.18);
          padding: 5%;
          display: flex;
          flex-direction: column;
        }
        .card-back { transform: rotateY(180deg); }

        /* Decorative circles */
        .c-circle {
          position: absolute; border-radius: 50%;
          background: rgba(255,255,255,0.06);
          pointer-events: none;
        }
        .c-circle-1 { width: 55%; height: 130%; top: -50%; right: -15%; }
        .c-circle-2 { width: 42%; height: 90%;  bottom: -38%; left: -8%; }

        /* Front — top row */
        .c-row-top { display:flex; justify-content:space-between; align-items:flex-start; position:relative; z-index:1; }
        .c-brand   { font-family:'Cormorant Garamond',serif; font-size:clamp(13px,3.8vw,22px); font-weight:700; color:rgba(255,255,255,0.93); letter-spacing:.1em; }
        .c-sub     { font-size:clamp(7px,1.4vw,9px); color:rgba(255,255,255,0.42); margin-top:2px; letter-spacing:.04em; }
        .c-badge   { font-size:clamp(7px,1.3vw,9px); font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,0.8); background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2); border-radius:999px; padding:3px 10px; white-space:nowrap; }

        /* Chip */
        .c-chip     { position:relative; z-index:1; width:clamp(30px,7%,44px); height:clamp(20px,5%,30px); background:rgba(255,255,255,0.11); border:1px solid rgba(255,255,255,0.2); border-radius:4px; margin-top:auto; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; padding:3px 0; }
        .c-chip-h   { width:100%; height:1px; background:rgba(255,255,255,0.16); }
        .c-chip-v   { position:absolute; top:0; bottom:0; left:50%; width:1px; background:rgba(255,255,255,0.16); }

        /* Front — bottom */
        .c-bottom   { position:absolute; bottom:5%; left:5%; right:5%; z-index:1; }
        .c-name     { font-family:'Cormorant Garamond',serif; font-size:clamp(13px,3.8vw,24px); font-weight:600; color:#fff; line-height:1.2; }
        .c-spec     { font-size:clamp(7px,1.4vw,10px); color:rgba(255,255,255,0.52); margin-top:1px; margin-bottom:5px; }
        .c-meta-row { display:flex; gap:6%; border-top:1px solid rgba(255,255,255,0.12); padding-top:5px; margin-top:4px; }
        .c-meta-lbl { font-size:clamp(5px,1.1vw,7px); font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,0.38); }
        .c-meta-val { font-size:clamp(8px,1.6vw,11px); font-weight:600; color:rgba(255,255,255,0.9); margin-top:1px; font-family:'Courier New',monospace; }

        /* Watermark */
        .c-wm { position:absolute; bottom:-4%; right:2%; font-family:'Cormorant Garamond',serif; font-size:clamp(56px,17%,96px); font-weight:700; color:rgba(255,255,255,0.05); pointer-events:none; user-select:none; line-height:1; z-index:0; }

        /* Back face */
        .c-stripe    { position:absolute; top:15%; left:0; right:0; height:13%; background:rgba(0,0,0,0.45); z-index:1; }
        .c-back-grid { position:absolute; top:36%; left:5%; right:5%; display:grid; grid-template-columns:1fr 1fr; gap:4% 6%; z-index:1; }
        .c-back-item { }
        .span-2      { grid-column: 1 / -1; }
        .c-back-val  { font-size:clamp(8px,1.7vw,11px); color:rgba(255,255,255,0.82); font-weight:500; margin-top:2px; line-height:1.3; }
        .c-back-footer { position:absolute; bottom:4%; left:5%; right:5%; display:flex; align-items:flex-start; gap:5px; font-size:clamp(5px,1vw,7px); color:rgba(255,255,255,0.28); border-top:1px solid rgba(255,255,255,0.08); padding-top:5px; z-index:1; }
      `}</style>

      <div className="dash-root min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7a1f3d, #9b2d51)' }}>A</div>
              <span className="text-sm font-bold tracking-widest uppercase text-gray-800">APPNA NC</span>
            </div>
            <div className="flex items-center gap-3">
              {profile?.image
                ? <img src={profile.image} alt={displayName} className="h-8 w-8 rounded-full object-cover ring-2 ring-[#7a1f3d]/20" />
                : <div className="h-8 w-8 rounded-full bg-[#7a1f3d]/10 flex items-center justify-center"><User size={14} className="text-[#7a1f3d]" /></div>}
              <span className="hidden sm:block text-sm font-medium text-gray-700">{displayName}</span>
              <button onClick={handleLogout}
                className="ml-1 flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#7a1f3d] transition-colors font-medium">
                <LogOut size={13} /><span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 fade-in">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#7a1f3d] mb-1">
              {profile?.isProfileCompleted ? 'Member Portal' : 'Getting Started'}
            </p>
            <h1 className="display-font text-3xl sm:text-4xl font-semibold text-gray-900">
              Welcome{profile?.prefix === 'DR' ? ', Dr.' : ','} {displayName.split(' ')[0]}.
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {profile?.isProfileCompleted
                ? "Your profile is complete. Here's your member dashboard."
                : 'Complete your profile to unlock full member access.'}
            </p>
          </div>

          {/* Profile incomplete: show progress banner + locked card teaser */}
          {!profile?.isProfileCompleted && (
            <>
              <ProfileCompletionBanner profileStep={profile?.profileStep ?? 0} />
              <MembershipCardSection profile={profile} />
            </>
          )}

          {/* Profile complete: full dashboard */}
          {profile?.isProfileCompleted && <CompletedDashboard profile={profile} />}
        </main>
      </div>
    </>
  );
}