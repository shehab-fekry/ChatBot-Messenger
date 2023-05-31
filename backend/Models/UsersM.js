const mongoose = require('mongoose');
const { Schema } = mongoose;

const Users = new Schema({
    name: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    rooms: {
        type: Array,
        ref: 'Rooms',
    },
    status: {
        type: Boolean,
    }
});

module.exports = mongoose.model('Users', Users);

