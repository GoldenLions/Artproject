angular.module('dangerousWrenchApp')
  .controller('navigationController', function ($scope, userServices, KeywordSearch) {
    $scope.searchterms;
    $scope.userServices = userServices;
    // $scope.loggedIn = userServices.userName;
    $scope.loggedIn = localStorage.getItem('userName')
    $scope.$watch(localStorage.getItem('userName'), function(newVal, oldVal, scope) {
    	if(newVal) {
    		scope.loggedIn = newVal
    	}
    })
  })