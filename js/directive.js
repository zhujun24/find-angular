'use strict';

qianxun.directive('galleryDirective', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'tpl/gallery.html',
    link: function () {
      //预加载图片
      $.preloadImages = function () {
        for (var i = 0; i < arguments.length; i++)
          $("<img>").attr("src", arguments[i]);
      };
      //3秒后加载所有图片
      $(document).delay(3000).queue(function () {
        $.preloadImages("/images/banner2.jpg", "/images/banner3.jpg");
      });

      // 图片轮播
      var num = 1;

      function change() {
        num++;
        num = (num + 2) % 3 + 1;
        $('#bg').fadeTo('slow', 0, function () {
          $(this).attr('src', 'images/banner' + num + '.jpg');
        }).fadeTo('slow', 1);
      }

      var time1 = setInterval(change, 5000);

      $('.jumbotron').mouseover(function () {
        clearInterval(time1);
      });
      $('.jumbotron').mouseout(function () {
        time1 = setInterval(change, 5000);
      });
    }
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
