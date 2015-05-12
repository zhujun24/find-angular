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

        $('#myTab a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        })
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
            //点击登录后禁用提交按钮
            $scope.btnDisable = true;

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
                    alert("密码错误");
                    $scope.btnDisable = false;
                } else if (code == 203) {
                    alert("用户不存在");
                    $scope.btnDisable = false;
                }
            });
        }
    }
]);

qianxun.controller('pCtrl', ['$rootScope', '$scope', '$stateParams', '$location', 'p',
    function ($rootScope, $scope, $stateParams, $location, p) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };

        p.get($stateParams.pid).then(function (p) {
            $scope.p = p.data;
        });

        $scope.needLogin = function () {
            localStorage.setItem("path", $location.path());
            $location.path('/index/login');
        }

        $scope.comment = function (comment) {
            //localStorage.setItem("path", $location.path());
            //$location.path('/index/login');
            console.log(comment);
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

qianxun.controller('findCtrl', ['$rootScope', '$scope',
    function ($rootScope, $scope) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: true,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };
    }
]);

qianxun.controller('lostCtrl', ['$rootScope', '$scope',
    function ($rootScope, $scope) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: true,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };
    }
]);

qianxun.controller('aboutCtrl', ['$rootScope', '$scope',
    function ($rootScope, $scope) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: true,
            isLoginActive: false,
            isRegActive: false
        };
    }
]);

qianxun.controller('regCtrl', ['$rootScope', '$scope',
    function ($rootScope, $scope) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: true
        };
    }
]);