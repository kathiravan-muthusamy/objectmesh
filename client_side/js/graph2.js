circles=[
  {'x':300,'y':300}
  ,{'x':350,'y':250}
  ,{'x':370,'y':250}
  ,{'x':390,'y':250}
  ,{'x':410,'y':250}
]
function init2() {
  canvas2.addEventListener('mousedown', mouseDown, false);
  canvas2.addEventListener('mouseup', mouseUp, false);
  canvas2.addEventListener('mousemove', mouseMove, false);

  drag={};
  drag.status = false;
  drag.circle = 0;


  ref2();
}
function draw2() {
  for (var circle in circles) {
    if (circles.hasOwnProperty(circle)) {
      ctx2.beginPath();
      ctx2.arc(circles[circle].x, circles[circle].y, radius, 0, 2 * Math.PI, false);
      if(circle==0){
        ctx2.fillStyle = 'yellow';
      }
      else {
        ctx2.fillStyle = 'green';
        ctx2.font = 'bold 8pt Calibri';
        ctx2.fillText(circle, circles[circle].x-3, circles[circle].y+20);
      }
      ctx2.fill();
      ctx2.lineWidth = 5;
      ctx2.strokeStyle = '#003300';
      ctx2.stroke();
    }
  }
}
function mouseDown(e) {
    mouse={};
    mouse.x = e.pageX-this.offsetLeft;
    mouse.y = e.pageY-this.offsetTop;

    for (var circle in circles) {
      if(Math.sqrt(Math.pow((mouse.x - circles[circle].x), 2) + Math.pow((mouse.y - circles[circle].y), 2)) <= radius)
      {
        drag.status = true;
        drag.circle = circle;
      }
    }
    // circle.startX = e.pageX - this.offsetLeft;
    // circle.startY = e.pageY - this.offsetTop;
    //
    // circle.X = circle.startX;
    // circle.Y = circle.startY;
    //
    // if (!circleMade) {
    //     circle.radius = 0;
    // }
    //
}

function mouseUp() {
    drag.status = false;
    // circleMade = true;
}

function mouseMove(e) {
    if (drag.status) {
        mouse={};
        mouse.x = e.pageX-this.offsetLeft;
        mouse.y = e.pageY-this.offsetTop;
        circles[drag.circle].x = mouse.x;
        circles[drag.circle].y = mouse.y;
        ref2();
    }
}
function ref2() {
  ctx2.clearRect(0, 0, w, h);
  prep_graph(ctx2);
  draw2();
  calc_dist();
  ref1();
}
function calc_dist(){
  dist = [];
  for (var circle1 in circles)
  {
      dist[circle1]=[];
      for (var circle2 in circles)
      {
        dist[circle1][circle2] = Math.round((Math.sqrt(Math.pow((circles[circle1].x - circles[circle2].x), 2) + Math.pow((circles[circle1].y - circles[circle2].y), 2)))/6*100)/100;;
      }
  }
  var table = document.getElementById("table");
  for (var i = 1; i <= circles.length; i++) {
    for (var j = 1; j <= circles.length; j++) {
      table.rows[i].cells[j].innerHTML = dist[i-1][j-1];
    }
  }
}
