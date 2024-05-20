import Product from '../models/product.js';
import Shop from '../models/shop.js';
import Order from '../models/order.js';
import Category from '../models/category.js';
import SortingRule from '../models/sorting-rule.js';
import erorHelper from '../util/error.js';

export const getAllProducts = async (req, res, next) => {
    const cgid = req.query.cgid;
    const srule = req.query.srule;
    const pid = req.query.pid;
    let query = {};
    let products;

    try {
        if (pid) {
            query._id = pid;
        } else {
            if (cgid) {
                query.categories = { $in: [cgid] };
            }
        }

        if (srule) {
            const sortingRule = await SortingRule.findById(srule);
            if (!sortingRule) {
                const error = new Error(`Could not find sorting rule`);
                error.statusCode = 404;
                throw error;
            }
            const { key, direction } = sortingRule.rule;
            // console.log('key: ', key, 'value: ', value);
            products = await Product.find(query).sort({ [key]: direction });
        } else {
            products = await Product.find(query);
        }

        if (!products) {
            const error = new Error('No products found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(products);
    } catch (error) {
        erorHelper.generalError(error, next);
    }
};

export const getProduct = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            const error = new Error('Product not found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(product);
    } catch (error) {
        erorHelper.generalError(error, next);
    }
};

export const getAllShops = async (req, res, next) => {
    try {
        const shops = await Shop.find();

        if (!shops) {
            const error = new Error('No shops found.');
            error.statusCode = 404;
            throw error;
        }

        // const shopList = shops.map((shop) => {
        //     return { _id: shop._id, shopName: shop.shopName, categories: shop.categories };
        // });

        // res.status(200).json(shopList);
        res.status(200).json(shops);
    } catch (error) {
        erorHelper.generalError(error, next);
    }
};

export const getShopProducts = async (req, res, next) => {
    const shopId = req.params.shopId;
    const cgid = req.query.cgid;
    const srule = req.query.srule;
    const pid = req.query.pid;
    let products;
    let query = {};

    try {
        let shop = await Shop.findById(shopId)
            // .populate('products')
            // .populate('categories')
            .exec();

        if (!shop) {
            const error = new Error('Shop not found.');
            error.statusCode = 404;
            throw error;
        }

        if (pid) {
            query._id = pid;
        } else {
            query._id = { $in: shop.products };

            if (cgid) {
                query.categories = { $in: [cgid] };
            }
        }

        if (srule) {
            const sortingRule = await SortingRule.findById(srule);
            if (!sortingRule) {
                const error = new Error(`Could not find sorting rule`);
                error.statusCode = 404;
                throw error;
            }
            const { key, direction } = sortingRule.rule;
            products = await Product.find(query).sort({ [key]: direction });
        } else {
            products = await Product.find(query);
        }

        if (!products) {
            const error = new Error('Products for this shop can not be found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(products);
    } catch (error) {
        erorHelper.generalError(error, next);
    }
};

export const postOrder = async (req, res, next) => {
    const order = req.body;

    if (!order) {
        const error = new Error('No order data');
        error.statusCode = 400;
        throw error;
    }

    try {
        const newOrderDoc = new Order(order);
        const response = await newOrderDoc.save();

        res.status(201).json({ message: 'Order saved.', orderId: response._id });
    } catch (error) {
        erorHelper.generalError(error, next);
    }
};

export const getOrderHistory = async (req, res, next) => {
    const userId = req.userId;
    console.log(req.userId);

    try {
        if (!userId) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        }

        let orders = await Order.find({ 'user.userType.userId': userId }).populate('cart.shop');
        console.log('orders:', orders);

        if (!orders) {
            orders = [];
        }

        res.status(200).json(orders);
    } catch (error) {
        erorHelper.generalError(error, next);
    }
};

export const getShopCategories = (req, res, next) => {
    const shopId = req.params.shopId;
};

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();

        if (!categories) {
            const error = new Error('No Categories found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(categories);
    } catch (error) {
        erorHelper.generalError(error, next);
    }
};

export const getAllSortingRules = async (req, res, next) => {
    try {
        const sortingRules = await SortingRule.find();

        if (!sortingRules) {
            const error = new Error('No Sorting Rules found.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json(sortingRules);
    } catch (error) {
        erorHelper.generalError(error, next);
    }
};
