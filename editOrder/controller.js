'use strict';
angular.module('Home')
.controller('EditOrderController',['$scope','$rootScope','$state','$window','AuthService',
	function($scope,$rootScope,$state,$window,AuthService){

	$scope.selectedOrder={};
	
	var selectedIndex;
	$scope.dtOptions ={
			"searching": false,
			"order":[],
			"bFilter": false,
			"lengthChange": false,
		}
		$scope.order=$rootScope.orderDetail;
		$scope.orderNote=$scope.order.note;
		$scope.inventoryList=$scope.order.inventoryList;
		console.log($scope.order);
		$scope.addInventoryItem=function(){
			if (($scope.invList.description !="") && ($scope.invList.type !="") && ($scope.invList.quantity>0)) {
				console.log($scope.invList.length);
				$scope.inventoryList.push($scope.invList);
				$scope.invList={
					quantity:1
				};
				addSummary();
			}
			
		}

		$scope.deleteRow=function($index){
			$scope.inventoryList.splice($index,1);
			addSummary();
		}

		$scope.viewConfirmation=function(){
			$scope.pickupDate=$('#pickupDate').val();
			addSummary();
			$scope.editVm.selectTab(4);
		}

		$scope.goBack=function(){
			$scope.editVm.selectTab(3);
		}

		$scope.goOrderDet=function(){
			$state.go('home.orderDetail');
		}

		$scope.updateOrder=function(){
			var pickupDateTime=$("#pickupDate").val();
        		var pDate=pickupDateTime.split(" ");        
        		var pTime=pDate[1];
        		var date = moment(pDate[0], "DD.MM.YYYY").format("YYYY-M-D");
        		var invString=JSON.stringify($scope.inventoryList);
        		$scope.accLoading=true;
				AuthService.updateOrder($rootScope.globals.currentUser.userData.email,$scope.orderNote,date,pTime,$scope.order.server_code,invString,function(response){
					$scope.accLoading=false;
					console.log(response);
					if (response) {
						if (response.success==1) {
							$rootScope.orderDetail.pickupDate=date;
							$rootScope.orderDetail.pickupTime=pTime;
							$rootScope.orderDetail.note=$scope.orderNote;
							$rootScope.orderDetail.inventoryList=$scope.inventoryList;


							$state.go('home.orderDetail',{'status':'update'});
						}else{
							$scope.error="Order update failed. Please try again";
						}
					}else{
						$scope.error="Order update failed. Please try again";
					}
				});	
					
		}

		var addSummary=function(){
			$scope.summary="";
			angular.forEach($scope.inventoryList, function(index) {
  				$scope.summary= $scope.summary+""+index.quantity+"  "+index.description+"  ("+index.type+") \n";
			});
		}



}])
.directive('editschedulePage',function(){
	return{
		restrict:'E',
		templateUrl:'modules/order/editOrder/views/schedule.html',
		controller:function($scope){

        this.tab=1;
        this.selectTab=function(setTab){
        this.tab=setTab;
      };
        this.isSelected=function(checkTab){
        return this.tab===checkTab;
      };
      // getPartners();
      $('*[name=pickupDate]').appendDtpicker({
            "closeOnSelected": true,
                            "futureOnly": false,
                            "dateFormat": "DD.MM.YYYY H:mmTT",
                            "minTime":"07:00",
                            "maxTime":"12:05",
							"amPmInTimeList": true,
                            "allowWdays": [1, 2, 3, 4, 5, 6],
                            "onShow": function(handler){
									console.log('Picker is shown!');
									},
							"onHide": function(handler){
									console.log('Picker is hidden!');
									$scope.pickupDate=$('#pickupDate').val();

							}
                        });
      var dtYr = moment($scope.order.pickupDate, "YYYY/M/D").format("DD.MM.YYYY");
      $('#pickupDate').val(dtYr+" "+$scope.order.pickupTime);

			
       
    },
    controllerAs:'editVm'
}
})
.directive('editinventoryPage',function(){
	return{
		restrict:'E',
		templateUrl:'modules/order/editOrder/views/inventory.html',

	}
})
.directive('editnotePage',function(){
	return{
		restrict:'E',
		templateUrl:'modules/order/editOrder/views/note.html',
		
	}
})
.directive('summaryPage',function(){
	return{
		restrict:'E',
		templateUrl:'modules/order/editOrder/views/confirmation.html'
	}
});