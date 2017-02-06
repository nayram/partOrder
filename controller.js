'use strict';
angular.module('Home')
.controller('HomeController',['$scope','$rootScope','$state','AuthService',function($scope,$rootScope,$state,AuthService){
	 /*$("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
        
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });*/

	console.log($rootScope.globals.currentUser);
	$scope.client_name=$rootScope.globals.currentUser.userData.name;
	$scope.profileImg=$rootScope.globals.currentUser.userData.logo;
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
    		// $state.go('home.orderContent');
  });
	$state.go('home.orderList');
}]);