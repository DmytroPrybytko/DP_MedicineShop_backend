import Shop from '../../models/shop.js';
import Product from '../../models/product.js';
import Category from '../../models/category.js';
import SortingRule from '../../models/sorting-rule.js';

const dummySortingRules = [
    {
        name: 'Price: Low to High',
        rule: {
            key: 'price',
            direction: 'ascending',
        },
    },
    {
        name: 'Price: High to Low',
        rule: {
            key: 'price',
            direction: 'descending',
        },
    },
];

export const dummyProducts = [
    {
        name: 'Paracetamol',
        description: 'This is for cases of high body temperature',
        price: 15.9,
        imageUrl: '/images/paracetamol.jpg',
        categories: ['Antipyretic', 'Painkiller'],
    },
    {
        name: 'Tempalgin',
        description: 'This is for cases of headache',
        price: 19.99,
        imageUrl: '/images/tempalgin.jpg',
        categories: ['Painkiller'],
    },
    {
        name: 'Vitaminex',
        description: 'Vitamin A,D complex',
        price: 35.7,
        imageUrl: '/images/vitaminex.jpg',
        categories: ['Vitamine complex'],
    },
    {
        name: 'Pangastro',
        description: 'This is for cases of stomach pain',
        price: 35.5,
        imageUrl: '/images/pangastro.jpg',
        categories: ['Gastric', 'Painkiller'],
    },
    {
        name: 'Klivas',
        description: 'This is for cases of heart pain',
        price: 17.2,
        imageUrl: '/images/klivas.jpg',
        categories: ['Heart pain', 'Painkiller'],
    },
    {
        name: 'Biprestarium',
        description: 'This medicine is to normalize blood pressure',
        price: 24.9,
        imageUrl: '/images/biprestarium.jpg',
        categories: ['Blood presure control'],
    },
    {
        name: 'Lekarstvo N7',
        description: 'This is for all cases))',
        price: 99.99,
        imageUrl: '/images/lekN7.jpg',
        categories: ['All cases'],
    },
];

export const dummyShops = [
    {
        shopName: 'Apteka N1',
        products: [],
        address: 'Kyiv',
    },
    {
        shopName: 'Socialna Apteka',
        products: [],
        address: 'Dnipro',
    },
    {
        shopName: 'Apteka Nizkih Cen',
        products: [],
        address: 'Kherson',
    },
    {
        shopName: 'Best medicine store',
        products: [],
        address: 'Boryspil',
    },
    {
        shopName: 'Najkraschi Liki',
        products: [],
        address: 'Chernihiv',
    },
    {
        shopName: 'Apteka Podoroznik',
        products: [],
        address: 'Vinnytca',
    },
    {
        shopName: 'Dobrobut medecine',
        products: [],
        address: 'Odessa',
    },
];

export const dummyData = async () => {
    await createSortingRules();

    const products = await Product.find();

    if (products.length === 0) {
        await createCategories();
        for (const dummyProduct of dummyProducts) {
            const newProduct = { ...dummyProduct };
            const updatedCategories = await getProductCategories(newProduct);

            newProduct.categories = updatedCategories;
            const prodDoc = new Product(newProduct);

            await prodDoc.save();
        }
        console.log('Dummy Products created');

        // remove all shops because they may contain wrong (not existing) products ID
        await Shop.deleteMany();

        const createdProducts = await Product.find();

        for (const dummyShop of dummyShops) {
            const shopDoc = new Shop(dummyShop);
            const randomProducts = getRandomProducts(createdProducts);
            const shopCategories = getShopCategories(randomProducts);
            shopDoc.products = randomProducts;
            shopDoc.categories = shopCategories;
            await shopDoc.save();
        }
        console.log('Dummy Shops created!');
    } else {
        console.log('Products are already in DB');
        const shops = await Shop.find();
        if (shops.length === 0) {
            for (const dummyShop of dummyShops) {
                const shopDoc = new Shop(dummyShop);
                const randomProducts = getRandomProducts(products);
                const shopCategories = getShopCategories(randomProducts);
                shopDoc.products = randomProducts;
                shopDoc.categories = shopCategories;
                await shopDoc.save();
            }
            console.log('Dummy Shops created!');
        } else {
            console.log('Dummy Shops are already in DB');
        }
    }
};

const getRandomProducts = (products) => {
    let length = Math.floor(Math.random() * products.length); // Random length
    if (length === 0) {
        length = products.lenght - 2;
    }
    const shuffled = products.sort(() => Math.random() - 0.5); // Shuffle the array
    return shuffled.slice(0, length); // Return a slice of random length
};

const createCategories = async () => {
    let allCategories = [];

    await Category.deleteMany();

    dummyProducts.forEach((product) => {
        allCategories = [...allCategories, ...product.categories];
    });

    const uniqueCategories = Array.from(new Set(allCategories)).filter(
        (category) => category !== 'Super',
    );

    for (const category of uniqueCategories) {
        const categoryDoc = new Category({ name: category });
        await categoryDoc.save();
    }
};

const getShopCategories = (products) => {
    let shopCategories = [];

    products.forEach((product) => {
        const categories = product.categories;

        categories.forEach((category) => {
            const index = shopCategories.findIndex(
                (shopCategory) => shopCategory.toString() === category.toString(),
            );
            if (index < 0) {
                shopCategories.push(category);
            }
        });
    });

    return shopCategories;
};

const getProductCategories = async (product) => {
    let updatedCategories = [];
    const categoryList = [...product.categories];

    if (categoryList.some((category) => category === 'Super')) {
        updatedCategories = await Category.find();
    } else {
        for (const category of categoryList) {
            const existingCategory = await Category.findOne({ name: category });
            if (existingCategory) {
                updatedCategories.push(existingCategory);
            }
        }
    }

    return updatedCategories;
};

const createSortingRules = async () => {
    const sortingRules = await SortingRule.find();
    // console.log('sortingRules: ', sortingRules);

    if (sortingRules.length < 1) {
        for (const sortingRule of dummySortingRules) {
            const mappedSortingRule = { ...sortingRule };
            mappedSortingRule.rule.direction = sortingRule.rule.direction === 'ascending' ? 1 : -1;

            const srDoc = new SortingRule(mappedSortingRule);

            await srDoc.save();
        }
    }
};
