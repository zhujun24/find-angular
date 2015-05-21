'use strict';

qianxun.directive('footerDirective', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'tpl/footer.html'
    }
});

qianxun.directive('navDirective', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'tpl/nav.html'
    }
});

qianxun.directive('pbtnDirective', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'tpl/pbtn.html'
    }
});

qianxun.directive('galleryDirective', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'tpl/gallery.html'
    }
});

qianxun.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);