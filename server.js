var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');
const { request } = require('express');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product', function(req, res){

 var prod = new Product();
 prod.title = req.body.title;
 prod.price = req.body.price;
 
 prod.save(function(err, data){
   if (err){
res.status(500).send({error: "could not save product"});
   }else{
     res.send(data);
   }
 })
});

app.get('/product', function(req, res){
Product.find({}, function(err, result){
  if(err){
    res.status(500).send({error: "sorry, we could not get your product"});
  }else{
    res.send(result);
  }
})
});



app.post('/wishlist', function(req, res){
  var wish = new WishList();
  wish.title = req.body.title;
  wish.save(function(err, wishResult){
    if(err){
      res.status(500).send({error: "something went wrong"});
    }else{
      res.send(wishResult);
    }
  })
  });

app.get('/wishlist', function(req, res){
  WishList.find({}).populate({path:'products', model:'Product'}).exec(function(err, wishlists){
    if(err){
      res.status(500).send({error: "could not find wishlists"});
    }else{
      res.send(wishlists);
    }
  })
})

app.put('/wishlist/product/add', function(req, res){
  Product.findOne({_id: req.body.productId},function(err, produce){
    if(err){
      res.status(500).send({error: "sorry, could not find product"});
    }else{
      WishList.update({_id: req.body.wishlistId}, {$addToSet:
    {products: produce._id }}, function(err,w){
      if(err){
        res.status(500).send({error: "could not add product to wishlist"});
      }else{
        res.send("successfully added to wishlist");
      }
    })
    }
  })
});

app.listen(3000, function(){
  console.log('server running at port 3000...');
});