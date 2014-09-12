angular.module('dangerousWrenchApp')
  .controller('MainCtrl', function ($scope, KeywordSearch, userServices) {
    $scope.searchterms;
    $scope.displayResults = function() {
      console.log($scope.searchterms)

      KeywordSearch.displayResults($scope.searchterms);
    };

    $scope.logout = userServices.logout;
    $scope.goToLikes = userServices.goToLikes
    $scope.checkLoginState = function(){
      console.log('hi')
      userServices.checkLoginState();
    }
  })