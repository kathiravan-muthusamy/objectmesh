var express     = require('express');
var jsonfile    = require("jsonfile");

var dist_file = './server_side/files/dist.json';
var dist = require('./../.'+dist_file);
// var dist = require(dist_file);

var app = express();
app.use(express.static(__dirname + '/../../client_side'));
app.use(express.static(__dirname + '/../../node_modules'));

app.get('/',function (req,res) {
  // res.send('hello world');
  res.redirect('/html/objectmesh.html');
});

app.get('/read',function (req,res) {
  res.send(dist);
});

app.get('/write',function (req,res) {
  console.log(req.query.uid);
  console.log(req.query.result);

  dist[req.query.uid] = JSON.parse(req.query.result);

  jsonfile.writeFile(dist_file, dist, {spaces: 2}, function(err) {
    console.error(err)
  })
  res.send('sucess');
});

app.listen(process.env.PORT || 1234,function () {
  console.log('Example app listening on port ' + (process.env.PORT || 1234));
});
