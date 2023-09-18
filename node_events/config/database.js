const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/eventsDB');
        console.log('connected to database successfully...');
    } catch (err) {
        console.error(err);
    }
}

connectDB();

