angular.module('dangerousWrenchApp')
.factory('likeButton', function($http, $q){

  var like = function(likeObject){
    likeObject.rating = 1;
    console.log('likeObject', likeObject)
    var data = JSON.stringify(likeObject);
    return $http({
      method: 'POST',
      url: '/like',
      dataType: 'json',
      data: data
    });
    
  };

  var unlike = function(unlikeObject){
    unlikeObject.rating = -1;
    console.log('unlikeObject', unlikeObject)
    var data = JSON.stringify(unlikeObject);
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



