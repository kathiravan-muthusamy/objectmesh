pred_circles = [];
radius = 6;

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
}
function draw_pred_circle(x,y) {
  pred_circles.push({'x':x*6+300,'y':-y*6+300});
}
function cal_pred_circles() {

  // console.log(obs);

  if (obs[0] && observer_array[0])
  {
    temp_obs = observer_array[0];
    observer_array.shift();

    if (temp_obs[0][0] != 0 && obs1[0]){

    }
    else if (temp_obs[0][0] != 0)
    {

      pred_circles = [];

      xA=0;
      yA=0;
      rA=obs[i][0];

      xB=0;
      yB=0;
      rB=temp_obs[i][1];

      for (var i = 0; i < obs.length; i++) {

        switch (i) {
          case 0:
            draw_pred_circle(0,0);
            draw_pred_circle(0,0);
          break;

          default:

          xA=0;
          yA=0;
          rA=obs[i][0];

          xB=0;
          yB=0;
          rB=temp_obs[i][1];

          d = Math.sqrt((xB-xA)*(xB-xA)+(yB-yA)*(yB-yA));
          K = (1/4)*Math.sqrt(((rA+rB)*(rA+rB)-d*d)*(d*d-(rA-rB)*(rA-rB)));

          x1 = (1/2)*(xB+xA) + (1/2)*(xB-xA)*(rA*rA-rB*rB)/(d*d) + 2*(yB-yA)*K/(d*d);
          y1 = (1/2)*(yB+yA) + (1/2)*(yB-yA)*(rA*rA-rB*rB)/(d*d) + -2*(xB-xA)*K/(d*d);

          x2 = (1/2)*(xB+xA) + (1/2)*(xB-xA)*(rA*rA-rB*rB)/(d*d) - 2*(yB-yA)*K/(d*d);
          y2 = (1/2)*(yB+yA) + (1/2)*(yB-yA)*(rA*rA-rB*rB)/(d*d) - -2*(xB-xA)*K/(d*d);

          d31 = Math.sqrt((x3-x1)*(x3-x1)+(y3-y1)*(y3-y1));
          d32 = Math.sqrt((x3-x2)*(x3-x2)+(y3-y2)*(y3-y2));

          if (Math.abs(d31-dist[i][2]) < Math.abs(d32-dist[i][2]))
          {
            draw_pred_circle(x1,y1);
            if (i==2)
            {
              x3=x1;
              y3=y1;
            }
          }
          else {
            draw_pred_circle(x2,y2);
            if (i==2)
            {
              x3=x2;
              y3=y2;
            }
          }

          // draw_pred_circle(x1,y1);
          // draw_pred_circle(x2,y2);
          break;


        }
      }


      obs1 = obs;
      obs = temp_obs;
    }

    }
  }
  else if (!obs[0]) {
    if(observer_array[0])
    {
      // console.log("here");
      obs = observer_array[0];
      obs1 = observer_array[0];
      observer_array.shift();
      cal_pred_circles_first(obs1)
    }
  }
}
function refresh_btn() {
  observer_array = [];
  obs = dist;
  cal_pred_circles_first(obs);
}
function cal_pred_circles_first(dist) {
  pred_circles = [];
  // draw_pred_circle(0,0);
  for (var i = 0; i < dist.length; i++) {
    // for (var j = 0; j < dist[i].length; j++) {
    //   if(i<j)
    //   {
    //
    //     draw_pred_circle(0,0+dist[0][1]);
    //   }
    // }
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
        x3=50;
        y3=0;
        break;
      default:

        xA=0;
        yA=0;
        rA=dist[i][0];

        xB=0;
        yB=dist[1][0];
        rB=dist[i][1];

        d = Math.sqrt((xB-xA)*(xB-xA)+(yB-yA)*(yB-yA));
        K = (1/4)*Math.sqrt(((rA+rB)*(rA+rB)-d*d)*(d*d-(rA-rB)*(rA-rB)));

        x1 = (1/2)*(xB+xA) + (1/2)*(xB-xA)*(rA*rA-rB*rB)/(d*d) + 2*(yB-yA)*K/(d*d);
        y1 = (1/2)*(yB+yA) + (1/2)*(yB-yA)*(rA*rA-rB*rB)/(d*d) + -2*(xB-xA)*K/(d*d);

        x2 = (1/2)*(xB+xA) + (1/2)*(xB-xA)*(rA*rA-rB*rB)/(d*d) - 2*(yB-yA)*K/(d*d);
        y2 = (1/2)*(yB+yA) + (1/2)*(yB-yA)*(rA*rA-rB*rB)/(d*d) - -2*(xB-xA)*K/(d*d);

        d31 = Math.sqrt((x3-x1)*(x3-x1)+(y3-y1)*(y3-y1));
        d32 = Math.sqrt((x3-x2)*(x3-x2)+(y3-y2)*(y3-y2));

        if (Math.abs(d31-dist[i][2]) < Math.abs(d32-dist[i][2]))
        {
          draw_pred_circle(x1,y1);
          if (i==2)
          {
            x3=x1;
            y3=y1;
          }
        }
        else {
          draw_pred_circle(x2,y2);
          if (i==2)
          {
            x3=x2;
            y3=y2;
          }
        }

        // draw_pred_circle(x1,y1);
        // draw_pred_circle(x2,y2);
        break;


    }
  }
}
