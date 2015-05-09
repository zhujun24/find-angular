'use strict';

qianxun.directive('galleryDirective', function () {
    return {
        restrict: 'E',
        controller: 'galleryCtrl',
        templateUrl: 'tpl/gallery.html'
    }
});