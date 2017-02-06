'use strict';
angular.module('Home')
.controller('PlaceOrderController',['$scope','$rootScope','$state','AuthService',
	function($scope,$rootScope,$state,AuthService){

		$scope.dtOptions ={
			"searching": false,
			"order":[],
			"bFilter": false,
			"lengthChange": false,
		}
		$scope.inventoryItem=[
			"Bed Linen","Blanket",
			"Curtain","Duvet",
			"Pillows","Pillow Cases",
			"Towels"];

		$scope.inventoryType=["King Size","Queen Size","Double"];
		$scope.invList={
			
			quantity:1
		};
		$scope.inventoryList=[];

		$scope.addInventoryItem=function(){
			console.log($scope.invList);
			if (($scope.invList.description !="") && ($scope.invList.type !="") && ($scope.invList.quantity>0)) {
				console.log($scope.invList.length);
				$scope.inventoryList.push($scope.invList);
				$scope.invList={
					quantity:1
				};
				addSummary();
			}else{
				// console.log($scope.invList.description+" "+$scope.invList.type+" "+$scope.invList.quantity);
			}
			
		}

		$scope.deleteRow=function($index){
			$scope.inventoryList.splice($index,1);
			addSummary();
		}

		var addSummary=function(){
			$scope.summary="";
			angular.forEach($scope.inventoryList, function(index) {
  				$scope.summary= $scope.summary+""+index.quantity+"  "+index.description+"  ("+index.type+") \n";
			});
		}

		$scope.addInventory=function(){
			$scope.pickupDate=$('#pickupDate').val();
			$scope.vm.selectTab(2);
		}

		$scope.addNote=function(){
			$scope.vm.selectTab(3);
		}

		$scope.viewConfirmation=function(){
			$scope.vm.selectTab(4);
		}
		$scope.viewSchedule=function(){
			$scope.vm.selectTab(1);
		}

		// $state.go('home.orderContent',{'id':'all'});
		$scope.addOrder=function(){
			var pickupDateTime=$("#pickupDate").val();
        	var pDate=pickupDateTime.split(" ");        
        	var pTime=pDate[1];
        	var dte=new Date();
        	var dd=dte.toDateString();
        	var server_code=dd.split(" ");
        	var s_val=server_code[0];
        	var s_code=s_val.split("");
        	var ssCode=s_code[0]+s_code[1];
        	var mnth=dte.getMonth();
        	mnth=mnth+1;
        	var dtYr = moment(pDate[0], "DD.MM.YYYY").format("YYYY/M/D");
        	var code=ssCode.toUpperCase()+mnth+dte.getDate();
        	var invString=JSON.stringify($scope.inventoryList);
        
        	if ($scope.inventoryList.length> 0) {
        		$scope.accLoading=true;
        	 	AuthService.addOrder(dtYr,pTime,$scope.orderNote,invString,code,$rootScope.globals.currentUser.userData.email,$scope.summary,function (response) {
        			// body...
        		$scope.accLoading=false;
        		console.log(response);
        		if (response) {
        			if (response.success==1) {       				
        			
        			AuthService.sendEmail(response.message,response.title);
        			$state.go('home.orderList',{'status':'success'});

        		}else{
        			$scope.error="Failed to place order. Please try again";
        		}
        	}else{
        		$scope.error="Failed to place order. Please try again";
        	}

        	});
}else{
	$scope.error="Add order inventory";
}
        	
        
       

		}

}]).directive('schedulePage',function(){
	return{
		restrict:'E',
		templateUrl:'modules/order/placeOrder/views/schedule.html',
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
                            "futureOnly": true,
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
			$scope.pickupDate=$('#pickupDate').val();
       
    },
    controllerAs:'vm'
}
})
.directive('inventoryPage',function(){
	return{
		restrict:'E',
		templateUrl:'modules/order/placeOrder/views/inventory.html',

	}
})
.directive('notePage',function(){
	return{
		restrict:'E',
		templateUrl:'modules/order/placeOrder/views/note.html',
		
	}
})
.directive('confirmationPage',function(){
	return{
		restrict:'E',
		templateUrl:'modules/order/placeOrder/views/confirmation.html',
		
	}
});