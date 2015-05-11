'use strict';

qianxun.controller('indexCtrl', ['$rootScope', '$scope', 'index',
    function ($rootScope, $scope, index) {
        $rootScope.active = {
            isIndexActive: true,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };

        index.all().then(function (index) {
            console.log(index);

            $rootScope.success = index.data.succeed;
            $rootScope.year = index.data.year;
            $scope.tabs = index.data;
        });
    }
]);

qianxun.controller('loginCtrl', ['$rootScope', '$scope', '$location', 'login',
    function ($rootScope, $scope, $location, login) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: true,
            isRegActive: false
        };

        $scope.login = function (user) {
            //console.log(user);

            login.login(user).then(function (index) {
                var code = index.meta.code;
                if (code == 201) {
                    $rootScope.user = index.data;
                    $rootScope.login = true;
                    $location.path('/');
                } else if (code == 202) {
                    console.log("密码错误");
                } else if (code == 203) {
                    console.log("用户不存在");
                }
            });
        }
    }
]);

qianxun.controller('pCtrl', ['$rootScope', '$scope', '$routeParams', 'p',
    function ($rootScope, $scope, $routeParams, p) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };

        p.get($routeParams.id).then(function (p) {
            console.log(p.data);
            $scope.p = p.data;
        });
    }
]);