function init() {
  canvas1 = document.getElementById('can1');
  ctx1 = canvas1.getContext("2d");

  canvas2 = document.getElementById('can2');
  ctx2 = canvas2.getContext("2d");

  w = canvas1.width;
  h = canvas1.height;
  dist = [];
  // prep_graph(ctx1);
  // prep_graph(ctx2);
  init1();
  init2();
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
      ctx.strokeStyle = '#efefef';

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
