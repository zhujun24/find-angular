'use strict';

qianxun.directive('galleryDirective', function () {
    return {
        restrict: 'E',
        controller: 'galleryCtrl',
        templateUrl: 'tpl/gallery.html'
    }
});

qianxun.directive('navDirective', function () {
    return {
        restrict: 'E',
        controller: 'navCtrl',
        templateUrl: 'tpl/nav.html'
    }
});

qianxun.directive('pbtnDirective', function () {
    return {
        restrict: 'E',
        templateUrl: 'tpl/pbtn.html'
    }
});