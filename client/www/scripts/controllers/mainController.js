angular.module('dangerousWrenchApp')
  .controller('MainCtrl', function ($scope, KeywordSearch, userServices) {
    $scope.searchterms;
    $scope.displayResults = function() {
      console.log($scope.searchterms)

      KeywordSearch.displayResults($scope.searchterms);
    };

    // $scope.userID="ahhhhh"
    // $scope.getuserId = function(){
    //   console.log('heldfdsfadslo')
    //   $scope.userID = userServices.grabUserID()
    //   console.log('userIDDDD',$scope.userID)
    // };
    $scope.logout = userServices.logout;

    $scope.goToRecs = userServices.goToRecs;
    $scope.goToLikes = userServices.goToLikes;
    $scope.checkLoginState = function(){
      console.log('hi')
      userServices.checkLoginState();
      $scope.getuserId();
    }
  })