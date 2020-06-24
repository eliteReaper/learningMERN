const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");

module.exports.getShopProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log("Didnt get shop products: " + err);
    });
};

module.exports.postCart = (req, res, next) => {
  req.user
    .addToCart(req.body)
    .then((result) => {
      res.send("Product Added To Cart");
    })
    .catch((err) => {
      console.log("Couldnt post to cart: " + err);
    });
};

module.exports.getCartItems = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      res.send(user.cart.items);
    })
    .catch((err) => {
      console.log("Coudnt get all cart Products for user: ", err);
    });
};

module.exports.deleteCartItems = (req, res, next) => {
  req.user
    .deleteFromCart(req.body)
    .then((result) => {
      res.send("Deleted Cart Item");
    })
    .catch((err) => {
      console.log("Didnt Delete Product from user model: " + err);
    });
};

module.exports.getOrders = (req, res, next) => {
  Order.find({ userId: req.user._id })
    .then((orders) => {
      const toSend = orders.map((order) => {
        return {
          products: order.products,
        };
      });
      res.send(toSend);
    })
    .catch((err) => {
      console.log("Didnt get orders: " + err);
    });
};

module.exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          product: { ...item.productId._doc },
          qty: item.qty,
        };
      });
      const order = new Order({
        products: products,
        userId: user._id,
        name: user.name,
      });
      return order.save();
    })
    .then((result) => {
      req.user.clearCart();
    })
    .then((result) => {
      res.send("Order Placed");
    })
    .catch((err) => {
      console.log("Didnt place order: " + err);
    });
};
