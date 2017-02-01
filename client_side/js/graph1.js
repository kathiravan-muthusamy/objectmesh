pred_circles = [];
debug_circles = [];
radius = 6;

obs2 = []
obs1 = []
obs = [];
observer_array = [];

function init1() {
  // while(true)
  // {
    prep_graph(ctx1);
    ref1();
  // }
}
function ref1() {
  ctx1.clearRect(0, 0, w, h);
  prep_graph(ctx1);
  draw1();
  setTimeout(ref1, 100);
}
function draw1() {
  cal_pred_circles();
  for (var circle in pred_circles) {
    if (pred_circles.hasOwnProperty(circle)) {
      ctx1.beginPath();
      ctx1.arc(pred_circles[circle].x, pred_circles[circle].y, radius, 0, 2 * Math.PI, false);
      if(circle==0){
        ctx1.fillStyle = 'yellow';
      }
      else {
        ctx1.fillStyle = 'green';
        ctx1.font = 'bold 8pt Calibri';
        ctx1.fillText(circle, pred_circles[circle].x-3, pred_circles[circle].y+20);
      }
      ctx1.fill();
      ctx1.lineWidth = 5;
      ctx1.strokeStyle = '#003300';
      ctx1.stroke();
    }
  }
  for (var circle in debug_circles) {
    if (debug_circles.hasOwnProperty(circle)) {
      ctx1.beginPath();
      ctx1.arc(debug_circles[circle].x, debug_circles[circle].y, radius, 0, 2 * Math.PI, false);
        ctx1.fillStyle = 'blue';
        ctx1.font = 'bold 8pt Calibri';
        ctx1.fillText(circle, debug_circles[circle].x-3, debug_circles[circle].y+20);

      ctx1.fill();
      ctx1.lineWidth = 5;
      ctx1.strokeStyle = '#003300';
      ctx1.stroke();
    }
  }
}
function draw_pred_circle(x,y) {
  pred_circles.push({'x':x*6+300,'y':-y*6+300});
}
function draw_debug_circle(x,y) {
  debug_circles.push({'x':x*6+300,'y':-y*6+300});
}
function cal_pred_circles() {

  // console.log(obs);
  if (observer_array[0])
  {
    if(observer_array[0][0][0] == 0)
    {
      // console.log(observer_array[0]);
      // console.log("here1");
      observer_array.shift();
    }
    else if(obs2[0])
    {
      temp_obs = observer_array[0];
      observer_array.shift();

      obs = temp_obs;
      // get the distance travelled by
      obs2_C_points = triangulate(0,             0,              obs2[1][3],
                                  0,             obs2[2][1],     obs2[2][3]);

      obs1_C_points = triangulate(0,             0,              obs1[1][3],
                                  0,             obs1[2][1],     obs1[2][3]);

      obs_C_points = triangulate(0,             0,              obs[1][3],
                                 0,             obs[2][1],      obs[2][3]);

      obs2_O_points = triangulate(0,                  0,                  obs2[1][0],
                                  0,                  obs2[2][1],         obs2[2][0],
                                  obs2_C_points[0].x, obs2_C_points[0].y, obs2[3][0]);

      obs1_O_points = triangulate(0,                  0,                  obs1[1][0],
                                  0,                  obs1[2][1],         obs1[2][0],
                                  obs1_C_points[0].x, obs1_C_points[0].y, obs1[3][0]);

      obs_O_points = triangulate(0,                  0,                 obs[1][0],
                                 0,                  obs[2][1],         obs[2][0],
                                 obs_C_points[0].x,  obs_C_points[0].y, obs[3][0]);

      O_obs1_obs2 = Math.sqrt((obs2_O_points[0].x-obs1_O_points[0].x)*(obs2_O_points[0].x-obs1_O_points[0].x)+
                             (obs2_O_points[0].y-obs1_O_points[0].y)*(obs2_O_points[0].y-obs1_O_points[0].y));

      O_obs_obs1 = Math.sqrt((obs1_O_points[0].x-obs_O_points[0].x)*(obs1_O_points[0].x-obs_O_points[0].x)+
                             (obs1_O_points[0].y-obs_O_points[0].y)*(obs1_O_points[0].y-obs_O_points[0].y));

      debug_circles = [];
      draw_debug_circle(-O_obs_obs1*Math.cos(obs[0][0]),-O_obs_obs1*Math.sin(obs[0][0]));
      draw_debug_circle(-O_obs_obs1*Math.cos(obs[0][0])-O_obs1_obs2*Math.cos(obs1[0][0]),-O_obs_obs1*Math.sin(obs[0][0])-O_obs1_obs2*Math.sin(obs1[0][0]));

      pred_circles = [];

      draw_pred_circle(0,0);

      for (var i = 1; i < obs.length; i++) {
            pred_points = triangulate(0,0,obs[i][0],
                                      -O_obs_obs1*Math.cos(obs[0][0]),-O_obs_obs1*Math.sin(obs[0][0]),obs1[i][0],
                                      -O_obs_obs1*Math.cos(obs[0][0])-O_obs1_obs2*Math.cos(obs1[0][0]),-O_obs_obs1*Math.sin(obs[0][0])-O_obs1_obs2*Math.sin(obs1[0][0]),obs2[i][0]);

            draw_pred_circle(pred_points[0].x,pred_points[0].y);

      }
      obs2=obs1;
      obs1=obs;
    }
    else if (obs1[0])
    {
      console.log("here");
      temp_obs = observer_array[0];
      observer_array.shift();
      if (temp_obs[0][0] != 0 && obs2[0]){
          console.log("here1");
      }
      else if (temp_obs[0][0] != 0)
      {
        obs = temp_obs;
        // get the distance travelled by
        pred_circles = [];
        obs1_C_points = triangulate(0,             0,              obs1[1][3],
                                    0,             obs1[2][1],     obs1[2][3]);

        obs_C_points = triangulate(0,             0,              obs[1][3],
                                   0,             obs[2][1],      obs[2][3]);

        obs1_O_points = triangulate(0,                  0,                  obs1[1][0],
                                    0,                  obs1[2][1],         obs1[2][0],
                                    obs1_C_points[0].x, obs1_C_points[0].y, obs1[3][0]);

        obs_O_points = triangulate(0,                  0,                 obs[1][0],
                                   0,                  obs[2][1],         obs[2][0],
                                   obs_C_points[0].x,  obs_C_points[0].y, obs[3][0]);

        O_obs_obs1 = Math.sqrt((obs1_O_points[0].x-obs_O_points[0].x)*(obs1_O_points[0].x-obs_O_points[0].x)+
                               (obs1_O_points[0].y-obs_O_points[0].y)*(obs1_O_points[0].y-obs_O_points[0].y));



        for (var i = 0; i < obs.length; i++) {
          switch (i) {
            case 0:
              draw_pred_circle(0,0);
              xC=50;
              yC=50;
              rC=0;
              break;
            // case 1:
            //   draw_pred_circle(0,dist[1][0]);
            //   xC=50;
            //   yC=0;
            //   rC=0;
            //   break;
            default:

              pred_points = triangulate(0,0,obs[i][0],
                                        -O_obs_obs1*Math.cos(obs[0][0]),-O_obs_obs1*Math.sin(obs[0][0]),obs1[i][0],
                                        xC,yC,rC);

              draw_pred_circle(pred_points[0].x,pred_points[0].y);

              if (i==1)
              {
                xC=pred_points[0].x;
                yC=pred_points[0].y;
              }

              break;
          }
        }
        obs2=obs1;
        obs1=obs;
      }
    }
    else if (!obs1[0]) {
        console.log("here2");
        obs1 = observer_array[0];
        observer_array.shift();
        cal_pred_circles_first(obs1)
    }
  }
}
function refresh_btn() {
  observer_array = [];

  obs2 = []
  obs1 = []
  obs = [];

  calc_dist();

  obs1 = observer_array[0];
  observer_array.shift();
  cal_pred_circles_first(obs1)
}
function cal_pred_circles_first(dist) {
  pred_circles = [];
  // draw_pred_circle(0,0);
  for (var i = 0; i < dist.length; i++) {
// http://2000clicks.com/mathhelp/GeometryConicSectionCircleIntersection.aspx
    // K = (1/4)sqrt(((rA+rB)2-d2)(d2-(rA-rB)2))
    // d = sqrt((xB-xA)2+(yB-yA)2)
//     x = (1/2)(xB+xA) + (1/2)(xB-xA)(rA2-rB2)/d2 ± 2(yB-yA)K/d2
//     y = (1/2)(yB+yA) + (1/2)(yB-yA)(rA2-rB2)/d2 ± -2(xB-xA)K/d2
    switch (i) {
      case 0:
        draw_pred_circle(0,0);
        break;
      case 1:
        draw_pred_circle(0,dist[1][0]);
        xC=50;
        yC=0;
        rC=0;
        break;
      default:

        pred_points = triangulate(0,0,dist[i][0],0,dist[1][0],dist[i][1],xC,yC,dist[i][2]);
        draw_pred_circle(pred_points[0].x,pred_points[0].y);
        if (i==2)
        {
          xC=pred_points[0].x;
          yC=pred_points[0].y;
        }
        break;
    }
  }
}
function triangulate(xA,yA,rA,xB,yB,rB,xC,yC,rC) {

      pred = [];

      d = Math.sqrt((xB-xA)*(xB-xA)+(yB-yA)*(yB-yA));
      K = (1/4)*Math.sqrt(((rA+rB)*(rA+rB)-d*d)*(d*d-(rA-rB)*(rA-rB)));

      x1 = (1/2)*(xB+xA) + (1/2)*(xB-xA)*(rA*rA-rB*rB)/(d*d) + 2*(yB-yA)*K/(d*d);
      y1 = (1/2)*(yB+yA) + (1/2)*(yB-yA)*(rA*rA-rB*rB)/(d*d) + -2*(xB-xA)*K/(d*d);

      x2 = (1/2)*(xB+xA) + (1/2)*(xB-xA)*(rA*rA-rB*rB)/(d*d) - 2*(yB-yA)*K/(d*d);
      y2 = (1/2)*(yB+yA) + (1/2)*(yB-yA)*(rA*rA-rB*rB)/(d*d) - -2*(xB-xA)*K/(d*d);


      if (xC && yC && rC)
      {
        d31 = Math.sqrt((xC-x1)*(xC-x1)+(yC-y1)*(yC-y1));
        d32 = Math.sqrt((xC-x2)*(xC-x2)+(yC-y2)*(yC-y2));
        if (Math.abs(d31-rC) < Math.abs(d32-rC))
        {
          pred.push({'x':x1,'y':y1});
        }
        else {
          pred.push({'x':x2,'y':y2});
        }
      }
      else {
        pred.push({'x':x1,'y':y1});
        pred.push({'x':x2,'y':y2});
      }
    return pred;
}
