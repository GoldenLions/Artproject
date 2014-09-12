angular.module('dangerousWrenchApp')
  .controller('MainCtrl', function ($scope, KeywordSearch, userServices) {
    $scope.searchterms;
    $scope.displayResults = function() {
      console.log($scope.searchterms)

      KeywordSearch.displayResults($scope.searchterms);
    };

    $scope.goToLikes = userServices.goToLikes;
    $scope.checkLoginState = function(){
      userServices.checkLoginState();

    }
  })