'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, Clock, CheckCircle2, BarChart2, ShieldCheck,
  LogOut, Search, ChevronLeft, ChevronRight, Check,
  X, RefreshCw, Loader2, Eye, AlertTriangle, TrendingUp,CalendarDays,
} from 'lucide-react';
import {
  getAdminStats, getAdminUsers,
  getPendingPayments, confirmPayment, revokeMembership,
  getPendingSponsorships, confirmSponsorship,getAllSponsorships,
} from '../../../../lib/admin';
import { logout } from '../../../../lib/auth';
import { clearAccessToken } from '../../../../store/auth';

// ─── helpers ─────────────────────────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') ?? 'http://72.62.173.41:1018';

function buildImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
}

function fullName(user) {
  if (user.basicInfo) return `${user.basicInfo.firstName} ${user.basicInfo.lastName}`;
  return user.username;
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const TIER_COLORS = {
  STUDENT:  { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  ANNUAL:   { bg: '#fdf2f5', text: '#7a1f3d', border: '#fecdd3' },
  LIFETIME: { bg: '#eff6ff', text: '#1e3a5f', border: '#bfdbfe' },
};

// ─── tiny reusable components ─────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-start gap-4">
      <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none mb-0.5">{value ?? '—'}</p>
        <p className="text-xs font-semibold text-gray-500">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function Avatar({ user, size = 8 }) {
  const img = buildImageUrl(user.imagePath);
  const initials = fullName(user).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return img ? (
    <img src={img} alt={fullName(user)}
      className={`h-${size} w-${size} rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0`} />
  ) : (
    <div className={`h-${size} w-${size} rounded-full bg-[#1a2744]/10 flex items-center justify-center shrink-0`}>
      <span className="text-xs font-bold text-[#1a2744]">{initials}</span>
    </div>
  );
}

function Badge({ type, isActive }) {
  if (!type) return <span className="text-xs text-gray-400">No plan</span>;
  const c = TIER_COLORS[type] ?? TIER_COLORS.ANNUAL;
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {isActive ? <Check size={8} strokeWidth={3} /> : <Clock size={8} />}
      {type.charAt(0) + type.slice(1).toLowerCase()}
    </span>
  );
}

function StepBadge({ step }) {
  const labels = ['', 'Basic Info', 'Medical', 'Address', 'Office', 'Complete'];
  const colors  = ['', '#9ca3af', '#f97316', '#eab308', '#3b82f6', '#22c55e'];
  return (
    <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 border"
      style={{ background: `${colors[step]}15`, color: colors[step], borderColor: `${colors[step]}40` }}>
      {labels[step] ?? `Step ${step}`}
    </span>
  );
}

function ConfirmModal({ user, action, onConfirm, onCancel, loading }) {
  const isConfirm = action === 'confirm';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in">
        <div className="flex items-center gap-3 mb-4">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isConfirm ? 'bg-green-50' : 'bg-red-50'}`}>
            {isConfirm ? <CheckCircle2 size={20} className="text-green-600" /> : <AlertTriangle size={20} className="text-red-500" />}
          </div>
          <h3 className="font-semibold text-gray-900">
            {isConfirm ? 'Confirm Payment' : 'Revoke Membership'}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          {isConfirm
            ? <>Activate <strong>{fullName(user)}</strong>'s membership after verifying their Square payment?</>
            : <>Revoke the active membership for <strong>{fullName(user)}</strong>? They will lose access immediately.</>}
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: isConfirm ? '#16a34a' : '#dc2626' }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : isConfirm ? 'Confirm' : 'Revoke'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── USERS TABLE ─────────────────────────────────────────────────
function UsersTable({ onRevoke }) {
  const [data, setData]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [query, setQuery]     = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p, q) => {
    setLoading(true);
    try {
      const { data: res } = await getAdminUsers(p, 15, q);
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch { /* handled by interceptor */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(page, query); }, [page, query, load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email..."
              className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#1a2744] transition-colors"
            />
          </div>
          <button type="submit" className="rounded-xl bg-[#1a2744] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#2d4070] transition-colors">
            Search
          </button>
          {query && (
            <button type="button" onClick={() => { setSearch(''); setQuery(''); setPage(1); }}
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-xs text-gray-500 hover:bg-gray-50">
              Clear
            </button>
          )}
        </form>
        <div className="text-xs text-gray-400 flex-shrink-0">
          {total} total member{total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Member</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Specialty</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Membership</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Profile</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                  <p className="text-sm">Loading members...</p>
                </td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No members found.</td></tr>
              ) : data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                  {/* Member */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar user={user} size={8} />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate text-sm">
                          {user.prefix === 'DR' ? 'Dr. ' : ''}{fullName(user)}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  {/* Specialty */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-gray-600">{user.medicalEducation?.primarySpecialty ?? <span className="text-gray-300">—</span>}</span>
                  </td>
                  {/* Membership */}
                  <td className="px-4 py-3">
                    <Badge type={user.membership?.type} isActive={user.membership?.isActive} />
                  </td>
                  {/* Profile step */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <StepBadge step={user.profileStep} />
                  </td>
                  {/* Joined */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-500">{formatDate(user.createdAt)}</span>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    {user.membership?.isActive && (
                      <button onClick={() => onRevoke(user)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-100 transition-colors">
                        <X size={10} /> Revoke
                      </button>
                    )}
                    {!user.membership && (
                      <span className="text-[10px] text-gray-300">No plan</span>
                    )}
                    {user.membership && !user.membership.isActive && (
                      <span className="text-[10px] text-amber-500 font-semibold">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-white disabled:opacity-40 transition-colors">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-white disabled:opacity-40 transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PENDING PAYMENTS TABLE ───────────────────────────────────────
function PendingPaymentsTable({ onConfirm, refreshKey }) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: res } = await getPendingPayments();
        setData(res.data);
      } catch { }
      finally { setLoading(false); }
    })();
  }, [refreshKey]);

  if (loading) return (
    <div className="rounded-2xl border border-gray-100 p-12 text-center shadow-sm bg-white">
      <Loader2 size={20} className="animate-spin text-[#1a2744] mx-auto mb-2" />
      <p className="text-sm text-gray-400">Loading pending payments...</p>
    </div>
  );

  if (data.length === 0) return (
    <div className="rounded-2xl border border-gray-100 p-12 text-center shadow-sm bg-white">
      <CheckCircle2 size={32} className="text-green-400 mx-auto mb-3" />
      <p className="font-semibold text-gray-700">All clear!</p>
      <p className="text-sm text-gray-400 mt-1">No payments awaiting confirmation.</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-amber-100 overflow-hidden shadow-sm bg-white">
      <div className="h-1 w-full bg-amber-400" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-amber-50 border-b border-amber-100">
              <th className="text-left px-5 py-3 text-xs font-bold text-amber-800 uppercase tracking-wider">Member</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-amber-800 uppercase tracking-wider hidden sm:table-cell">Plan</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-amber-800 uppercase tracking-wider hidden md:table-cell">Amount</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-amber-800 uppercase tracking-wider hidden lg:table-cell">Requested</th>
              <th className="text-right px-5 py-3 text-xs font-bold text-amber-800 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-50">
            {data.map((m) => (
              <tr key={m.id} className="hover:bg-amber-50/40 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar user={m.user} size={8} />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-sm">{fullName(m.user)}</p>
                      <p className="text-xs text-gray-400 truncate">{m.user.email}</p>
                      {m.user.basicInfo?.phoneNumber && (
                        <p className="text-xs text-gray-400">{m.user.basicInfo.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <Badge type={m.type} isActive={false} />
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="font-bold text-gray-900">${m.price}</span>
                  <span className="text-xs text-gray-400 ml-1">USD</span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="text-xs text-gray-500">{formatDate(m.startedAt)}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button onClick={() => onConfirm({ ...m.user, membership: m })}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 transition-colors shadow-sm">
                    <CheckCircle2 size={12} /> Confirm Payment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SponsorshipsTable({ onConfirm, refreshKey }) {
  const [filter, setFilter] = useState('PAID'); // 'PAID' = pending, 'CONFIRMED' = confirmed
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: res } = await getAllSponsorships(filter);
        setData(res.data);
      } catch { }
      finally { setLoading(false); }
    })();
  }, [refreshKey, filter]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {[
          { key: 'PAID', label: 'Pending' },
          { key: 'CONFIRMED', label: 'Confirmed' },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
            style={{
              background: filter === f.key ? '#1a2744' : '#f3f4f6',
              color: filter === f.key ? 'white' : '#6b7280',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-100 p-12 text-center shadow-sm bg-white">
          <Loader2 size={20} className="animate-spin text-[#1a2744] mx-auto mb-2" />
          <p className="text-sm text-gray-400">Loading sponsorships...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 p-12 text-center shadow-sm bg-white">
          <CheckCircle2 size={32} className="text-green-400 mx-auto mb-3" />
          <p className="font-semibold text-gray-700">
            {filter === 'PAID' ? 'All clear!' : 'No confirmed sponsors yet.'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {filter === 'PAID' ? 'No sponsorships awaiting confirmation.' : 'Confirmed sponsorships will appear here.'}
          </p>
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden shadow-sm bg-white ${filter === 'PAID' ? 'border-amber-100' : 'border-green-100'}`}>
          <div className={`h-1 w-full ${filter === 'PAID' ? 'bg-amber-400' : 'bg-green-500'}`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={filter === 'PAID' ? 'bg-amber-50 border-b border-amber-100' : 'bg-green-50 border-b border-green-100'}>
                  <th className={`text-left px-5 py-3 text-xs font-bold uppercase tracking-wider ${filter === 'PAID' ? 'text-amber-800' : 'text-green-800'}`}>Business</th>
                  <th className={`text-left px-5 py-3 text-xs font-bold uppercase tracking-wider hidden sm:table-cell ${filter === 'PAID' ? 'text-amber-800' : 'text-green-800'}`}>Tier</th>
                  <th className={`text-left px-5 py-3 text-xs font-bold uppercase tracking-wider hidden md:table-cell ${filter === 'PAID' ? 'text-amber-800' : 'text-green-800'}`}>Amount</th>
                  <th className={`text-left px-5 py-3 text-xs font-bold uppercase tracking-wider hidden lg:table-cell ${filter === 'PAID' ? 'text-amber-800' : 'text-green-800'}`}>
                    {filter === 'PAID' ? 'Paid' : 'Confirmed'}
                  </th>
                  {filter === 'PAID' && (
                    <th className="text-right px-5 py-3 text-xs font-bold text-amber-800 uppercase tracking-wider">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className={filter === 'PAID' ? 'divide-y divide-amber-50' : 'divide-y divide-green-50'}>
                {data.map((s) => (
                  <tr key={s.id} className={filter === 'PAID' ? 'hover:bg-amber-50/40 transition-colors' : 'hover:bg-green-50/40 transition-colors'}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900 text-sm">{s.businessName}</p>
                      <p className="text-xs text-gray-400">{s.contactName} · {s.contactEmail}</p>
                      <p className="text-xs text-gray-400">{s.contactPhone}</p>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border"
                        style={{ background: '#fdf2f5', color: '#7a1f3d', borderColor: '#fecdd3' }}>{s.tier}</span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="font-bold text-gray-900">${s.amount.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-1">USD</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">
                        {formatDate(filter === 'PAID' ? s.paidAt : s.confirmedAt)}
                      </span>
                    </td>
                    {filter === 'PAID' && (
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => onConfirm(s)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 transition-colors shadow-sm">
                          <CheckCircle2 size={12} /> Confirm Sponsorship
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── MAIN ADMIN DASHBOARD ─────────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab]           = useState('pending');
  const [stats, setStats]       = useState(null);
  const [modal, setModal]       = useState(null);  // { user, action: 'confirm' | 'revoke' }
  const [actionLoading, setActionLoading] = useState(false);
  const [sponsorModal, setSponsorModal] = useState(null);       // ← add
  const [sponsorLoading, setSponsorLoading] = useState(false);  // ← add
  const [toast, setToast]       = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Load stats once on mount
  useEffect(() => {
    (async () => {
      try { const { data } = await getAdminStats(); setStats(data); }
      catch { /* 403 = not admin — interceptor will redirect */ }
    })();
  }, [refreshKey]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleConfirm = async () => {
    setActionLoading(true);
    try {
      await confirmPayment(modal.user.id);
      setModal(null);
      setRefreshKey(k => k + 1);
      showToast('Membership confirmed successfully.');
    } catch { showToast('Failed. Please try again.'); }
    finally { setActionLoading(false); }
  };

  const handleConfirmSponsorship = async () => {
  setSponsorLoading(true);
  try {
    await confirmSponsorship(sponsorModal.id);
    setSponsorModal(null);
    setRefreshKey(k => k + 1);
    showToast('Sponsorship confirmed successfully.');
  } catch { showToast('Failed. Please try again.'); }
  finally { setSponsorLoading(false); }
};

  const handleRevoke = async () => {
    setActionLoading(true);
    try {
      await revokeMembership(modal.user.id);
      setModal(null);
      setRefreshKey(k => k + 1);
      showToast('Membership revoked.');
    } catch { showToast('Failed. Please try again.'); }
    finally { setActionLoading(false); }
  };

  const handleLogout = async () => {
    try { await logout(); } catch { }
    clearAccessToken();
    router.push('/admin/login');
  };

  const TABS = [
    { key: 'pending', label: 'Pending Payments', icon: Clock,  badge: stats?.pendingPayments },
    { key: 'members', label: 'All Members',       icon: Users,  badge: stats?.totalUsers },
    { key: 'sponsorships', label: 'Sponsorships', icon: TrendingUp, badge: stats?.pendingSponsorships }, // ← add
    { key: 'events',  label: 'Events',            icon: CalendarDays, badge: stats?.totalEvents, href: '/admin/events' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap');
        .admin-root   { font-family: 'Outfit', sans-serif; }
        .display-font { font-family: 'Cormorant Garamond', serif; }
        @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .slide-up { animation: slideUp 0.35s ease both; }
        @keyframes toastIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .toast { animation: toastIn 0.3s ease both; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }
      `}</style>

      <div className="admin-root min-h-screen bg-[#f0f2f7] flex">

        {/* ── Sidebar ── */}
        <aside className="w-60 shrink-0 hidden lg:flex flex-col bg-[#1a2744] text-white min-h-screen sticky top-0">
          {/* Brand */}
          <div className="px-6 py-6 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center">
                <ShieldCheck size={15} />
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide">APPNA NC</p>
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-widest">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = !t.href && tab === t.key;
              return (
                <button key={t.key} onClick={() => t.href ? router.push(t.href) : setTab(t.key)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: active ? 'rgba(255,255,255,0.12)' : 'transparent', color: active ? 'white' : 'rgba(255,255,255,0.55)' }}>
                  <Icon size={16} />
                  <span className="flex-1 text-left">{t.label}</span>
                  {t.badge > 0 && (
                    <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                      style={{ background: t.key === 'pending' ? '#f97316' : 'rgba(255,255,255,0.15)', color: 'white' }}>
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 py-4 border-t border-white/10">
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col min-h-screen">

          {/* Top bar (mobile + desktop) */}
          <header className="bg-white border-b border-gray-100 px-4 sm:px-8 h-16 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div>
              <h1 className="display-font text-xl sm:text-2xl font-semibold text-gray-900 leading-tight">
                {tab === 'pending' ? 'Pending Payments' : 'All Members'}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                {tab === 'pending' ? 'Review and confirm Square payments' : 'Browse all registered accounts'}
              </p>
            </div>

            {/* Mobile nav tabs */}
            <div className="flex lg:hidden items-center gap-2">
              {TABS.map((t) => {
                const Icon = t.icon;
                return (
                  <button key={t.key} onClick={() => t.href ? router.push(t.href) : setTab(t.key)}
                    className="relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all"
                    style={{ background: tab === t.key && !t.href ? '#1a2744' : '#f3f4f6', color: tab === t.key && !t.href ? 'white' : '#6b7280' }}>
                    <Icon size={13} />
                    {t.label.split(' ')[0]}
                    {t.badge > 0 && tab !== t.key && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {t.badge > 99 ? '99+' : t.badge}
                      </span>
                    )}
                  </button>
                );
              })}
              <button onClick={handleLogout} className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <LogOut size={15} />
              </button>
            </div>
          </header>

          <main className="flex-1 scrollbar-thin overflow-y-auto px-4 sm:px-8 py-6 space-y-6">

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 slide-up">
              <StatCard icon={Users}        label="Total Members"     value={stats?.totalUsers}        color="#1a2744" />
              <StatCard icon={CheckCircle2} label="Active Members"    value={stats?.activeMembers}     color="#16a34a" sub={`${stats?.completedProfiles ?? 0} profiles complete`} />
              <StatCard icon={Clock}        label="Pending Payments"  value={stats?.pendingPayments}   color="#f97316" />
              <StatCard icon={TrendingUp}   label="Lifetime Members"  value={stats?.breakdown?.lifetime} color="#1e3a5f" sub={`${stats?.breakdown?.annual ?? 0} annual · ${stats?.breakdown?.student ?? 0} student`} />
            </div>

            {/* Tab content */}
           {/* Tab content */}
<div key={tab} className="slide-up">
  {tab === 'pending' && (
    <PendingPaymentsTable
      onConfirm={(user) => setModal({ user, action: 'confirm' })}
      refreshKey={refreshKey}
    />
  )}
  {tab === 'members' && (
    <UsersTable
      onRevoke={(user) => setModal({ user, action: 'revoke' })}
    />
  )}
{tab === 'sponsorships' && (
  <SponsorshipsTable                    // ← was PendingSponsorshipsTable
    onConfirm={(s) => setSponsorModal(s)}
    refreshKey={refreshKey}
  />
)}
</div>

          </main>
        </div>
      </div>

      {/* Confirmation modal */}
      {modal && (
        <ConfirmModal
          user={modal.user}
          action={modal.action}
          loading={actionLoading}
          onConfirm={modal.action === 'confirm' ? handleConfirm : handleRevoke}
          onCancel={() => setModal(null)}
        />
      )}

      {sponsorModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-green-50">
          <CheckCircle2 size={20} className="text-green-600" />
        </div>
        <h3 className="font-semibold text-gray-900">Confirm Sponsorship</h3>
      </div>
      <p className="text-sm text-gray-600 mb-5">
        Confirm the <strong>${sponsorModal.amount.toLocaleString()}</strong> {sponsorModal.tier} sponsorship from{' '}
        <strong>{sponsorModal.businessName}</strong> after verifying the Square payment?
      </p>
      <div className="flex gap-3">
        <button onClick={() => setSponsorModal(null)}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={handleConfirmSponsorship} disabled={sponsorLoading}
          className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 bg-green-600">
          {sponsorLoading ? <Loader2 size={14} className="animate-spin" /> : 'Confirm'}
        </button>
      </div>
    </div>
  </div>
)}

      {/* Toast notification */}
      {toast && (
        <div className="toast fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gray-900 text-white text-sm font-medium rounded-xl px-5 py-3 shadow-2xl flex items-center gap-2">
            <CheckCircle2 size={15} className="text-green-400 shrink-0" /> {toast}
          </div>
        </div>
      )}
    </>
  );
}
