angular.module('tabitha').controller('navCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.navClass = function (page,urlIndex) {
        return $scope.navShow(page,urlIndex) ? 'active ' : '';
    };
    $scope.navShow = function (page,urlIndex) {
    	if(urlIndex === undefined)
    		urlIndex = 1;
        var currentRoute = $location.path().split("/")[urlIndex] || 'default';
        return page === currentRoute;
    };
}]);