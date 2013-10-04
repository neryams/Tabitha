angular.module('tabitha').controllerProvider.register('GameBuilder', ['$scope','$routeParams','$location', function($scope, $routeParams, $location) {
	/* Set Default Objects */
	$scope.gid = $routeParams.gid;
	$scope.page = $routeParams.submenu;
	if(!$scope.page)
		$scope.page = 'default'
	$scope.currentGame = $scope.games[$scope.gid];
	$scope.input = {};
	$scope.input.unsaved = false;

	/* Common Functions */

	$scope.$watch('currentGame.name', function(newValue, oldValue) {
		if(newValue !== oldValue) {
			$scope.input.unsaved = true;
			var newId = newValue.replace(/\W/g,'');
			if(!newId)
				$scope.input.invalidNameReason = 'Game Name is required.';
			else if($scope.games[newId] !== undefined)
				$scope.input.invalidNameReason = 'Name already exists.';
			else
				delete $scope.input.invalidNameReason;
		}
	});

	$scope.toolbox = {}

	$scope.save = function() {
		if($scope.input.unsaved) {
			if($scope.gid !== 'new')
				delete $scope.games[$scope.gid];

			$scope.gid = $scope.currentGame.name.replace(/\W/g,'');
			$scope.games[$scope.gid] = angular.copy($scope.currentGame);
			$location.path('/gameBuilder/'+$scope.gid+'/');
			$scope.currentGame = $scope.games[$scope.gid];
			$scope.input.unsaved = false;
		}
	}

	$scope.gameName = function() {
		if($scope.gid == 'new')
			return 'New Card Game';
		else
			return $scope.currentGame.name;
	}
}]);