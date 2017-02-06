'use strict';
angular.module('Home')
.controller('OrderListController',['$scope','$rootScope','$state','AuthService','DTOptionsBuilder','$window',function($scope,$rootScope,$state,AuthService,DTOptionsBuilder,$window){
	$scope.dtOptions ={
		"searching": false,
		"order":[],
		"bFilter": false,
		"lengthChange": false,
	} 

	$scope.dataLoading=true;
	var email=$rootScope.globals.currentUser.userData.email;
  if ($state.params.status) {
    if ($state.params.status=="success") {
      $scope.success="Order Placed Successfully";
    };
  };
	AuthService.getPartnerOrders(email,function(response){
		$scope.dataLoading=false;
		console.log(response);
		if (response) {
			if (response.success==1) {
				
				$scope.orderList=response.partnerOrderList;
			}
		};
	});

	 $scope.getNumOfItems=function(value){
        var quantity=0;
        angular.forEach(value, function(index) {
            quantity=quantity+parseInt(index.quantity);
            });
        return quantity;
    }

    $scope.placeOrder=function(){
      console.log('place order');
    }

    

	$rootScope.setOrderStatus=function(response){
      
      switch(response.status){
          case '0':
              return "Order";
              break;
          case '1':
              return "Pick up";
              break;
          case '2':
              return "Cleaning";
              break;
          case '3':
              return "Delivered";
              break;
         
        }
      
    }

    $rootScope.getPaymentStatus=function (response) {
      if (response.payment_status=='1') {
          return "Paid";

      }else{
          return "Pending";
      }
    }

     $rootScope.setStatusColor=function (response){
      switch(response.status){
          case '0':
              return { "color": "#d32f2f" };
              break;
          case '1':
              return { "color": "#9c27b0" };
              break;
          case '2':
              return { "color": "#1fbad6" };
              break;
          case '3':
              return { "color": "#84CC66" };
              break;
          case '4':
              return { "color": "#f69c55" };
              break;
        }
    }

    $rootScope.setFontColor=function(response){
      if (response.payment_status=='1') {
        return { "color": "#84CC66" };
      }else{
        return { "color": "#d32f2f" };
      }
    }

    $rootScope.setInvoiceColor=function (response){
    	if (response.invoice_status=='1') {
        return { "color": "#84CC66" };
      }else{
        return { "color": "#d32f2f" };
      }
    }

    $rootScope.getInvoiceStatus=function  (response) {
    	// body...
    	if (response.invoice_status=='1') {
          return "Sent";
      }else{
          return "Pending";
      }
    }

    $scope.setValue=function(order){
      switch(order.status){
          case '0':
              return "Order placed";
              break;
          case '1':
              return "Pickup";
              break;
          case '2':
              return "Cleaning";
              break;
          case '3':
              return "Delivered";
              break;
          case '4':
              return "En route";
              break;
        }
    }

    $scope.viewDetail=function(order){
    	$rootScope.orderDetail=order;
    	$state.go('home.orderDetail');

    }
}]);