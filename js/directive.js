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

qianxun.directive('ngThumb', ['$window',
    function ($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function (item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function (file) {
                var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function (scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({width: width, height: height});
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }
]);