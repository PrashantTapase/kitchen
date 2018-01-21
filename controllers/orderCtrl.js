const orderModel = require('../models/k.js');

const order = (req, res) => {

    const {dish} = req.body;
    const {quantity} = req.body;

    console.log(req.body);

    if(dish && quantity){

        const order = new orderModel.order({
            quantity: quantity,
            dishRef: dish
        });

        order.saveAsync()
            .then((order)=>{
                console.log(order);
                /*res.render(__dirname+'/public/views/index.html');

                  io.on('connection', function(socket){
                  console.log('connected')
                  // socket.on('one', function(msg){

                  // console.log('before message: ' + msg);
                  socket.emit('two', 'Check');
                  // console.log('after message: ' + msg);
                  // });
                  });*/
                res.json(order);
            }).catch((err)=>{
                console.log(err);
                //res.render(__dirname+'/public/views/index.html');
            });
    }else{
        res.json('Mandatory field not found');
    }
}

const complete = (req, res) =>{
    const {dish} = req.body;
    const {quantity} = req.body;

    if(dish && quantity){

        const orderQuery = orderModel.order
              .update({dishRef : dish, status: 'pending'}, {status: 'done'}, {multi: true})
              .lean()
              .exec();

        const productQuery = orderModel.product
              .update({_id: dish}, {$inc: {produced: quantity}})
              .lean()
              .exec();

        Promise.all([orderQuery, productQuery])
            .then((result)=>{
                console.log(result);
                res.json('Order completed');
            }).catch((err)=>{
                res.json(err);
                console.error(err);
            });

    }else{
        res.json('mandatory field not found');
    }
}

module.exports = {
    order: order,
    complete: complete
} 
