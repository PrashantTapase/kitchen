const productModel = require('../models/k.js');
const async = require('async');

const prediction = (req, res) => {

    console.log('body',req.body);
    const {dish, predicted} = req.body;

    if(dish && predicted){
        const product = new productModel.product({
            dish: dish,
            predicted: predicted
        });

        product.saveAsync()
            .then((product)=>{
                console.log(product);
                 res.json(product);
            }).catch((err)=>{
                console.log(err);
                //res.json(err.message);
            });
    }else{
        console.error('Mandatory field not found');
    }
}

const report = (req, res) => {
    
    const products = productModel.product.find().lean().exec();

    /*convert json data to tabular format
    Using fs module create new file 
    Download that file
    */

    res.download('text.pdf', 'report.pdf', function(err){
      if (err) {
        console.log(err)
      } else {
        console.log('done')
      }
    });
}

const all = (req, res) => {

    console.log('Get all products');
    const products = productModel.product.find().lean().exec();
    const pendingOrders = productModel.order.aggregate([
		    {$match: { 'status':'pending'}},
		    {$group: { _id: '$dishRef', sum: {$sum: '$quantity'}}}
	  ]);

    Promise.all([products,pendingOrders])
        .then((records)=>{
            console.log(records[0], records[1]);
            combine( records[0], records[1], function(result){
                console.log('result',result);
                res.json(result);
            });
        }).catch((err)=>{
            console.log(err);
            res.json(err.message);
        });
}

function combine(listProducts, listOrders, callback){
    async.each(listProducts, function(json, cb1){
        async.each(listOrders, function(object, cb2){
            if((json._id).toString() == (object._id).toString()){
                json.quantity = object.sum;
                delete listOrders[object];
            }
            cb2();
        }, function(err){
            if(err){
                console.error('Error =>', err);
            }else{
                cb1();
            }
        });
    },function(err){
        if(err){
            console.error('Error =>', err);
        }else{
            console.log('done', listProducts);
            callback(listProducts);
        }
    });
}

module.exports = {
    prediction: prediction,
    report: report,
    all: all
}
