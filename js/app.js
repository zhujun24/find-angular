'use strict';

var qianxun = angular.module('qianxun', [
    'ngRoute'
]);

qianxun.run(function ($rootScope) {
    $rootScope.active = {isIndexActive: true, isFindActive: false, isLostActive: false, isZoneActive: false, isAboutActive: false, isLoginActive: false, isRegActive: false}
});

qianxun.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {
            controller: 'indexCtrl',
            templateUrl: 'tpl/index.html'
        }).when('/p/:id', {
            controller: 'pCtrl',
            templateUrl: 'tpl/p.html'
        }).otherwise({
            redirectTo: '/'
        });
}]);