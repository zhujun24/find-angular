'use strict';

var qianxun = angular.module('qianxun', []);

qianxun.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {
            controller: 'indexCtrl',
            templateUrl: 'tpl/index.html'
        }).when('/edit/:id', {
            controller: 'EditCtrl',
            templateUrl: 'tpl/edit.html'
        }).otherwise({
            redirectTo: '/'
        });
}]);