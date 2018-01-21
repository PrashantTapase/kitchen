const Promise = require('bluebird');
const mongoose = require('mongoose');

Promise.promisifyAll(mongoose);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/research', {
    useMongoClient: true
});

mongoose.connection.on('open', ()=>{
    console.log('Connected to database');
});

mongoose.connection.on('error', ()=>{
    console.log('Could not connected');
});

mongoose.set('debug', true);
