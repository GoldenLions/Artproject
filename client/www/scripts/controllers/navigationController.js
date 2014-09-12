angular.module('dangerousWrenchApp')
  .controller('navigationController', function ($scope, KeywordSearch) {
    $scope.searchterms;
    $scope.displayResults = function() {
      KeywordSearch.displayResults($scope.searchterms);
    };
  })