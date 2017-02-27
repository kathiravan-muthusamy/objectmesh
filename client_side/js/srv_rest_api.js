angular.module('api_service', ['ngResource'])
.factory('api_dist_read', ['$resource',
  function($resource){
    return $resource('http://localhost:1234/read', {}, {
       query: {method:'GET', params:{}, isArray:false}
    });
  }]);
