const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    cart: {
        items: [
            {
                productId:{
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                }, 
                qty: {
                    type: Number, 
                    required: true
                }
            }
        ],
    }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    const newCartItems = [...this.cart.items];
    if(cartProductIndex >= 0) newCartItems[cartProductIndex].qty+=1;
    else {
        newCartItems.push({
            productId: product._id,
            qty: 1
        });
    }
    this.cart.items = newCartItems;

    return this.save();
};

userSchema.methods.deleteFromCart = function(product) {
    const updatedCartItems = this.cart.items.filter(p => {
        return p.productId != product._id;
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart.items = [];
    return this.save();
}

module.exports = mongoose.model("User", userSchema);