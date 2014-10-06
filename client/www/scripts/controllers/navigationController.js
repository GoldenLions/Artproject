angular.module('dangerousWrenchApp')
  .controller('navigationController', function ($scope, userServices, KeywordSearch) {
    $scope.searchterms;
    $scope.userServices = userServices;
    $scope.loggedIn = userServices.userName;
    // $scope.loggedIn = userServices.grabUserID()
    $scope.$watch(userServices.userName, function(newVal, oldVal, scope) {
    	if(newVal) {
    		scope.loggedIn = newVal
    	}
    })
  })