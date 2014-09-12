var myApp = angular.module('dangerousWrenchApp')

myApp.controller('UserRecommend', function ($scope,$ionicSideMenuDelegate, likeButton) {
 
    $scope.items = [
    { id: 1, album: 'Lady and the Ermin', artist: 'Leonardo Da Vinci', image:"http://upload.wikimedia.org/wikipedia/commons/e/ed/Dama_z_gronostajem.jpg",like:0},
    { id: 2, album: 'Calling of Sain Matthew', artist: 'Caravaggio', image:"http://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg/640px-Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg"},
    { id: 3, album: 'Bacchus and Ariadne', artist: 'Caravaggio', image:"http://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Tizian_048_%28colors%29.jpg/640px-Tizian_048_%28colors%29.jpg"},
    { id: 4, album: 'Calling of Sain Matthew', artist: 'Caravaggio', image:"http://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg/640px-Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg"},
    { id: 5, album: 'Calling of Sain Matthew', artist: 'Caravaggio', image:"http://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg/640px-Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg"},
    { id: 6, album: 'Calling of Sain Matthew', artist: 'Caravaggio', image:"http://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg/640px-Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg"},
    { id: 7, album: 'Calling of Sain Matthew', artist: 'Caravaggio', image:"http://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg/640px-Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg"},
    { id: 8, album: 'Calling of Sain Matthew', artist: 'Caravaggio', image:"http://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg/640px-Caravaggio%2C_Michelangelo_Merisi_da_-_The_Calling_of_Saint_Matthew_-_1599-1600_%28hi_res%29.jpg"}

  ]


  $scope.selectedIndex = [];
  
  $scope.itemClicked = function ($index) {
      console.log($index);
      $scope.selectedIndex.push($index);

      likeButton.like({username: "demo", imageUrl: $scope.items[$index].image });
  }


  $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };

 $scope.userID = "hello"
    
    
})


