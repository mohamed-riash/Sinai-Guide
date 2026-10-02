import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { MetricCard } from '../../components/common/MetricCard';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { storageService, KEYS } from '../../services/storageService';
import { SYSTEM_ADMIN_ID, userService } from '../../services/authService';
import { EmptyState } from '../../components/common/EmptyState';
import { placeService } from '../../services/placeService';
import { Users, Store, MapPin, ShoppingBag, Trash2, CheckCircle, XCircle, Eye, Clock, X, ShieldCheck } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';

const userRoleLabels = {
  customer: '\u0645\u0633\u062a\u062e\u062f\u0645',
  business_owner: '\u0635\u0627\u062d\u0628 \u0645\u0643\u0627\u0646',
  admin: '\u0645\u0634\u0631\u0641',
};
const userRoleEmptyStates = {
  customer: '\u0644\u0627 \u064a\u0648\u062c\u062f \u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646 \u062d\u062a\u0649 \u0627\u0644\u0622\u0646.',
  business_owner: '\u0644\u0627 \u064a\u0648\u062c\u062f \u0623\u0635\u062d\u0627\u0628 \u0623\u0645\u0627\u0643\u0646 \u0645\u0633\u062c\u0644\u0648\u0646 \u062d\u062a\u0649 \u0627\u0644\u0622\u0646.',
  admin: '\u0644\u0627 \u064a\u0648\u062c\u062f \u0645\u0634\u0631\u0641\u0648\u0646 \u0625\u0636\u0627\u0641\u064a\u0648\u0646.',
};

