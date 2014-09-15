angular.module('dangerousWrenchApp')
  .factory('GenerateArtInfo', function($http) {
    var generate = function(artId) {
      var data = JSON.stringify({painting: artId});
      return $http({
        method: 'POST',
        url: '/generateArtInfo',
        data: data
      })
    };

    return {
      generate: generate
    }
  });