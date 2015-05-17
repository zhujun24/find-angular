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
        controller: 'pbtnCtrl'
    }
});

qianxun.directive('fileUploader', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('change', function () {
                var input_file = element[0].files[0];
                $parse(attrs.fileUploader).assign(scope, input_file);
                scope.$apply();
                console.log(scope.input_file);
            });
        }
    };
}]);