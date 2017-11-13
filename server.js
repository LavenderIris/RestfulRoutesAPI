// require express and path
var express = require("express");
var path = require("path");
// create the express app
var app = express();
// require bodyParser since we need to handle post data for adding a user
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/restfulTaskAPI');

var TaskSchema = new mongoose.Schema({
  title: String,
  desc: {type: String, required:true},
  completed: {type: Boolean, default: false},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})
var Task = mongoose.model('Task', TaskSchema);

app.use(bodyParser.urlencoded({ extended: true }));
// static content 
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view

app.get('/tasks', function(req, res) {
    console.log(' in home');
    Task.find({}, function(err, tasks){
        if(err){
            console.log(err);
        } else {
            res.json(tasks);
        }
    });
})

app.post('/tasks', function(req, res) {
    console.log('in create');
    var t = new Task();
    t.title = req.body.title;
    t.desc = req.body.desc;
    t.save(function(err) {
        if(err){
            console.log(err);
        } else {
            // sends now tdata
            res.send('Success!');
        }
    });
})

app.get('/tasks/:id', function(req, res) {
    Task.findOne({_id: req.params.id}, function(err, a_task) {
        console.log('Find ID');
        if(err){
            console.log(err);
        } else {
            res.json(a_task);
        }
    });
})

app.delete('/tasks/:id', function(req, res) {
    Task.remove({_id: req.params.id}, function(err, a_task) {
        console.log('Find ID');
        if(err){
            console.log(err);
        } else {
            res.send('Successful delete');
        }
    });
})

app.patch('/tasks/:id', function(req, res) {
    Task.findOne({_id: req.params.id}, function(err, a_task) {
        console.log('In update');
        if(err){
            console.log(err);
        } else {
            if (req.body.title){
                a_task.title = req.body.title;
            }
            if (req.body.desc){
                a_task.desc = req.body.desc;
            }
            a_task.save(function(err) {
                if(err){
                    console.log(err);
                } else {
                    // sends now tdata
                    res.send('Success!');
                }
            });
        }
    });
})


// tell the express app to listen on port 8000
app.listen(8000, function() {
  console.log("listening on port 8000");
})
