angular.module('dangerousWrenchApp')
.controller('SearchResultsCtrl', function ($scope, $location, $rootScope, KeywordSearch) {
    $scope.searchterms;
    $scope.artData = {};
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.totalItems = 00;
    $scope.currentPageArtData = [];
    $scope.allArtData = [];

    $scope.search = function() {
      $location.search('q', $scope.searchterms);
      KeywordSearch.search($scope.searchterms)
        .then(function (response) {
          $scope.allArtData = response.data;
          $scope.totalItems = $scope.allArtData.length;
          $scope.pageChanged()
        }, function (error) {
          console.log(error);
        })
    };

    var q = $location.search().q;
    if (q != null) {
      $scope.searchterms = q;
      $scope.search();
    };

    // Enables pagination
    $scope.pageChanged = function() {
      var begin = (($scope.currentPage - 1) * $scope.numPerPage)
      , end = begin + $scope.numPerPage;

      $scope.currentPageArtData = $scope.allArtData.slice(begin, end);
    };

})