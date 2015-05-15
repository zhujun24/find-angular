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

qianxun.controller('loginCtrl', ['$rootScope', '$scope', '$state', '$modal', 'login',
    function ($rootScope, $scope, $state, $modal, login) {
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
                    var publish = localStorage.getItem("publish");
                    if (path) {
                        $state.go("index.p", {pid: path});
                        localStorage.removeItem("path");
                    } else if (publish) {
                        $state.go("index.publish");
                        localStorage.removeItem("publish");
                    }
                    else {
                        $state.go("index.zone");
                    }
                } else if (code == 202) {
                    //密码错误
                    $rootScope.item = {
                        title: "",
                        btnContent: "返回登陆",
                        content: "密码错误！"
                    };
                    var callback = function () {
                        $scope.user.password = "";
                    };

                    $rootScope.open(callback);
                    $scope.btnDisable = false;
                } else if (code == 203) {
                    //用户不存在
                    $rootScope.item = {
                        title: "",
                        btnContent: "返回登陆",
                        content: "用户不存在！"
                    };
                    var callback = function () {
                        $scope.user.email = "";
                    };

                    $rootScope.open(callback);
                    $scope.btnDisable = false;
                }
            });
        }
    }
]);

qianxun.controller('regCtrl', ['$rootScope', '$scope', '$state', '$modal', 'reg',
    function ($rootScope, $scope, $state, $modal, reg) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: true
        };

        $scope.reg = function (user) {
            //点击注册后禁用提交按钮
            $scope.btnDisable = true;

            if (!user.qq) {
                user.qq = "";
            }

            reg.reg(user).then(function (index) {
                var code = index.meta.code;
                if (code == 201) {
                    $rootScope.item = {
                        title: "",
                        btnContent: "马上登陆",
                        content: "注册成功！去登陆"
                    };
                    var callback = function () {
                        $state.go("index.login");
                    };

                    $rootScope.open(callback);
                } else if (code == 202) {
                    //邮箱存在
                    $rootScope.item = {
                        title: "",
                        btnContent: "返回注册",
                        content: "邮箱已经注册！请换个邮箱重新注册。"
                    };
                    var callback = function () {
                        $scope.user.email = "";
                    };

                    $rootScope.open(callback);
                    $scope.btnDisable = false;
                } else if (code == 203) {
                    //昵称存在
                    $rootScope.item = {
                        title: "",
                        btnContent: "返回注册",
                        content: "昵称已被占用！请换个昵称重新注册。"
                    };
                    var callback = function () {
                        $scope.user.name = "";
                    };

                    $rootScope.open(callback);
                    $scope.btnDisable = false;
                }
            });
        }
    }
]);

qianxun.controller('pCtrl', ['$rootScope', '$scope', '$stateParams', '$state', '$modal', 'p',
    function ($rootScope, $scope, $stateParams, $state, $modal, p) {
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
            $scope.pPublish = p.data.publish;
            $scope.pComment = p.data.comment;
            console.log($scope.pComment);
        });

        $scope.needLogin = function () {
            localStorage.setItem("path", $stateParams.pid);
            $state.go("index.login");
        };

        $scope.comment = function (content) {
            p.comment({
                cdetails: content,
                pid: $stateParams.pid,
                uid: $rootScope.user.uid
            }).then(function (res) {
                if (res.meta.code == 201) {
                    $scope.content = "";
                    var comment = {
                        cdetails: content,
                        ctime: res.data.publishDate,
                        uname: $rootScope.user.name,
                        uheader: $rootScope.user.header
                    };
                    $scope.pComment.unshift(comment);

                    $rootScope.item = {
                        title: "",
                        btnContent: "确定",
                        content: "评论发布成功！"
                    };

                    $rootScope.open();
                } else if (res.meta.code == 202) {
                    $rootScope.item = {
                        title: "",
                        btnContent: "确定",
                        content: "用户未登陆！"
                    };

                    $rootScope.open();
                }
            })
        };
    }
]);

qianxun.controller('zoneCtrl', ['$rootScope', '$scope', '$state', 'logout', 'zone',
    function ($rootScope, $scope, $state, logout, zone) {
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
            logout.logout().then(function (index) {
                if (index.meta.code == 201) {
                    console.log("登出成功");
                    $rootScope.user = null;
                    $rootScope.isLogin = false;
                    sessionStorage.removeItem("isLogin");
                    sessionStorage.removeItem("user");
                    $state.go("index.index");
                }
            });
        };

        $('#myTab a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        });

        zone.getZone($rootScope.user.uid).then(function (p) {
            console.log(p.data);
            $scope.find = p.data.find;
            $scope.lost = p.data.lost;
            $scope.comment = p.data.comment;

            $scope.succeed = [];
            for (var i = 0; i < $scope.find.length; i++) {
                var s = $scope.find[i];
                if(s.psucceed == 1){
                    $scope.succeed.push(s)
                }
            }
            for (var i = 0; i < $scope.lost.length; i++) {
                var s = $scope.lost[i];
                if(s.psucceed == 1){
                    $scope.succeed.push(s)
                }
            }
        });
    }
]);

qianxun.controller('publishCtrl', ['$rootScope', '$scope',
    function ($rootScope, $scope) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };
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

qianxun.controller('aboutCtrl', ['$rootScope',
    function ($rootScope) {
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

qianxun.controller('introductionCtrl', ['$rootScope',
    function ($rootScope) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };
    }
]);

//模态框控制器
qianxun.controller('modalCtrl', function ($rootScope, $scope, $modalInstance, item, callback) {
    $rootScope.item = item;
    $scope.ok = function () {
        $modalInstance.close();
        $scope.callback = callback;
    };
});

qianxun.controller('pbtnCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.publishFind = function () {
        localStorage.setItem("publish", "find");
        $state.go("index.publish");
    };
    $scope.publishLost = function () {
        localStorage.setItem("publish", "lost");
        $state.go("index.publish");
    };
}]);