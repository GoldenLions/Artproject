angular.module('dangerousWrenchApp')
  .controller('MainCtrl', function ($scope, KeywordSearch, userServices) {
    $scope.searchterms;
    $scope.displayResults = function() {
      KeywordSearch.displayResults($scope.searchterms);
    };
    $scope.goToLikes = userServices.goToLikes
    $scope.checkLoginState = userServices.checkLoginState;
  })