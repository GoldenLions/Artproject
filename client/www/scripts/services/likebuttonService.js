angular.module('dangerousWrenchApp')
.factory('likeButton', function($http, $q){

  var like = function(likeObject){
    likeObject.rating = 1;
    var data = JSON.stringify(likeObject);
    console.log('likeObject', data);
    $http({
      method: 'POST',
      url: '/like',
      dataType: 'json',
      data: likeObject
    });

    return 1

  };

  var unlike = function(unlikeObject){
    unlikeObject.rating = -1;
    var data = JSON.stringify(unlikeObject);
    console.log('unlikeObject', data);
    $http({
      method: 'POST',
      url: '/like',
      dataType: 'json',
      data: data
    });

    return -1

  };

  return {
    like: like,
    unlike: unlike
  };
});



