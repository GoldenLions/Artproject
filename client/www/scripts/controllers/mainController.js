angular.module('dangerousWrenchApp')
  .controller('MainCtrl', function ($scope, KeywordSearch, userServices) {
    $scope.searchterms;
    $scope.displayResults = function() {
      console.log($scope.searchterms)

      KeywordSearch.displayResults($scope.searchterms);
    };
    $scope.getuserId = function(){
      console.log('heldfdsfadslo')
      $scope.userID = userServices.grabUserID()
      console.log('userIDDDD',$scope.userID)
    };
    $scope.goToLikes = userServices.goToLikes
    $scope.checkLoginState = userServices.checkLoginState;
  })