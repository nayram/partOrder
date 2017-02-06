'use strict';
angular.module('Home')
.controller('OrderDetailController',['$scope','$rootScope','$state','$window',function($scope,$rootScope,$state,$window){
	
    $scope.order=$rootScope.orderDetail;
    $('#order-tab').addClass('active');
    $scope.dtOptions ={
        "searching": false,
        "order":[],
        "bFilter": false,
        "lengthChange": false,
    } 

    if ($state.params.status) {
        if ($state.params.status=="update") {
            $scope.success="Order updated successfully";
        };
    };
    $scope.getNumOFItems=function(value){
        var quantity=0;
        angular.forEach($scope.order.inventoryList, function(index) {
            quantity=quantity+parseInt(index.quantity);
            });
        return quantity;
    }

    $scope.goBack=function(){
        $state.go('home.orderList');
    }

    $scope.getServiceCost=function(value){
        if (value!='') {
            $scope.invoiceAvail=true;
            return "GHC "+value;
        }else{
            $scope.invoiceAvail=false;
            return "Pending"
        }
    }

    $scope.viewInvoice=function(){
        $window.open("https://forhey.com/download/getFile.php?download_file="+$scope.order.invoice,'_blank');
    }



    $scope.seviceCostFont=function(value){
        if (value !='') {
            return { "color": "#84CC66" };
        }else{
            return { "color": "#d32f2f" };
        }
    }


}]);