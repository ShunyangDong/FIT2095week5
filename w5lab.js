const express = require('express');
const mongodb = require("mongodb");
// let bodyParser = require('body-parser');
const morgan = require('morgan');
let app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('images'));
//app.use(express.static('views'));
app.use(express.static('css'));
app.listen(8080);

app.use(express.urlencoded({
    extended: false
}))
// parse application/json
app.use(express.json());

//Configure MongoDB
const MongoClient = mongodb.MongoClient;

// Connection URL
const url = "mongodb://localhost:27017/";

//reference to the database (i.e. collection)
let db;
//Connect to mongoDB server
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("week6lab");
        }
    });

app.get('/',(req,res)=>{
    res.render('home.html')
})
app.get('/newtask',(req,res)=>{
    res.render('newtask.html');
})
app.post('/newtask', (req,res)=>{
    let taskDetails = req.body;
    var uniqueId;
    db.collection('tasks').find({}).toArray(function (err, data) {
        let flag = true;
        while(flag){
            uniqueId= Math.round(Math.random()*1000);
            if(data.filter(item => (item.id == uniqueId)).length == 0){
                flag = false;
        }
        console.log(uniqueId);
        db.collection('tasks').insertOne({ id: uniqueId,
            name: taskDetails.name, person: taskDetails.person, 
            due: taskDetails.due, status: taskDetails.status,
            desc: taskDetails.desc });
    }
    });
    res.redirect('/listtasks'); // redirect the client to list users page
    //res.render('listtasks.html', {db:db});
})

app.get('/listtasks',(req,res)=>{
    //res.render('listtasks.html', {db:db});
    db.collection('tasks').find({}).toArray(function (err, data) {
        res.render('listtasks', { db: data });
    });
})
//Update task: 
//GET request: send the page to the client 
app.get('/updatetasks', function (req, res) {
    res.render('updatetasks.html');
});

//POST request: receive the details from the client and do the update
app.post('/updatetasks', function (req, res) {
    let taskDetails = req.body;
    let filter = { id: parseInt(taskDetails.id) };
    let theUpdate = { $set: { status: taskDetails.status}};
    db.collection('tasks').updateOne(filter, theUpdate);
    res.redirect('/listtasks');// redirect the client to list users page
})

app.get('/deletetasks', function (req, res) {
    res.render('deletetasks.html');
});
//POST request: receive the user's name and do the delete operation 
app.post('/deletetasks', function (req, res) {
    let taskDetails = req.body;
    let filter = { id: parseInt(taskDetails.id) };
    db.collection('tasks').deleteOne(filter);
    res.redirect('/listtasks');// redirect the client to list users page
});

app.get('/deleteall',function (req, res) {
    res.render('deleteall.html');
});

app.post('/deleteall', function (req, res) {
    db.collection('tasks').deleteMany({});
    res.redirect('/listtasks');
});

console.log('Server running at http://127.0.0.1:8080/'); 