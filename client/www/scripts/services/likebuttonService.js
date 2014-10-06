angular.module('dangerousWrenchApp')
.factory('likeButton', function($http, $q){

  var like = function(likeObject){
    likeObject.rating = 1;
    var data = JSON.stringify(likeObject);
    console.log('likeObject', data);
    return $http({
      method: 'POST',
      url: '/like',
      dataType: 'json',
      data: likeObject
    });

  };

  var unlike = function(unlikeObject){
    unlikeObject.rating = -1;
    var data = JSON.stringify(unlikeObject);
    console.log('unlikeObject', data);
    return $http({
      method: 'POST',
      url: '/like',
      dataType: 'json',
      data: data
    });

  };

  return {
    like: like,
    unlike: unlike
  };
});



