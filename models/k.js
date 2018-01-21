const mongoose = require('mongoose');
const db_config = require('../config/db_config');

const product = new mongoose.Schema({
    dish: 'string',
    produced: {
        type: 'number',
        default: 0
    },
    predicted: 'number'
}, {
    versionKey: false
});

const order = new mongoose.Schema({
    dishRef: {type: 'ObjectId', ref: 'product'},
    quantity: 'number',
    status: {
        type: 'string',
        enum: ['done', 'pending'],
        default: 'pending'
    }
}, {
    versionKey: false
});

const productModel = mongoose.model('product', product);
const orderModel = mongoose.model('order', order);

module.exports = {
    product: productModel,
    order: orderModel
}
