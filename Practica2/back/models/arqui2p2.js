const mongoose = require('mongoose')

const subscriberSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },
  vviento: {
    type: String,
    required: true
  },
  dviento: {
    type: String,
    required: true
  },
  intensidad: {
    type: Number,
    required: true
  },
  humedad: {
    type: Number,
    required: true
  },
  temperatura: {
    type: Number,
    required: true
  },
  lluvia: {
    type: Number,
    required: true
  }

})

module.exports = mongoose.model('arqui2p2', subscriberSchema)