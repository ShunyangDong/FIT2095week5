let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let db = [];

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('images'));
//app.use(express.static('views'));
app.use(express.static('css'));

app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.render('home.html')
})
app.get('/newtask',(req,res)=>{
    res.render('newtask.html');
})
app.post('/newtask', (req,res)=>{
    let name = req.body.TaskName;
    let due = req.body.TaskDue;
    let des = req.body.TaskDes;
    console.log(name);
    db.push({
        name: name,
        due:due,
        des:des
    })
})

app.get('/listtasks',(req,res)=>{
    res.render('listtasks.html', {db:db});
})

app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');