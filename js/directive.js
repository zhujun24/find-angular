'use strict';

qianxun.directive('footerDirective', function () {
    return {
        restrict: 'E',
        templateUrl: 'tpl/footer.html'
    }
});

qianxun.directive('navDirective', function () {
    return {
        restrict: 'E',
        templateUrl: 'tpl/nav.html'
    }
});

qianxun.directive('galleryDirective', function () {
    return {
        restrict: 'E',
        templateUrl: 'tpl/gallery.html'
    }
});

qianxun.directive('pbtnDirective', function () {
    return {
        restrict: 'E',
        templateUrl: 'tpl/pbtn.html',
        controller: "pbtnCtrl"
    }
});