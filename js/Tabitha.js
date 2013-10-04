var Tabitha = angular.module('tabitha',[]);

Tabitha.controller('Main', ['$scope', function($scope) {
    /* Set Default Objects */
    $scope.defaults = {};
    $scope.defaults.defaultCardType = function() {
        this.fields = [];
    };
    $scope.defaults.defaultCardType.prototype = {
        name: '',
        parent: null
    }
    $scope.defaults.defaultGame = function() {
        this.cardTypes = [];
    };
    $scope.defaults.defaultGame.prototype = {
        name: ''
    }

    $scope.games = {
        new: new $scope.defaults.defaultGame()
    };
    $scope.decks = [];


}]);

// Lazy Loader and Routing
Tabitha.config(function($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
    Tabitha.controllerProvider = $controllerProvider;
    Tabitha.compileProvider    = $compileProvider;
    Tabitha.routeProvider      = $routeProvider;
    Tabitha.filterProvider     = $filterProvider;
    Tabitha.provide            = $provide;

    var routes = [
        {
            path: '/',
            templateUrl: 'views/browser.html',
            dependencies: [
                'js/controllers/browser.js'
            ]
        },
        {
            path: '/gameBuilder/:gid/:submenu',
            templateUrl: 'views/gameBuilder.html',
            dependencies: [
                'js/controllers/gameBuilder.js',
                'js/controllers/gameBuilder.cardTypes.js',
                'js/directives/dragDrop.js',
                'js/third-party/jquery.jsPlumb-1.5.2-min.js',
                'js/services/jsPlumbService.js'
            ]
        },
        {
            path: '/gameBuilder/',
            redirectTo: '/gameBuilder/new/'
        }
    ]

    // Register routes with the $routeProvider
    angular.forEach(routes, function(route) {
        if(route.redirectTo)
            $routeProvider.when(route.path, {redirectTo:route.redirectTo});
        else
            $routeProvider.when(route.path, {templateUrl:route.templateUrl, resolve:{deps:function($q, $rootScope)
            {
                var deferred = $q.defer();

                $script(route.dependencies, function()
                {
                    // all dependencies have now been loaded by $script.js so resolve the promise
                    $rootScope.$apply(function()
                    {
                        deferred.resolve();
                    });
                });

                return deferred.promise;
            }}});
    });
    $routeProvider.otherwise({redirectTo:'/'});
});

Tabitha.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (input[i].id === id) {
        return input[i];
      }
    }
    return null;
  }
});