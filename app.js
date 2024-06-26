import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

import { authRoutes, shopRoutes, userRoutes } from './routes/index.js';
import { dummyData } from './util/dummy-data/products-and-shops.js';
const app = express();

app.use(express.json());

// Seting headers for CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use(shopRoutes);
app.use(userRoutes);

//Error handling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message, data });
});

try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Mongoose connected to MongoDB.');
    await dummyData(); // DB fulfilment with dummy data
    app.listen(process.env.PORT || 8080, (err) => {
        if (err) {
            console.log('Can not start up server. ', err);
        }
        console.log('Server successfully started');
    });
} catch (error) {
    console.log("Cann't establish connection to MongoDB. ", error);
}
