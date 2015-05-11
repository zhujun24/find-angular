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
                    $rootScope.isLogin = true;
                    sessionStorage.setItem("isLogin", true);
                    sessionStorage.setItem("user", JSON.stringify(index.data));

                    var path = localStorage.getItem("path");
                    if (path) {
                        $location.path(path);
                        localStorage.removeItem("path");
                    } else {
                        $location.path('/zone');
                    }
                } else if (code == 202) {
                    console.log("密码错误");
                } else if (code == 203) {
                    console.log("用户不存在");
                }
            });
        }
    }
]);

qianxun.controller('pCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'p',
    function ($rootScope, $scope, $routeParams, $location, p) {
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

        $scope.needLogin = function () {
            localStorage.setItem("path", $location.path());
            $location.path('/login');
        }
    }
]);

qianxun.controller('zoneCtrl', ['$rootScope', '$scope', '$location', 'logout',
    function ($rootScope, $scope, $location, logout) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: true,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };

        $scope.logout = function () {
            console.log("out");
            logout.logout().then(function (index) {
                if (index.meta.code == 201) {
                    console.log("登出成功");
                    $rootScope.user = null;
                    $rootScope.isLogin = false;
                    sessionStorage.removeItem("isLogin");
                    sessionStorage.removeItem("user");
                    $location.path('/');
                }
            });
        }

        //p.get($routeParams.id).then(function (p) {
        //    console.log(p.data);
        //    $scope.p = p.data;
        //});
    }
]);