import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  item: {
    id: String,
    name: {
      en: String,
      ar: String,
    },
    price: Number,
    image: String,
    category: String,
  },
  quantity: Number,
});

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  notes: String,
  items: [OrderItemSchema],
  subtotal: Number,
  deliveryFee: Number,
  total: Number,
  paymentMethod: {
    type: String,
    enum: ['online', 'cash'],
    required: true,
  },
  status: {
    type: String,
    enum: ['received', 'preparing', 'delivery', 'delivered'],
    default: 'received',
  },
  statusHistory: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
