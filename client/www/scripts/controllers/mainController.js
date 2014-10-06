angular.module('dangerousWrenchApp')
  .controller('MainCtrl', function ($scope, KeywordSearch, userServices) {
    $scope.searchterms;
    $scope.displayResults = function() {
      console.log($scope.searchterms)

      KeywordSearch.displayResults($scope.searchterms);
    };

    // $scope.loggedIn = userServices.checkLoginState();
    $scope.logout = userServices.logout;
    $scope.goToRecs = userServices.goToRecs;
    $scope.goToLikes = userServices.goToLikes;
    $scope.checkLoginState = function(){
      userServices.username = true;
      userServices.checkLoginState();
    }
  })