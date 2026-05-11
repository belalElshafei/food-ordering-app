'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';
import { MenuItem, Category } from '@/lib/menuData';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProductsTab({ locale }: { locale: 'en' | 'ar' }) {
  const t = useTranslations('admin');
  const tMenu = useTranslations('menu');
  const { items, addItem, updateItem, deleteItem } = useMenuStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const initialFormState = {
    nameEn: '',
    nameAr: '',
    descEn: '',
    descAr: '',
    price: '',
    category: 'burgers' as Category,
    image: '',
  };

  const [form, setForm] = useState(initialFormState);

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      nameEn: item.name.en,
      nameAr: item.name.ar,
      descEn: item.description.en,
      descAr: item.description.ar,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
    });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setForm(initialFormState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MenuItem = {
      id: editingItem ? editingItem.id : `item_${Date.now()}`,
      category: form.category,
      image: form.image || 'https://picsum.photos/400/300',
      price: Number(form.price),
      name: { en: form.nameEn, ar: form.nameAr },
      description: { en: form.descEn, ar: form.descAr },
    };

    if (editingItem) {
      updateItem(newItem);
    } else {
      addItem(newItem);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    if (confirm(t('deleteConfirm'))) {
      deleteItem(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display font-bold text-2xl text-charcoal-700">{t('products')}</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
        >
          <Plus size={16} />
          {t('addItem')}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-charcoal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-50 border-b border-charcoal-100 text-charcoal-500 text-sm font-semibold">
                <th className="p-4 w-20">{t('image')}</th>
                <th className="p-4">{t('name')}</th>
                <th className="p-4">{t('category')}</th>
                <th className="p-4">{t('price')}</th>
                <th className="p-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-charcoal-400">
                    {t('noItems')}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-charcoal-100 hover:bg-cream-50 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg bg-charcoal-100 overflow-hidden relative">
                        {item.image ? (
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-charcoal-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-charcoal-700">{item.name[locale]}</p>
                      <p className="text-xs text-charcoal-400">{item.name[locale === 'en' ? 'ar' : 'en']}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-semibold bg-cream-200 text-charcoal-600 px-2 py-1 rounded-md uppercase">
                        {tMenu(`categories.${item.category}`)}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-terracotta-500">
                      {item.price} {tMenu('currency')}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="overlay z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white rounded-3xl p-6 shadow-warm-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display font-bold text-2xl text-charcoal-700">
                    {editingItem ? t('editItem') : t('addItem')}
                  </h3>
                  <button onClick={handleClose} className="text-charcoal-400 hover:text-charcoal-700 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-600 mb-1">{t('itemName')}</label>
                      <input
                        type="text"
                        required
                        value={form.nameEn}
                        onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                        className="form-input py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-600 mb-1">{t('itemNameAr')}</label>
                      <input
                        type="text"
                        required
                        dir="rtl"
                        value={form.nameAr}
                        onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                        className="form-input py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-600 mb-1">{t('itemDesc')}</label>
                      <textarea
                        required
                        value={form.descEn}
                        onChange={(e) => setForm({ ...form, descEn: e.target.value })}
                        className="form-input py-2 h-20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-600 mb-1">{t('itemDescAr')}</label>
                      <textarea
                        required
                        dir="rtl"
                        value={form.descAr}
                        onChange={(e) => setForm({ ...form, descAr: e.target.value })}
                        className="form-input py-2 h-20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-600 mb-1">{t('itemPrice')}</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="form-input py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-600 mb-1">{t('itemCategory')}</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                        className="form-input py-2 bg-white"
                      >
                        <option value="burgers">{tMenu('categories.burgers')}</option>
                        <option value="pizza">{tMenu('categories.pizza')}</option>
                        <option value="drinks">{tMenu('categories.drinks')}</option>
                        <option value="desserts">{tMenu('categories.desserts')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-charcoal-600 mb-1">{t('itemImage')}</label>
                      <input
                        type="url"
                        required
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="https://"
                        className="form-input py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100 mt-6">
                    <button type="button" onClick={handleClose} className="btn-secondary py-2 px-5 text-sm">
                      {t('cancel')}
                    </button>
                    <button type="submit" className="btn-primary py-2 px-5 text-sm">
                      {t('save')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
