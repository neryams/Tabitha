angular.module('tabitha').controllerProvider.register('cardTypes', ['$scope', '$timeout', 'jsPlumbService', function($scope, $timeout, jsPlumbService) {
	$scope.currentCardType = null;
	$scope.jsPlumb = jsPlumbService;
	jsPlumbService.setDefaults();

	$scope.defaults.defaultCardType.prototype.setCardParent = function(index) {
        if(index === undefined)
            this.parent = null;
        else 
            this.parent = index;

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
	$scope.cardTypeIsSelected = function(index) {
		if($scope.currentGame.cardTypes[index] == $scope.currentCardType)
			return 'selected';
		else
			return '';
	}
	$scope.getCardTypePosition = function(index) {
		return {
			left: $scope.currentGame.cardTypes[index].ui.position.x,
			top: $scope.currentGame.cardTypes[index].ui.position.y
		}
	}

	$scope.selectCardType = function(index) {
		$scope.currentCardType = $scope.currentGame.cardTypes[index];
	}
	$scope.addNewCard = function(tool) {
		$scope.currentCardType = new $scope.defaults.defaultCardType();
		$scope.currentCardType.proto = $scope.toolbox.cardTypeTools[tool];
        $scope.currentGame.cardTypes.push($scope.currentCardType);
        $scope.selectCardType($scope.currentGame.cardTypes.length - 1);

        return $scope.currentCardType;
	}

	$scope.$watch('currentGame.cardTypes', function() {
		$scope.jsPlumb.refresh();
	})

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