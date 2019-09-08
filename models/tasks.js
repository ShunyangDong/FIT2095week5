let mongoose = require('mongoose');
let taskSchema = mongoose.Schema({
    name: {
        type: String,
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    due: {
        type: Date
    },
    status: {
        type: String,
        validate: {
            validator: (value) => value == "InProgress" || value == "Complete",
            mesage: 'status should be eitehr Inprogress or Complete'
        }
    },
    description: {
        type: String
    }
})

let taskModel = mongoose.model('taskCol', taskSchema);
module.exports = taskModel;