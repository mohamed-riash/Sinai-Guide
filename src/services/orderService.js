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

  // Generates formatted WhatsApp Order Message (Section 18 requirement)
  generateWhatsAppOrderUrl: (order, businessWhatsapp) => {
    if (!businessWhatsapp) return null;

    // Clean phone number
    const cleanPhone = businessWhatsapp.replace(/[^0-9]/g, '');

    const itemsText = order.items.map((item, i) => (
      `${i + 1}. ${item.name}\n   Quantity: ${item.quantity}\n   Price: EGP ${item.price * item.quantity}`
    )).join('\n\n');

    const message =
      ` *New Order - Sinai Guide* 

*Customer Details:*
• Name: ${order.customerName}
• Phone: ${order.customerPhone}
• Delivery Address: ${order.address}
${order.notes ? `• Notes: ${order.notes}\n` : ''}
*Order Summary:*
${itemsText}

-----------------------------
*Subtotal:* EGP ${order.subtotal}
*Delivery Fee:* ${order.deliveryFee == null ? 'Not specified by the business' : `EGP ${order.deliveryFee}`}
*Total:* EGP ${order.total}

Thank you! Placed via Sinai Guide Platform.`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
};
