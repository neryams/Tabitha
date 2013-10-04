angular.module('tabitha').controllerProvider.register('cardTypes', ['$scope', '$timeout', 'jsPlumbService', function($scope, $timeout, jsPlumbService) {
	$scope.currentCardType = null;
	$scope.jsPlumb = jsPlumbService;
	jsPlumbService.create();
	$scope.defaults.defaultCardType.prototype.setCardParent = function(index) {
        if(index === undefined)
            this.parent = null;
        else 
            this.parent = index;

        // Redraw jsPlumb when the parents change. Timeout so that it updates the angular stuff first.
        $timeout(function() {
        	$scope.jsPlumb.redrawRelationships();
        });
        
        return this;
    };

	$scope.getCardTypeHeader = function(index) {
		if(index === undefined)
			var currentCardType = $scope.currentCardType
		else
			var currentCardType = $scope.currentGame.cardTypes[index];
		if(!currentCardType)
			return false;
		else if(!currentCardType.name)
			return 'New Card Type';
		else
			return currentCardType.name;
	}
	$scope.getSelectedCardType = function(index) {
		if($scope.currentGame.cardTypes[index] == $scope.currentCardType)
			return 'selected';
		else
			return '';
	}
	$scope.selectCardType = function(index) {
		$scope.currentCardType = $scope.currentGame.cardTypes[index];
		$scope.$apply();
	}
	$scope.addNewCard = function(tool) {
		$scope.currentCardType = new $scope.defaults.defaultCardType();
		$scope.currentCardType.proto = $scope.toolbox.cardTypeTools[tool];
        $scope.currentGame.cardTypes.push($scope.currentCardType);
        $scope.selectCardType($scope.currentGame.cardTypes.length - 1);

        return $scope.currentCardType;
	}

    $scope.jsPlumbHook = function(index) {
        if($scope.currentGame.cardTypes[index]) {
        	if($scope.currentGame.cardTypes[index].parent !== null)
            	return 'jsPlumbElement jsPlumbLink-'+$scope.currentGame.cardTypes[index].parent;
            else 
            	return 'jsPlumbElement';
        }
        else
            return '';
    }

	var commonFields = [
		{
			name: 'name',
			label: 'Name',
			type: 'text'
		},
		{
			name: 'required',
			label: 'Required',
			type: 'checkbox'
		},
		{
			name: 'dataType',
			label: 'Data Type',
			type: 'select',
			options: [
				{
					name: 'Text',
					value: 'text'
				},
				{
					name: 'Integer',
					value: 'integer'
				}
			]
		}
	];
	$scope.toolbox.cardTypeTools = {
		cardType: {
			name: 'Card Type',
			color: 'red',
			inputsFrom: [
				'cardType'
			],
			fieldOptions: commonFields
		},
		conditional: {
			name: 'Conditional Card Type',
			color: 'blue',
			inputsFrom: [
				'cardType'
			],
			fieldOptions: commonFields
		}
	}
}]);