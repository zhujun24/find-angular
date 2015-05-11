'use strict';

var qianxun = angular.module('qianxun', [
    'ngRoute'
]);

qianxun.run(['$rootScope', '$location',
        function ($rootScope, $location) {
            $rootScope.isLogin = sessionStorage.getItem("isLogin");
            $rootScope.user = JSON.parse(sessionStorage.getItem("user"));

            var routesSecure = ['/zone']; //route that require login
            $rootScope.$on('$routeChangeStart', function () {
                if (routesSecure.indexOf($location.path()) != -1) {
                    if (!$rootScope.isLogin) {
                        $location.path('/login');
                    }
                }
            });
        }
    ]
);

qianxun.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {
            controller: 'indexCtrl',
            templateUrl: 'tpl/index.html'
        }).when('/login', {
            controller: 'loginCtrl',
            templateUrl: 'tpl/login.html'
        }).when('/zone', {
            controller: 'zoneCtrl',
            templateUrl: 'tpl/zone.html'
        }).when('/about', {
            //controller: 'zoneCtrl',
            templateUrl: 'tpl/about.html'
        }).when('/reg', {
            //controller: 'zoneCtrl',
            templateUrl: 'tpl/reg.html'
        }).when('/p/:id', {
            controller: 'pCtrl',
            templateUrl: 'tpl/p.html'
        }).otherwise({
            redirectTo: '/'
        });
}]);