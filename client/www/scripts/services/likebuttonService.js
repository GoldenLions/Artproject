angular.module('dangerousWrenchApp')
.factory('likeButton', function($http, $q){

  var like = function(likeObject){
    var deferred = $q.defer();
    var httpPromise = $http({
      method: 'POST',
      url: 'like',
      data: likeObject
    });

    httpPromise.then(function(response){
      deferred.resolve(response);
    }, function(error) {
      console.log('like error', error);
    });

    return deferred.promise;

  };

  return {
    like: like
  };
});

