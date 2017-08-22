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

app.get('/readcoord',function (req,res) {
  res.send(triangulate(0,0,dist["EC03"]["EC02"],5.12,0,dist["EC03"]["EC01"],0,-50,1));
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
  }

  dist["EC03"]["EC01"] = Math.round(dist["EC03"]["EC01"]*100)/100;
  dist["EC03"]["EC02"] = Math.round(dist["EC03"]["EC02"]*100)/100;

  jsonfile.writeFile(dist_file, dist, {spaces: 2}, function(err) {
    console.error(err)
  })
  res.send('sucess');
});

app.listen(process.env.PORT || 80,function () {
  console.log('Example app listening on port ' + (process.env.PORT || 80));
});

function triangulate(xA,yA,rA,xB,yB,rB,xC,yC,rC,count) {

      pred = [];

      count = count || 1;

      if (count == 4)
      {
        pred={'x':1000,'y':1000};
        return pred;
      }

      // console.log(xA,yA,rA,xB,yB,rB,xC,yC,rC);

      d = Math.sqrt((xB-xA)*(xB-xA)+(yB-yA)*(yB-yA));
      K = (1/4)*Math.sqrt(((rA+rB)*(rA+rB)-d*d)*(d*d-(rA-rB)*(rA-rB)));

      if (rA+rB < d)
      {
        // console.log("dont meet");
        count = count + 1;
        pred = triangulate(xB,yB,rB,xC,yC,rC,xA,yA,rA,count);
      }
      else if(d < Math.abs(rA-rB))
      {
        // console.log("inside");
        count = count + 1;
        pred = triangulate(xB,yB,rB,xC,yC,rC,xA,yA,rA,count);
      }
      else
      {
        x1 = (1/2)*(xB+xA) + (1/2)*(xB-xA)*(rA*rA-rB*rB)/(d*d) + 2*(yB-yA)*K/(d*d);
        y1 = (1/2)*(yB+yA) + (1/2)*(yB-yA)*(rA*rA-rB*rB)/(d*d) + -2*(xB-xA)*K/(d*d);

        x2 = (1/2)*(xB+xA) + (1/2)*(xB-xA)*(rA*rA-rB*rB)/(d*d) - 2*(yB-yA)*K/(d*d);
        y2  = (1/2)*(yB+yA) + (1/2)*(yB-yA)*(rA*rA-rB*rB)/(d*d) - -2*(xB-xA)*K/(d*d);


        // if (xC && yC && rC)
        // {
          d31 = Math.sqrt((xC-x1)*(xC-x1)+(yC-y1)*(yC-y1));
          d32 = Math.sqrt((xC-x2)*(xC-x2)+(yC-y2)*(yC-y2));
          if (Math.abs(d31-rC) < Math.abs(d32-rC))
          {
            pred={'x':x1,'y':y1};
          }
          else {
            pred={'x':x2,'y':y2};
          }
        // }
        // else {
        //   pred={'x':x1,'y':y1};
        //   pred={'x':x2,'y':y2};
        // }
      }
    return pred;
}
