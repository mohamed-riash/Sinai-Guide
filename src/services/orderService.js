import { storageService, KEYS } from './storageService';

export const orderService = {
  getOrders: () => {
    return storageService.getItem(KEYS.ORDERS, []);
  },

  getOrdersByCustomerPhone: (phone) => {
    const orders = storageService.getItem(KEYS.ORDERS, []);
    return orders.filter(o => o.customerPhone === phone);
  },

  getOrdersByPlaceId: (placeId) => {
    const orders = storageService.getItem(KEYS.ORDERS, []);
    return orders.filter(o => o.placeId === placeId);
  },

  createOrder: (orderData) => {
    const orders = storageService.getItem(KEYS.ORDERS, []);
    const newOrder = {
      ...orderData,
      id: `ord-${Date.now().toString().slice(-6)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    storageService.setItem(KEYS.ORDERS, orders);
    return newOrder;
  },

  updateOrderStatus: (orderId, status) => {
    const orders = storageService.getItem(KEYS.ORDERS, []);
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error('Order not found.');

    orders[index].status = status;
    storageService.setItem(KEYS.ORDERS, orders);
    return orders[index];
  },

  // Generates a formatted WhatsApp order message
  generateWhatsAppOrderUrl: (order, businessWhatsapp) => {
    if (!businessWhatsapp) return null;

    const cleanPhone = businessWhatsapp.replace(/[^0-9]/g, '');

    const itemsText = order.items
      .map((item, index) => (
        `${index + 1}. ${item.name}\n` +
        `   الكمية: ${item.quantity}\n` +
        `   السعر: ${Number(item.price * item.quantity).toFixed(2)} جنيه`
      ))
      .join('\n\n');

    const formatPrice = (price) =>
      `${Number(price).toFixed(2)} جنيه`;

    const message = `
 *طلب جديد من دليل سيناء*
━━━━━━━━━━━━━━━━━━

 *بيانات العميل*
• الاسم: ${order.customerName}
• رقم الهاتف: ${order.customerPhone}
• عنوان التوصيل: ${order.address}
${order.notes?.trim() ? `• ملاحظات: ${order.notes.trim()}\n` : ''}
━━━━━━━━━━━━━━━━━━

 *تفاصيل الطلب*
${itemsText}

━━━━━━━━━━━━━━━━━━
 *ملخص الحساب*
• قيمة المنتجات: ${formatPrice(order.subtotal)}
• رسوم التوصيل: ${order.deliveryFee == null
        ? 'غير محددة'
        : formatPrice(order.deliveryFee)
      }
• *الإجمالي النهائي: ${formatPrice(order.total)}*

━━━━━━━━━━━━━━━━━━
 يرجى تأكيد استلام الطلب وتحديد الوقت المتوقع للتوصيل.

 عبر منصة *دليل سيناء*
  `.trim();

    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
};
