/*
FIT2095 week7 lab
OBJECTIVES: mongoose, foreign key
 */
const express = require('express');
const morgan = require('morgan');
let app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('images'));
//app.use(express.static('views'));
app.use(express.static('css'));
app.listen(8080);


//lab7
const mongoose = require("mongoose");
let Task = require('./models/tasks');
let Developer = require('./models/developers');
let url = 'mongodb://localhost:27017/week7';

mongoose.connect(url, function(err) {
    if (err) console.log(err);
    else {
        console.log('Successfully connected');
    }
})

app.use(express.urlencoded({
    extended: false
}))
app.use(express.json());

app.get('/', (req, res) => {
    res.render('home.html')
})

app.get('/insertDeveloper', (req, res) => {
    res.render('insertDeveloper.html');
})
app.post('/insertDeveloper', (req, res) => {
    let devDetails = req.body;
    let developer1 = new Developer({
        name: {
            firstName: devDetails.firstName,
            lastName: devDetails.lastName
        },
        level: devDetails.level,
        address: {
            state: devDetails.state,
            suburb: devDetails.suburb,
            street: devDetails.street,
            unit: devDetails.unit
        }
    })
    developer1.save(function(err) {
        if (err) console.log(err);
        else {
            console.log(developer1);
        }
    })
    res.redirect('/listdevelopers');
})

app.get('/listdevelopers', function(req, res) {
    Developer.find().exec((err, data) => {
        res.render('listdevelopers', { db: data });
    })
})

app.get('/newtask', (req, res) => {
    res.render('newtask.html');
})
app.post('/newtask', (req, res) => {
    let taskDetails = req.body;
    let task1 = new Task({
        name: taskDetails.name,
        assignTo: taskDetails.assignTo,
        due: taskDetails.due,
        status: taskDetails.status,
        description: taskDetails.desc
    })
    task1.save(function(err) {
        if (err) console.log(err);
        else {
            console.log(task1);
        }
    })
    res.redirect('/listtasks');
})

app.get('/listtasks', function(req, res) {
    Task.find().exec((err, data) => {
        res.render('listtasks', { db: data });
    })
})

app.get('/updatetasks', function(req, res) {
    res.render('updatetasks.html');
});

//POST request: receive the details from the client and do the update
app.post('/updatetasks', function(req, res) {
    let taskDetails = req.body;
    let filter = { _id: taskDetails.id };
    Task.updateOne(filter, { $set: { status: taskDetails.status } },
        function(err, doc) {
            console.log(doc);
        });
    res.redirect('/listtasks');
})

app.get('/deletetasks', function(req, res) {
    res.render('deletetasks.html');
});

app.post('/deletetasks', function(req, res) {
    let taskDetails = req.body;
    //console.log(typeof(taskDetails.id));
    let filter = { _id: taskDetails.id };
    Task.deleteOne(filter, function(err, doc) {
        console.log(doc)
    });
    res.redirect('/listtasks');
});

app.get('/deleteall', function(req, res) {
    res.render('deleteall.html');
});

app.post('/deleteall', function(req, res) {
    Task.deleteMany({
        status: "Complete"
    }, function(err, doc) {
        console.log(doc);
    });
    res.redirect('/listtasks');
});
console.log('Server running at http://127.0.0.1:8080/');
/*
app.get('/insertmany', (req, res) => {
    res.render('insertmany.html');
})
app.post('/insertmany', function(req, res) {
    console.log("ARRIVE HERE\n");
    let taskDetails = req.body;
    var uniqueId;
    db.collection('tasks').find({}).toArray(function(err, data) {
        let flag = true;
        let count = parseInt(taskDetails.count);
        console.log("count get" + taskDetails.count);
        taskArray = [];
        while (count > 0) {
            while (flag) {
                uniqueId = Math.round(Math.random() * 1000);
                if (data.filter(item => (item.id == uniqueId)).length == 0) {
                    flag = false;
                }
            }
            console.log(uniqueId);
            count -= 1;
            taskArray.push({
                id: uniqueId,
                name: taskDetails.name,
                person: taskDetails.person,
                due: taskDetails.due,
                status: taskDetails.status,
                desc: taskDetails.desc
            });
            flag = true;
        }
        db.collection('tasks').insertMany(taskArray);;
    });
    res.redirect('/listtasks'); // redirect the client to list users page
});
*/