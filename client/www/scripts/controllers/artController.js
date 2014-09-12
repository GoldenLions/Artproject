angular.module('dangerousWrenchApp')
  .controller('ArtCtrl', function($scope, $routeParams, likeButton, GenerateArtInfo,userServices) {
    // assign $scope the generate function from the GenerateArtInfo service
    $scope.generate = GenerateArtInfo.generate;
    // then invoke it on the next line, so that $scope.results has data to pass along to the view
    $scope.generate($routeParams.artId)
      .then(function(data) {
        $scope.results = data.data.features;
        $scope.work = data.data.painting;
      })
      .catch(function() {
        console.log('Failed to generate info!');
      })
    $scope.like = function(){
      var item = {
        username: userServices.userName,
        url: $scope.work.url
      }
      console.log(item);
      likeButton.like(item);
    }
  });