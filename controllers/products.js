const Product = require('../models/product');

exports.postAddProduct = (req, res, next)=>{
    const data = {
        title: req.body.title,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        userId: req.session.user
    };
    // console.log(data);
    const product = new Product(data);
    product
        .save()
        .then(response => {
            res.status(200).send("Product Added");
        })
        .catch(err =>{
            console.log("Didnt add product " + err);
        }); 
};

exports.getAllProducts = (req, res, next) =>{
    Product.find()
        .then(products => res.send(products))
        .catch(err => console.log("Didnt get all products " + err));
}

exports.editProduct = (req, res, next)=>{
    Product.findById(req.body._id)
    .then(product =>{
        product.title = req.body.title;
        product.imageUrl = req.body.imageUrl;
        product.price = req.body.price;
        product.description = req.body.description;
        return product.save();
    })
    .then(result=>{
        res.status(200).send("Updated Product");
    })
    .catch(err =>{
        console.log("Didnt Update Product" + err);
    })
}

exports.deleteProduct = (req, res, next)=>{
    Product.findByIdAndRemove(req.body._id)
    .then(result =>{
        res.send("Deleted");
    })
    .catch(err =>{
        console.log("Didnt delete product : " + err);
    })
}