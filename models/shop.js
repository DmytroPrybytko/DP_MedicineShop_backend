import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ShopSchema = new Schema(
    {
        shopName: {
            type: String,
            required: true,
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        address: {
            type: String,
            required: true,
        },
        categories: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Category',
            },
        ],
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Shop', ShopSchema);
