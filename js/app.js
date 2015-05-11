'use strict';

var qianxun = angular.module('qianxun', [
    'ngRoute'
]);

qianxun.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {
            controller: 'indexCtrl',
            templateUrl: 'tpl/index.html'
        }).when('/login', {
            controller: 'loginCtrl',
            templateUrl: 'tpl/login.html'
        }).when('/p/:id', {
            controller: 'pCtrl',
            templateUrl: 'tpl/p.html'
        }).otherwise({
            redirectTo: '/'
        });
}]);