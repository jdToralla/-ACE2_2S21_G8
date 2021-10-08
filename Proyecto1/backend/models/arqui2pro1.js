const mongoose = require('mongoose')

const subscriberSchema = new mongoose.Schema({
  fecha_inicio: {
    type: Date,
    required: true
  },
  fecha_fin: {
    type: Date,
    required: true
  },
  tipo: {
    type: Number,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  estado: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('arqui2pro1', subscriberSchema)