import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ImageUploader } from '../../components/common/ImageUploader';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import { placeService } from '../../services/placeService';
import { Plus, Trash2, Edit, Check, X, Utensils } from 'lucide-react';

export const BusinessMenuPage = () => {
  const { user } = useAuth();
  const place = placeService.getByOwnerId(user?.id, user?.businessId);
  const { toastSuccess, toastError } = useToast();
  const { confirm } = useConfirm();

  const [menu, setMenu] = useState(place?.menu || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [categoryName, setCategoryName] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemImage, setItemImage] = useState('');

  const saveMenuToStorage = (newMenu) => {
    setMenu(newMenu);
    if (place && place.id) {
      placeService.update(place.id, { menu: newMenu });
    }
  };

  const handleOpenAddModal = (catName = '') => {
    setCategoryName(catName);
    setEditingItem(null);
    setItemName('');
    setItemPrice('');
    setItemDesc('');
    setItemImage('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (catName, item) => {
    setCategoryName(catName);
    setEditingItem(item);
    setItemName(item.name || '');
    setItemPrice(item.price || '');
    setItemDesc(item.description || '');
    setItemImage(item.image || '');
    setModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice) {
      toastError('يرجى إدخال اسم الطبق والسعر.');
      return;
    }

    let updatedMenu = [...menu];
    const categoryIndex = updatedMenu.findIndex(c => c.category === categoryName);

    const newItemObj = {
      id: editingItem ? editingItem.id : `m-${Date.now()}`,
      name: itemName.trim(),
      price: Number(itemPrice),
      description: itemDesc.trim(),
      image: itemImage,
      available: editingItem ? editingItem.available : true
    };

    if (categoryIndex > -1) {
      if (editingItem) {
        updatedMenu[categoryIndex].items = updatedMenu[categoryIndex].items.map(i => i.id === editingItem.id ? newItemObj : i);
      } else {
        updatedMenu[categoryIndex].items.push(newItemObj);
      }
    } else {
      updatedMenu.push({
        category: categoryName,
        items: [newItemObj]
      });
    }

    saveMenuToStorage(updatedMenu);
    toastSuccess(editingItem ? 'تم تحديث الطبق بنجاح!' : 'تمت إضافة طبق جديد للقائمة!');
    setModalOpen(false);
  };

  const handleDeleteItem = async (catName, itemId) => {
    const isConfirmed = await confirm({
      title: 'حذف طبق من القائمة؟',
      message: 'هل أنت متأكد من حذف هذا الطبق نهائياً من قائمة الطعام؟',
      confirmText: 'حذف الطبق',
      variant: 'danger'
    });

    if (!isConfirmed) return;

    let updatedMenu = menu.map(c => {
      if (c.category === catName) {
        return {
          ...c,
          items: c.items.filter(i => i.id !== itemId)
        };
      }
      return c;
    }).filter(c => c.items.length > 0);

    saveMenuToStorage(updatedMenu);
    toastSuccess('تم حذف الطبق من القائمة.');
  };

  const toggleAvailability = (catName, itemId) => {
    let updatedMenu = menu.map(c => {
      if (c.category === catName) {
        return {
          ...c,
          items: c.items.map(i => i.id === itemId ? { ...i, available: !i.available } : i)
        };
      }
      return c;
    });

    saveMenuToStorage(updatedMenu);
    toastSuccess('تم تحديث توفر الطبق.');
  };

  return (
    <DashboardLayout title="إدارة قائمة الطعام">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">أطباق قائمة الطعام</h2>
            <p className="text-xs text-slate-500">إدارة التصنيفات، الأطباق، الأسعار، الصور والتوفر اليومي</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => handleOpenAddModal()}>
            إضافة طبق جديد
          </Button>
        </div>

        {menu.length === 0 ? (
          <GlassCard hover={false} className="text-center py-12 text-slate-400">
            <Utensils className="w-12 h-12 stroke-1 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">لم يتم إنشاء تصنيفات قائمة الطعام بعد.</p>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => handleOpenAddModal()} className="mt-4">
              إضافة أول طبق
            </Button>
          </GlassCard>
        ) : (
          menu.map((cat, catIdx) => (
            <div key={catIdx} className="glass-panel p-6 flex flex-col gap-4 border border-white/20">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-base font-bold uppercase tracking-wider text-[#D49A45]">{cat.category}</h3>
                <Button variant="ghost" size="sm" icon={Plus} onClick={() => handleOpenAddModal(cat.category)}>
                  إضافة صنف
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cat.items.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl glass-card border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} width="56" height="56" loading="lazy" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      )}
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
                        <span className="text-xs font-bold text-[#A66F5B] block mt-1">{item.price} ج.م</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleAvailability(cat.category, item.id)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${item.available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}
                      >
                        {item.available ? 'متوفر' : 'نفد'}
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(cat.category, item)}
                        className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/20 transition cursor-pointer"
                        title="تعديل الطبق"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(cat.category, item.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                        title="حذف الطبق"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Item Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md glass-panel p-6 text-slate-100 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto rounded-3xl">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 left-4 text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-display text-white mb-4">
              {editingItem ? 'تعديل بيانات الطبق' : 'إضافة طبق جديد للقائمة'}
            </h3>

            <form onSubmit={handleSaveItem} className="flex flex-col gap-4">
              <Input label="اسم التصنيف" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
              <Input label="اسم الطبق" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
              <Input label="السعر (ج.م)" type="number" min="0" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} required />

              {/* Device Image Uploader for Dish / Menu Item */}
              <ImageUploader
                label="صورة الطبق / الصنف"
                hint="اختر صورة الطبق من جهازك (سيتم الضغط والمعالجة)"
                aspectRatio="aspect-[16/9]"
                value={itemImage}
                onChange={setItemImage}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">وصف مختصر للطبق</label>
                <textarea
                  rows="2"
                  placeholder="مكونات الطبق وطريقة التحضير..."
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs glass-input text-white focus:outline-none focus:border-[#A85F48]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>إلغاء</Button>
                <Button type="submit" variant="primary">حفظ الطبق</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
