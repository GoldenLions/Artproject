var myApp = angular.module('dangerousWrenchApp')

myApp.controller('UserRecommend', function ($scope,$ionicSideMenuDelegate, likeButton, userServices) {
  // the recommendations will be a mix of artists that user likes, other user
  // recommendations, and random recommendations.
  //get 8 artist reommendations,  7 user, 5 random
  var artistRecommendations,
    randomRecommendations, 
    randomLimit=0,
    artistLimit = 5,
    all = [],
    maxLimit = 7;

    // var results = userServices.generateArtistRecommendations(userServices.userName);
    
    // results.then(function(response) {
    //   $scope.items =response.data;
    // })

  // fetch recommendations based on artist the user likes
  artistRecommendations = userServices.generateArtistRecommendations(userServices.userName, artistLimit);

  artistRecommendations.then(function(artistRecs) {
    randomLimit =  maxLimit -  artistRecs.data.recommendations.length || 0;

     all = all.concat( artistRecs.data.recommendations);

    //fetch random recommendations
    randomRecommendations = userServices.generateRandomRecommendations(userServices.userName, randomLimit )

    randomRecommendations.then(function(randomRecs){
    all = all.concat(randomRecs.data.recommendations);
      $scope.items =  all;
    });


  });

  $scope.selectedIndex = [];
  
  $scope.itemClicked = function ($index) {

    $scope.selectedIndex.push($index);
    likeButton.like({username: userServices.userName, url: $scope.items[$index].url });
  }

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

    
})


