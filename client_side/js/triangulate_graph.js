circles=[
]
function init() {
  canvas1 = document.getElementById('can1');
  ctx1 = canvas1.getContext("2d");

  w = canvas1.width;
  h = canvas1.height;
  radius = 6;

  console.log('triangulate_unity(0,0,15,20,25,20,0,15,20,25,10,-20,15,20,25)');

  console.log(triangulate_unity(0,0,15,20,25,
                                20,0,15,20,25,
                                10,-20,15,20,25));


  ref();
}
function draw() {
  for (var circle in circles) {
    if (circles.hasOwnProperty(circle)) {
      ctx1.beginPath();
      ctx1.arc(circles[circle].x, circles[circle].y, radius, 0, 2 * Math.PI, false);
      if(circle<3){
        ctx1.fillStyle = 'yellow';
      }
      else {
        ctx1.fillStyle = 'green';
        ctx1.font = 'bold 8pt Calibri';
        ctx1.fillText(circle, circles[circle].x-3, circles[circle].y+20);
      }
      ctx1.fill();
      ctx1.lineWidth = 5;
      ctx1.strokeStyle = '#003300';
      ctx1.stroke();
    }
  }
}
function ref() {
  ctx1.clearRect(0, 0, w, h);
  prep_graph(ctx1);

  circles = [];


  var x1 = parseInt(document.getElementById("x1").value);
  var x2 = parseInt(document.getElementById("x2").value);
  var x3 = parseInt(document.getElementById("x3").value);

  var y1 = parseInt(document.getElementById("y1").value);
  var y2 = parseInt(document.getElementById("y2").value);
  var y3 = parseInt(document.getElementById("y3").value);

  draw_circle(x1,y1);
  draw_circle(x2,y2);
  draw_circle(x3,y3);

  var r1 = parseInt(document.getElementById("r1").value);
  var r2 = parseInt(document.getElementById("r2").value);
  var r3 = parseInt(document.getElementById("r3").value);

  ctx1.beginPath();
  ctx1.arc(x1*6+300, -y1*6+300, r1*6, 0, 2 * Math.PI, false);
  ctx1.lineWidth = 1;
  ctx1.strokeStyle = '#003300';
  ctx1.stroke();

  ctx1.beginPath();
  ctx1.arc(x2*6+300, -y2*6+300, r2*6, 0, 2 * Math.PI, false);
  ctx1.lineWidth = 1;
  ctx1.strokeStyle = '#003300';
  ctx1.stroke();

  ctx1.beginPath();
  ctx1.arc(x3*6+300, -y3*6+300, r3*6, 0, 2 * Math.PI, false);
  ctx1.lineWidth = 1;
  ctx1.strokeStyle = '#003300';
  ctx1.stroke();

  pred_circle = triangulate(x1,y1,r1,x2,y2,r2,x3,y3,r3);
  // pred_circle = triangulate(x1,y1,r1,x2,y2,r2);

  // console.log(pred_circle);

  draw_circle(pred_circle.x,pred_circle.y);

  draw();
}
function ref_loop() {
  ref();
  setTimeout(ref_loop,100);
}
function draw_circle(x,y) {
  circles.push({'x':x*6+300,'y':-y*6+300});
}
function prep_graph(ctx) {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w/2-1, 0);
  ctx.lineTo(w/2-1, h);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, h/2-1);
  ctx.lineTo(w, h/2-1);
  ctx.stroke();

  for (var i = 0; i < 600; i++) {
    if(((i+1-300)/6)%5 == 0)
    {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#dbdbdb';

      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(w, i);
      ctx.stroke();
    }
  }
}
