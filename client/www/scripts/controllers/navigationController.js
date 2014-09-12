angular.module('dangerousWrenchApp')
  .controller('navigationController', function ($scope, userServices, KeywordSearch) {
    $scope.searchterms;
    $scope.loggedIn = userServices.grabUserId;
    $scope.displayResults = function() {
      KeywordSearch.displayResults($scope.searchterms);
    };
  })