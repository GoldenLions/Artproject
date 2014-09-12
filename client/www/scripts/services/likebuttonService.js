angular.module('dangerousWrenchApp')
.factory('likeButton', function($http, $q){

  var like = function(likeObject){

    var data = JSON.stringify(likeObject);

    console.log('data',data);

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



