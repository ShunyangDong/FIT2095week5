let mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
        required: true,
        validate: {
            validator: (value) => value == "Beginner" || value == "Expert",
            mesage: 'level should be eitehr Beginner or Expert'
        }
    },
    address: {
        state: {
            type: String
        },
        suburb: {
            type: String

        },
        street: {
            type: String
        },
        unit: {
            type: String
        }
    }
});

let developerModel = mongoose.model('developerCol', developerSchema);
module.exports = developerModel;