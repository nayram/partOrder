'use strict';
angular.module('Home')
.controller('HomeController',['$scope','$rootScope','$state','AuthService',function($scope,$rootScope,$state,AuthService){
	 
	
	$scope.getProfileImg=function(){

		return "https://forhey.com/partnerLogos/"+$rootScope.globals.currentUser.userData.logo;
	}
	$scope.logout=function(){
		AuthService.ClearCredentials();
		$state.go('loginState');
	}
	$rootScope.$on("updateUser",function(event,data){
    		$scope.client_name=data.name;
    		$scope.profileImg=data.logo;
  });
	$state.go('home.orderList');
}]);