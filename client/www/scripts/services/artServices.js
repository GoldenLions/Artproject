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

    var generateRecommendations = function(username) {
      var data = JSON.stringify({username: username});
      return $http({
        method: 'POST',
        url: '/generateRecommendations',
        data: data
      })
    };

    return {
      generate: generate
    }
  });