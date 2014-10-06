angular.module('dangerousWrenchApp')
.controller('SearchResultsCtrl', function ($scope, $location, $rootScope, KeywordSearch, likeButton) {
    $scope.searchterms;
    $scope.artData = {};
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.totalItems = 0;
    $scope.currentPageArtData = [];
    $scope.allArtData = [];

    $scope.search = function() {
      $location.search('q', $scope.searchterms);
      KeywordSearch.search($scope.searchterms)
        .then(function (response) {
          $scope.allArtData = response.data;
          $scope.totalItems = $scope.allArtData.length;
          console.log($scope.allArtData);
          console.log($scope.totalItems);
          $scope.pageChanged()
        }, function (error) {
          console.log(error);
        })
    };

    var likeObject = {};
    likeObject.url = 'http://www.tate.org.uk/art/images/work/T/T12/T12848_10.jpg';
    likeObject.username = localStorage.getItem('userName');

    $scope.like = function(){
      likeButton.like(likeObject);
    };

    $scope.unlike = function(){
      likeButton.unlike(likeObject);
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