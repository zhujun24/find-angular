'use strict';

qianxun.directive('navDirective', function () {
    return {
        restrict: 'E',
        controller: 'navCtrl',
        templateUrl: 'tpl/nav.html'
    }
});