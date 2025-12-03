const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  producto: {
    type: String,
    required: true,
    trim: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precioUnit: {
    type: Number,
    required: true,
    min: 0
  },
  importe: {
    type: Number,
    required: true
  },
  moneda: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'MXN', 'COP', 'ARS', 'CLP', 'BRL']
  },
  fecha: {
    type: Date,
    required: true
  },
  fechaISO: {
    type: String,
    required: true
  },
  mes: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para búsquedas rápidas
ventaSchema.index({ uid: 1, fechaISO: 1 });
ventaSchema.index({ uid: 1, mes: 1 });
ventaSchema.index({ uid: 1, moneda: 1 });

module.exports = mongoose.model('Venta', ventaSchema);
