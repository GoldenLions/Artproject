angular.module('dangerousWrenchApp')
.factory('likeButton', function($http, $q){

  var like = function(likeObject){
    console.log('likeObject', likeObject)
    var data = JSON.stringify(likeObject);
    return $http({
      method: 'POST',
      url: '/like',
      dataType: 'json',
      data: data
    });
    
  };

  return {
    like: like
  };
});



