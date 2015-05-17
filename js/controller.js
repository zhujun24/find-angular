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

        index.all().then(function (p) {
            $rootScope.success = p.data.succeed;
            $rootScope.year = p.data.year;
            $scope.tabs = p.data;
        }, function (p) {
            console.log(p.meta.message);
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

            login.login(user).then(function (p) {
                var code = p.meta.code;
                if (code == 201) {
                    $rootScope.user = p.data;
                    $rootScope.isLogin = true;
                    sessionStorage.setItem("isLogin", true);
                    sessionStorage.setItem("user", JSON.stringify(p.data));

                    var path = localStorage.getItem("path");
                    var publish = localStorage.getItem("publish");
                    if (path) {
                        $state.go("index.p", {pid: path});
                        localStorage.removeItem("path");
                    } else if (publish) {
                        $state.go(publish);
                        localStorage.removeItem("publish");
                    }
                    else {
                        $state.go("index.zone");
                    }
                } else if (code == 202) {
                    //密码错误
                    $rootScope.item = {
                        title: "登录",
                        btnContent: "返回登陆",
                        content: "密码错误"
                    };
                    var callback = function () {
                        $scope.user.password = "";
                    };

                    $rootScope.open(callback);
                    $scope.btnDisable = false;
                } else if (code == 203) {
                    //用户不存在
                    $rootScope.item = {
                        title: "登录",
                        btnContent: "返回登陆",
                        content: "用户不存在"
                    };
                    var callback = function () {
                        $scope.user.email = "";
                    };

                    $rootScope.open(callback);
                    $scope.btnDisable = false;
                }
            }, function (p) {
                console.log(p.meta.message);
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

        $scope.btnInfo = "立即注册";

        $scope.reg = function (user) {
            //点击注册后禁用提交按钮
            $scope.btnDisable = true;

            if (!user.qq) {
                user.qq = "";
            }

            reg.reg(user).then(function (p) {
                var code = p.meta.code;
                if (code == 201) {
                    $rootScope.item = {
                        title: "注册",
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
                        title: "注册",
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
                        title: "注册",
                        btnContent: "返回注册",
                        content: "昵称已被占用！请换个昵称重新注册。"
                    };
                    var callback = function () {
                        $scope.user.name = "";
                    };

                    $rootScope.open(callback);
                    $scope.btnDisable = false;
                }
            }, function (p) {
                console.log(p.meta.message);
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
        }, function (p) {
            console.log(p.meta.message);
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
            }).then(function (p) {
                if (p.meta.code == 201) {
                    $scope.content = "";
                    var comment = {
                        cdetails: content,
                        ctime: p.data.publishDate,
                        uname: $rootScope.user.name,
                        uheader: $rootScope.user.header
                    };
                    $scope.pComment.unshift(comment);

                    $rootScope.item = {
                        title: "评论",
                        btnContent: "确定",
                        content: "评论发布成功"
                    };

                    $rootScope.open();
                } else if (p.meta.code == 202) {
                    alert("用户未登陆");
                }
            }, function (p) {
                console.log(p.meta.message);
            })
        };
    }
]);

qianxun.controller('zoneCtrl', ['$rootScope', '$scope', '$state', '$modal', 'logout', 'zone',
    function ($rootScope, $scope, $state, $modal, logout, zone) {
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
            logout.logout().then(function (p) {
                if (p.meta.code == 201) {

                    $rootScope.item = {
                        title: "登出",
                        btnContent: "去首页",
                        content: "登出成功"
                    };

                    var callback = function () {
                        $state.go("index.index");
                    };

                    $rootScope.open(callback);

                    $rootScope.user = null;
                    $rootScope.isLogin = false;
                    sessionStorage.removeItem("isLogin");
                    sessionStorage.removeItem("user");
                }
            }, function (p) {
                console.log(p.meta.message);
            });
        };

        $('#myTab a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        });

        zone.getZone($rootScope.user.uid).then(function (p) {
            $scope.find = p.data.find;
            $scope.lost = p.data.lost;
            $scope.comment = p.data.comment;

            $scope.succeed = [];
            for (var i = 0; i < $scope.find.length; i++) {
                var s = $scope.find[i];
                if (s.psucceed == 1) {
                    $scope.succeed.push(s);
                }
            }
            for (var i = 0; i < $scope.lost.length; i++) {
                var s = $scope.lost[i];
                if (s.psucceed == 1) {
                    $scope.succeed.push(s);
                }
            }
        }, function (p) {
            console.log(p.meta.message);
        });

        $scope.switchSucceed = function (pid) {
            var that = this;
            if (confirm("确认已经找到失物或失主？") == true) {
                zone.succeed(pid).then(function (p) {
                    var code = p.meta.code;
                    if (code == 201) {
                        $rootScope.item = {
                            title: "个人中心",
                            btnContent: "确定",
                            content: "修改信息状态成功"
                        };
                        $rootScope.open();
                        that.content.psucceed = 1;
                        $scope.succeed.push(that.content);
                    } else if (code == 202) {
                        alert("不是你发布的，改毛啊");
                    } else if (code == 203) {
                        alert("用户未登陆，改毛啊");
                    }
                }, function (p) {
                    console.log(p.meta.message);
                });
            }
        };

        $scope.deleteComment = function (cid) {
            var that = this;
            if (confirm("确认删除该条评论？") == true) {
                zone.deleteComment(cid).then(function (p) {
                    var code = p.meta.code;
                    if (code == 201) {
                        $rootScope.item = {
                            title: "个人中心",
                            btnContent: "确定",
                            content: "删除成功"
                        };
                        $rootScope.open();
                        var index = $scope.comment.indexOf(that.content);
                        $scope.comment.splice(index, 1);
                    } else if (code == 202) {
                        alert("不是你发布的，改毛啊");
                    } else if (code == 203) {
                        alert("用户未登陆，改毛啊");
                    }
                }, function (p) {
                    console.log(p.meta.message);
                });
            }
        }
    }
]);

qianxun.controller('modifyCtrl', ['$rootScope', '$scope', '$state', 'modify',
    function ($rootScope, $scope, $state, modify) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };

        $scope.isModify = true;
        $scope.btnInfo = "立即修改";

        $scope.reg = function (user) {
            var data = {
                uname: user.name,
                utel: user.tel,
                uqq: user.qq
            };
            modify.modify(user.uid, data).then(function (p) {
                var code = p.meta.code;
                if (code == 201) {
                    $rootScope.item = {
                        title: "个人中心",
                        btnContent: "返回个人中心",
                        content: "资料修改成功"
                    };

                    var callback = function () {
                        $state.go("index.zone");
                    };

                    $rootScope.open(callback);

                    $rootScope.user.uname = user.name;
                    $rootScope.user.utel = user.tel;
                    $rootScope.user.uqq = user.qq;

                    var modifyUser = {
                        uid: user.uid,
                        email: user.email,
                        name: user.name,
                        tel: user.tel,
                        qq: user.qq,
                        header: user.header
                    };

                    sessionStorage.setItem("user", JSON.stringify(modifyUser));
                } else if (code == 202) {
                    alert("用户未登陆，改毛啊");
                }
            }, function (p) {
                console.log(p.meta.message);
            });
        }
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

qianxun.controller('publishFindCtrl', ['$rootScope',
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

qianxun.controller('publishCtrl', ['$rootScope', '$scope', '$state', 'FileUploader', 'publish',
    function ($rootScope, $scope, $state, FileUploader, publish) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };

        $scope.lunches = ['卡类证件', '随身物品', '书籍文具', '电子数码', '衣服饰品', '其他物品'];

        $scope.publish = function (good) {
            var currentUrl = $state.current.url;
            if (currentUrl == '/publish/lost') {
                good.ptype = 0;
            } else if (currentUrl == '/publish/find') {
                good.ptype = 1;
            }

            good.photoType = localStorage.getItem("photoType");
            localStorage.removeItem("photoType");

            publish.publishInfo(good).then(function (p) {
                var code = p.meta.code;
                if (code == 201) {
                    $rootScope.item = {
                        title: "信息发布",
                        btnContent: "去看看",
                        content: "发布成功"
                    };

                    var callback = function () {
                        $state.go("index.p", {pid: p.data.pid});
                    };

                    $rootScope.open(callback);
                }
            }, function (p) {
                console.log(p);
            });
        };


        //图片上传
        var uploader = $scope.uploader = new FileUploader({
            url: '/api/v1/photo'
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        $scope.uploaderQueue = uploader.queue[0];

        uploader.onCompleteItem = function (fileItem, res) {
            localStorage.setItem("photoType", res.data.type);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
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
        $state.go("index.publishFind");
    };
    $scope.publishLost = function () {
        $state.go("index.publishLost");
    };
}]);