var express     = require('express');
var jsonfile    = require("jsonfile");

var dist_file = './server_side/files/dist.json';
var dist = require('./../.'+dist_file);
// var dist = require(dist_file);

var error_file = './server_side/files/error.json';
var error = require('./../.'+error_file);

var app = express();
app.use(express.static(__dirname + '/../../client_side'));
app.use(express.static(__dirname + '/../../node_modules'));

app.get('/',function (req,res) {
  // res.send('hello world');
  res.redirect('/html/objectmesh.html');
});
app.get('/errorread',function (req,res) {
  // res.send('hello world');
  res.send(error);
});

app.get('/error',function (req,res) {
  console.log(req.query.uid);
  console.log(req.query.result);

  error = JSON.parse(req.query.result);

  jsonfile.writeFile(error_file, error, {spaces: 2}, function(err) {
    console.error(err)
  });
  res.send('sucess');
});
app.get('/read',function (req,res) {
  res.send(dist);
});
app.get('/write',function (req,res) {
  console.log(req.query.uid);
  console.log(req.query.result);

  dist[req.query.uid] = JSON.parse(req.query.result);

  if(!error.pert) {
    dist["EC03"]["EC01"] = dist["EC03"]["EC01"] - error["EC01"];
    dist["EC03"]["EC02"] = dist["EC03"]["EC02"] - error["EC02"];
  }
  else {
    dist["EC03"]["EC01"] = dist["EC03"]["EC01"] / (1+(error["EC01"]/100));
    dist["EC03"]["EC02"] = dist["EC03"]["EC02"] / (1+(error["EC02"]/100));

    dist["EC03"]["EC01"] = Math.round(dist["EC03"]["EC01"]*100)/100;
    dist["EC03"]["EC02"] = Math.round(dist["EC03"]["EC02"]*100)/100;
  }

  jsonfile.writeFile(dist_file, dist, {spaces: 2}, function(err) {
    console.error(err)
  })
  res.send('sucess');
});

app.listen(process.env.PORT || 80,function () {
  console.log('Example app listening on port ' + (process.env.PORT || 80));
});
