angular.module('api_service', ['ngResource'])
.factory('api_dist_read', ['$resource',
  function($resource){
    return $resource('http://162.222.176.252:1234/read', {}, {
       query: {method:'GET', params:{}, isArray:false}
    });
  }]);