export const AdminDashboardPage = () => {
  const { toastSuccess, toastError } = useToast();
  const { confirm } = useConfirm();

  const [users, setUsers] = useState(() => storageService.getItem(KEYS.USERS, []));
  const [places, setPlaces] = useState(() => placeService.getAll());
  const [orders] = useState(() => storageService.getItem(KEYS.ORDERS, []));
  const [bookings] = useState(() => storageService.getItem(KEYS.BOOKINGS, []));

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'places' | 'users'
  const [userRoleTab, setUserRoleTab] = useState('customer');
  const [userSearch, setUserSearch] = useState('');
  const [reviewingPlace, setReviewingPlace] = useState(null);

  const pendingPlaces = places.filter(p => p.status === 'pending');
  const approvedCount = places.filter(p => !p.status || p.status === 'approved').length;

  const refreshPlaces = () => {
    setPlaces(placeService.getAll());
  };

  const handleApprovePlace = async (place) => {
    try {
      placeService.updateStatus(place.id, 'approved');
      refreshPlaces();
      if (reviewingPlace?.id === place.id) {
        setReviewingPlace(null);
      }
      toastSuccess('تمت الموافقة على المكان وأصبح ظاهراً للمستخدمين.');
    } catch (err) {
      toastError(err.message || 'فشل في قبول المكان.');
    }
  };

  const handleRejectPlace = async (place) => {
    const isConfirmed = await confirm({
      title: 'رفض طلب إضافة المكان؟',
      message: `هل أنت متأكد من رفض نشر المكان "${place.nameAr || place.name}"؟ لن يظهر المكان للمستخدمين.`,
      confirmText: 'رفض الطلب',
      variant: 'danger'
    });

    if (!isConfirmed) return;

    try {
      placeService.updateStatus(place.id, 'rejected');
      refreshPlaces();
      if (reviewingPlace?.id === place.id) {
        setReviewingPlace(null);
      }
      toastSuccess('تم رفض طلب إضافة المكان.');
    } catch (err) {
      toastError(err.message || 'فشل في رفض الطلب.');
    }
  };

  const handleDeleteUser = async (userId) => {
    const isConfirmed = await confirm({
      title: 'حذف حساب المستخدم؟',
      message: 'هل أنت متأكد من أنك تريد حذف هذا المستخدم من المنصة؟',
      confirmText: 'حذف المستخدم',
      variant: 'danger'
    });

    if (!isConfirmed) return;

    try {
      setUsers(userService.delete(userId));
      toastSuccess('تم حذف حساب المستخدم.');
    } catch (err) {
      toastError(err.message);
    }
  };

  const handleDeletePlace = async (placeId) => {
    const isConfirmed = await confirm({
      title: 'حذف المكان نهائياً؟',
      message: 'هل أنت متأكد من أنك تريد حذف هذا المكان من دليل سيناء نهائياً؟',
      confirmText: 'حذف المكان',
      variant: 'danger'
    });

    if (!isConfirmed) return;

    placeService.delete(placeId);
    refreshPlaces();
    toastSuccess('تم حذف المكان من الدليل.');
  };

  return (
    <AdminLayout title="إدارة منصة دليل سيناء">
      <div className="flex flex-col gap-8">
        {/* Statistics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="طلبات المعالم المعلقة" value={pendingPlaces.length} change="طلبات بانتظار الاعتماد" icon={Clock} />
          <MetricCard title="الأماكن المعتمدة" value={approvedCount} change="نشطة ومنشورة" icon={Store} />
          <MetricCard title="المستخدمون المسجلون" value={users.length} change="حسابات مسجلة" icon={Users} />
          <MetricCard title="إجمالي الطلبات وحجوزات" value={orders.length + bookings.length} change="عمليات مكتملة" icon={ShoppingBag} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard title="\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646" value={users.filter((user) => user.role === 'customer').length} change="\u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646" icon={Users} />
          <MetricCard title="\u0623\u0635\u062d\u0627\u0628 \u0627\u0644\u0623\u0645\u0627\u0643\u0646" value={users.filter((user) => user.role === 'business_owner').length} change="\u062d\u0633\u0627\u0628\u0627\u062a \u0623\u0635\u062d\u0627\u0628 \u0627\u0644\u0623\u0645\u0627\u0643\u0646" icon={Store} />
          <MetricCard title="\u0627\u0644\u0645\u0634\u0631\u0641\u0648\u0646" value={users.filter((user) => user.role === 'admin').length} change="\u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0645\u0634\u0631\u0641\u064a\u0646" icon={ShieldCheck} />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'requests' ? 'bg-[var(--color-digital-blue-500)] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>طلبات إضافة الأماكن</span>
            {pendingPlaces.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                {pendingPlaces.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('places')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'places' ? 'bg-[var(--color-digital-blue-500)] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>جميع الأماكن المسجلة ({places.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'users' ? 'bg-[var(--color-digital-blue-500)] text-white shadow-md' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إدارة المستخدمين ({users.length})</span>
          </button>
        </div>

        {/* Pending Requests Tab */}
        {activeTab === 'requests' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-[var(--color-text-primary)]">طلبات إضافة الأماكن المعلقة ({pendingPlaces.length})</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">مراجعة بيانات واعتماد الأماكن الجديدة قبل ظهورها للجمهور</p>
              </div>
            </div>

            {pendingPlaces.length === 0 ? (
              <GlassCard hover={false} className="p-12 text-center text-[var(--color-text-muted)] border border-white/10">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-40 text-emerald-500" />
                <p className="text-base font-bold text-[var(--color-text-primary)]">لا توجد طلبات جديدة بانتظار المراجعة.</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">تمت مراجعة واعتماد جميع طلبات الأماكن المقدمة.</p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingPlaces.map(place => (
                  <GlassCard key={place.id} hover={false} className="p-6 flex flex-col justify-between gap-5 border border-amber-500/30 shadow-xl bg-amber-500/5">
                    <div className="flex flex-col gap-4">
                      {/* Image Preview & Category Badge */}
                      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/20">
                        <img src={place.image} alt={place.name} loading="lazy" className="w-full h-full object-cover" />
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                          قيد المراجعة
                        </span>
                      </div>

                      {/* Header Info */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text-secondary)] mb-1">
                          <span>{place.cityId} • {place.categoryId}</span>
                          <span className="text-[var(--color-digital-blue-500)] font-extrabold">
                            {place.minPrice !== undefined && place.maxPrice !== undefined ? `${place.minPrice} – ${place.maxPrice} ج.م` : place.priceRange || 'لم يحدد السعر'}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold font-display text-[var(--color-text-primary)]">{place.nameAr || place.name}</h4>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2 leading-relaxed">{place.description}</p>
                      </div>

                      {/* Detail Snippets */}
                      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/5 text-xs text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[var(--color-digital-blue-500)] shrink-0" />
                          <span className="truncate">{place.address}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Clock className="w-3.5 h-3.5 text-digital-blue-500 shrink-0" />
                          <span className="truncate">{place.openingHours || `${place.openingTime || ''} - ${place.closingTime || ''}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => setReviewingPlace(place)}
                        className="text-xs font-bold"
                      >
                        مراجعة التفاصيل
                      </Button>

                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          icon={XCircle}
                          onClick={() => handleRejectPlace(place)}
                          className="px-4 font-bold text-xs"
                        >
                          رفض
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          icon={CheckCircle}
                          onClick={() => handleApprovePlace(place)}
                          className="px-4 font-bold text-xs shadow-md"
                        >
                          قبول
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Places Tab */}
        {activeTab === 'places' && (
          <GlassCard hover={false} className="p-6 flex flex-col gap-4 border border-white/20 dark:border-white/10 shadow-xl">
            <h3 className="text-base font-bold font-display text-[var(--color-text-primary)]">قائمة جميع أماكن المنصة ({places.length})</h3>
            <div className="flex flex-col gap-3">
              {places.length ? places.map(p => {
                const status = p.status || 'approved';
                return (
                  <div key={p.id} className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--color-border-subtle)] flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={p.image} alt={p.name} width="56" height="56" loading="lazy" className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[var(--color-text-primary)] text-sm truncate">{p.nameAr || p.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            status === 'approved' ? 'bg-emerald-500/20 text-emerald-500' :
                            status === 'rejected' ? 'bg-rose-500/20 text-rose-500' :
                            'bg-amber-500/20 text-amber-500'
                          }`}>
                            {status === 'approved' ? 'تمت الموافقة' : status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">{p.cityId} • {p.categoryId} • {p.minPrice ? `${p.minPrice}-${p.maxPrice} ج.م` : p.priceRange}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {status === 'pending' && (
                        <>
                          <Button size="xs" variant="success" icon={CheckCircle} onClick={() => handleApprovePlace(p)}>قبول</Button>
                          <Button size="xs" variant="danger" icon={XCircle} onClick={() => handleRejectPlace(p)}>رفض</Button>
                        </>
                      )}
                      <button onClick={() => handleDeletePlace(p.id)} className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              }) : <EmptyState title="\u0644\u0627 \u062a\u0648\u062c\u062f \u0623\u0645\u0627\u0643\u0646 \u0645\u0636\u0627\u0641\u0629 \u062d\u062a\u0649 \u0627\u0644\u0622\u0646." description="\u0633\u062a\u0638\u0647\u0631 \u0627\u0644\u0623\u0645\u0627\u0643\u0646 \u0647\u0646\u0627 \u0628\u0639\u062f \u0625\u0646\u0634\u0627\u0626\u0647\u0627." />}
            </div>
          </GlassCard>
        )}

        {/* Registered Users Tab */}
        {activeTab === 'users' && (
          <GlassCard hover={false} className="p-6 flex flex-col gap-4 border border-white/20 dark:border-white/10 shadow-xl">
            <div className="flex flex-wrap gap-2">
              {[
                ['customer', '\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646'],
                ['business_owner', '\u0623\u0635\u062d\u0627\u0628 \u0627\u0644\u0623\u0645\u0627\u0643\u0646'],
                ['admin', '\u0627\u0644\u0645\u0634\u0631\u0641\u0648\u0646']
              ].map(([role, label]) => <button key={role} onClick={() => setUserRoleTab(role)} className={`px-4 py-2 rounded-xl text-sm font-bold ${userRoleTab === role ? 'bg-[var(--color-digital-blue-500)] text-white' : 'bg-black/5 dark:bg-white/5 text-[var(--color-text-secondary)]'}`}>{label} ({users.filter((user) => user.role === role).length})</button>)}
            </div>
            <input value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="البحث بالاسم أو البريد الإلكتروني" className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-transparent px-4 py-3 text-sm" />
            {(() => {
              const visibleUsers = users.filter((user) => user.role === userRoleTab && `${user.name} ${user.email}`.toLowerCase().includes(userSearch.trim().toLowerCase()));
              return visibleUsers.length ? visibleUsers.map((u) => (
                <div key={u.id} className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--color-border-subtle)] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    {u.avatar ? <img src={u.avatar} alt={u.name} width="36" height="36" loading="lazy" className="w-9 h-9 rounded-xl object-cover border border-[var(--color-digital-blue-500)]" /> : <div className="w-9 h-9 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center"><Users className="w-4 h-4" /></div>}
                    <div className="min-w-0"><h4 className="font-bold text-[var(--color-text-primary)]">{u.name} {u.id === SYSTEM_ADMIN_ID && <span className="text-digital-blue-600"> · {'\u0645\u062f\u064a\u0631 \u0627\u0644\u0646\u0638\u0627\u0645'}</span>}</h4><p className="text-[11px] text-[var(--color-text-secondary)]">{u.email} · {u.phone || '—'} · {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</p>{u.role === 'business_owner' && <p className="mt-1 truncate text-[11px] text-[var(--color-text-secondary)]">{placeService.getByOwnerId(u.id, u.businessId)?.nameAr || placeService.getByOwnerId(u.id, u.businessId)?.name || '\u0644\u0645 \u064a\u0636\u0641 \u0645\u0643\u0627\u0646\u064b\u0627 \u0628\u0639\u062f'}</p>}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-digital-blue-500/20 text-digital-blue-700 dark:text-digital-blue-300">{userRoleLabels[u.role]}{u.role === 'business_owner' && placeService.getByOwnerId(u.id, u.businessId)?.status === 'pending' ? ` · ${'\u0642\u064a\u062f \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629'}` : ''}</span>{u.id !== SYSTEM_ADMIN_ID && !u.protected && <button onClick={() => handleDeleteUser(u.id)} aria-label={`حذف ${u.name}`} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/20 transition-colors"><Trash2 className="w-4 h-4" /></button>}</div>
                </div>
              )) : <EmptyState title={userRoleEmptyStates[userRoleTab]} description={userSearch ? '\u0644\u0627 \u062a\u0648\u062c\u062f \u0646\u062a\u0627\u0626\u062c \u062a\u0637\u0627\u0628\u0642 \u0627\u0644\u0628\u062d\u062b.' : ''} />;
            })()}
          </GlassCard>
        )}      </div>

      {/* Review Place Details Modal */}
      {reviewingPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setReviewingPlace(null)} />
          <div className="relative z-10 w-full max-w-2xl glass-panel p-6 text-[var(--color-text-primary)] shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto rounded-3xl">
            <button onClick={() => setReviewingPlace(null)} className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white rounded-xl">
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                <Clock className="w-4 h-4" />
                <span>طلب إضافة مكان جديد بانتظار الاعتماد</span>
              </div>

              <h2 className="text-2xl font-black font-display text-[var(--color-text-primary)]">{reviewingPlace.nameAr || reviewingPlace.name}</h2>

              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
                <img src={reviewingPlace.image} alt={reviewingPlace.name} className="w-full h-full object-cover" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl glass-l1 border border-white/10">
                  <span className="text-[var(--color-text-muted)] block">المدينة:</span>
                  <span className="font-bold text-[var(--color-text-primary)]">{reviewingPlace.cityId}</span>
                </div>
                <div className="p-3 rounded-xl glass-l1 border border-white/10">
                  <span className="text-[var(--color-text-muted)] block">التصنيف:</span>
                  <span className="font-bold text-[var(--color-text-primary)]">{reviewingPlace.categoryId}</span>
                </div>
                <div className="p-3 rounded-xl glass-l1 border border-white/10">
                  <span className="text-[var(--color-text-muted)] block">نطاق الأسعار:</span>
                  <span className="font-bold text-[var(--color-digital-blue-500)]">{reviewingPlace.minPrice !== undefined ? `${reviewingPlace.minPrice} – ${reviewingPlace.maxPrice} ج.م` : reviewingPlace.priceRange}</span>
                </div>
                <div className="p-3 rounded-xl glass-l1 border border-white/10">
                  <span className="text-[var(--color-text-muted)] block">مواعيد العمل:</span>
                  <span className="font-bold text-[var(--color-text-primary)]">{reviewingPlace.openingHours || `${reviewingPlace.openingTime} - ${reviewingPlace.closingTime}`}</span>
                </div>
                <div className="p-3 rounded-xl glass-l1 border border-white/10">
                  <span className="text-[var(--color-text-muted)] block">رقم الهاتف:</span>
                  <span className="font-bold text-[var(--color-text-primary)]" dir="ltr">{reviewingPlace.phone}</span>
                </div>
                <div className="p-3 rounded-xl glass-l1 border border-white/10">
                  <span className="text-[var(--color-text-muted)] block">واتساب:</span>
                  <span className="font-bold text-[var(--color-text-primary)]" dir="ltr">{reviewingPlace.whatsapp}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-l1 border border-white/10 text-xs flex flex-col gap-1">
                <span className="font-bold text-[var(--color-text-primary)]">العنوان والموقع:</span>
                <span className="text-[var(--color-text-secondary)]">{reviewingPlace.address}</span>
              </div>

              <div className="p-4 rounded-xl glass-l1 border border-white/10 text-xs flex flex-col gap-1">
                <span className="font-bold text-[var(--color-text-primary)]">الوصف المفصل:</span>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">{reviewingPlace.description}</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
                <Button variant="danger" icon={XCircle} onClick={() => handleRejectPlace(reviewingPlace)}>رفض الطلب</Button>
                <Button variant="success" icon={CheckCircle} onClick={() => handleApprovePlace(reviewingPlace)}>الموافقة واعتماد النشر</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
