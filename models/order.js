/* {
  customerName: 'dim',
  email: 'd@p',
  address: 'asdfgg',
  phone: '1234567',
  cart: { items: [ [Object] ], cartTotalPrice: 17.2, totalQuantity: 1 }
}
{
  id: '6605360a08ef8bb63ad7ce16',
  name: 'Klivas',
  price: 17.2,
  quantity: 1,
  totalPrice: 17.2
} */

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        user: {
            userType: {
                mode: { type: String, default: 'guest' },
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
            },
            fullName: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
        },

        cart: {
            shop: {
                type: Schema.Types.ObjectId,
                ref: 'Shop',
            },
            items: [
                {
                    type: Object,
                    required: true,
                },
            ],
            shopTotalPrice: {
                type: Number,
                required: true,
            },
            shopTotalQuantity: {
                type: Number,
                required: true,
            },
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Order', OrderSchema);
