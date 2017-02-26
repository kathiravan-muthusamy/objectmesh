angular.module('objectmesh').controller('main_controller',
  function($scope,api_dist_read) {
    $scope.coord={"C1":{"X":0,"Y":0,"dist":{"EC03":{"EC01":5,"EC02":15}}}
                 ,"C2":{"X":5,"Y":0,"dist":{"EC03":{"EC01":5,"EC02":15}}}
                 ,"C3":{"X":2.5,"Y":-5,"dist":{"EC03":{"EC01":5,"EC02":15}}}};
    $scope.dist={"EC03":{"EC01":15,"EC02":15}};
    $scope.centre={}
    $scope.centre.x=0;
    $scope.centre.y=0;
    $scope.zoom=5;
    document.getElementById('can1').width=1000;
    document.getElementById('can1').height=1000;

    $scope.ref_dist =function() {
      api_read=api_dist_read.query();
      api_read.$promise.then(function() {
        // console.log(api_read);
        $scope.coord['C1'].dist['EC03'] = api_read['EC03'];
        $scope.coord['C2'].dist['EC03'] = api_read['EC03'];
        $scope.coord['C3'].dist['EC03'] = api_read['EC03'];
        setTimeout($scope.ref_dist, 100);
      });
    };
    $scope.ref_dist();
    $scope.init = function() {
      off_x=$scope.centre.x;
      off_y=$scope.centre.y;
      zoom=$scope.zoom;
      graph_init();
      $scope.w=w;
      $scope.h=h;
      draw_circle($scope.coord['C1'].X,$scope.coord['C1'].Y);
      draw_circle($scope.coord['C2'].X,$scope.coord['C2'].Y);
      draw_circle($scope.coord['C3'].X,$scope.coord['C3'].Y);
      $scope.place_objects();
      draw();

      setTimeout($scope.init, 10);
    };
    $scope.place_objects=function() {
      observer = 'EC03';
      objects = [];

      obj_dist = $scope.coord['C1'].dist['EC03'];

      for (var obj in obj_dist) {
        if (obj_dist.hasOwnProperty(obj)) {
          objects.push(obj);
        }
      }
      for (var obj in objects) {
        if (objects.hasOwnProperty(obj)) {
          pred=
            triangulate($scope.coord['C1'].X,$scope.coord['C1'].Y
                                  ,$scope.coord['C1'].dist[observer][objects[obj]],
                        $scope.coord['C2'].X,$scope.coord['C2'].Y
                                  ,$scope.coord['C2'].dist[observer][objects[obj]],
                        $scope.coord['C3'].X,$scope.coord['C3'].Y
                                  ,$scope.coord['C3'].dist[observer][objects[obj]]
            );
          draw_circle(pred.x,pred.y);
          draw_guide_circles($scope.coord['C1'].X,$scope.coord['C1'].Y
              ,$scope.coord['C1'].dist[observer][objects[obj]],'#96fe93');
          draw_guide_circles($scope.coord['C2'].X,$scope.coord['C2'].Y
              ,$scope.coord['C2'].dist[observer][objects[obj]],'#b0b3f9');
          draw_guide_circles($scope.coord['C3'].X,$scope.coord['C3'].Y
              ,$scope.coord['C3'].dist[observer][objects[obj]],'#ff9595');
        }
      }
    }
});
circles = [];
guide_circles = [];
function graph_init() {
  canvas1 = document.getElementById('can1');
  ctx1 = canvas1.getContext("2d");
  w=canvas1.clientWidth;
  h=canvas1.clientHeight;
  canvas1.width=w;
  canvas1.height=h;
  if(w%2!=0)
  {
    w=w-1;
  }
  if(h%2!=0)
  {
    h=h-1;
  }

  radius = 6;
  prep_graph(ctx1);
  circles = [];
  guide_circles = [];
  // draw_circle(0,0);
  // draw_circle(10,10);
}
function prep_graph(ctx) {
  ctx1.clearRect(0, 0, w, h);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w/2-1+off_x, 0);
  ctx.lineTo(w/2-1+off_x, h);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, h/2-1-off_y);
  ctx.lineTo(w, h/2-1-off_y);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';
  // console.log((h/2)%30);
  ctx.beginPath();
  ctx.moveTo(w-90, h-30);
  ctx.lineTo(w-60, h-30);
  ctx.stroke();

  ctx.font = 'bold 8pt Calibri';
  ctx.fillText(zoom+' m',w-55 ,h-27);

  ctx.lineWidth = 1;
  ctx.strokeStyle = '#dbdbdb';

  for (var i = 0; i < w; i++) {
    if(((i+1-(w/2)-off_x)/6)%5 == 0)
    {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }
  }
  for (var i = 0; i < h; i++) {
    if(((i+1-(h/2)+off_y)/6)%5 == 0)
    {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(w, i);
      ctx.stroke();
    }
  }
}
function draw_circle(x,y) {
  circles.push({'x':x*(30/zoom)+(w/2)-1+off_x,'y':-y*(30/zoom)+(h/2)-1-off_y});
}
function draw_guide_circles(x,y,r,color) {
  guide_circles.push({'x':x*(30/zoom)+(w/2)-1+off_x,'y':-y*(30/zoom)+(h/2)-1-off_y
                      ,'r':r,'color':color});
}
function draw() {
  for (var circle in circles) {
    if (circles.hasOwnProperty(circle)) {
      ctx1.beginPath();
      ctx1.arc(circles[circle].x, circles[circle].y, radius, 0, 2 * Math.PI, false);
      if(circle==0){
        ctx1.fillStyle = 'green';
      }
      else if(circle==1){
        ctx1.fillStyle = 'blue';
      }
      else if(circle==2){
        ctx1.fillStyle = 'red';
      }
      else {
        ctx1.fillStyle = 'black';
        ctx1.font = 'bold 8pt Calibri';
        ctx1.fillText(circle-2, circles[circle].x-3, circles[circle].y+20);
      }
      ctx1.fill();
      ctx1.lineWidth = 5;
      ctx1.strokeStyle = '#003300';
      ctx1.stroke();
    }
  }
  for (var circle in guide_circles) {
    if (guide_circles.hasOwnProperty(circle)) {
      ctx1.beginPath();
      ctx1.arc(guide_circles[circle].x, guide_circles[circle].y
                  , guide_circles[circle].r*(30/zoom), 0, 2 * Math.PI, false);

      // ctx1.fillStyle = guide_circles[circle].color;
      // ctx1.fill();
      ctx1.lineWidth = 1;
      ctx1.strokeStyle = guide_circles[circle].color;
      ctx1.stroke();
    }
  }
}
