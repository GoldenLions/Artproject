angular.module('dangerousWrenchApp')
  
.controller('UserController', function ($scope, KeywordSearch, userServices, $routeParams) {
    $scope.test = "hello"
    $scope.searchterms;
    $scope.displayResults = function() {
      KeywordSearch.displayResults($scope.searchterms);
    };
    $scope.username = $routeParams.user
    $scope.getuserId = function(){
      console.log('hello')
      $scope.userID = userServices.grabUserID()
    };
    $scope.logout = userServices.logout;
 

  
    //generateUserLikes is the factory function that queries
    //for a specific users 'liked' art
    $scope.displayUserLikes = userServices.generateUserLikes;

    console.log('likeesss', userServices.generateUserLikes())

    // $scope.userID = userServices.userName
    console.log('thishtishtihsit',$scope.userID)
    $scope.displayUserLikes($scope.username)
      .then(function(data) {

        $scope.userLikesResults = data.data.results;
        console.log('user likes results', data.data.results)

      })
      .catch(function(){
        console.log('Failed to find users likes :|')
      })

    //generateUserRecommendations is the factory function that queries
    //for a specific users recommended pieces

});

