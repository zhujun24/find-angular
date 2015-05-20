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

        index.all().then(function (resp) {
            console.log(resp);
            $rootScope.success = resp.data.succeed;
            $rootScope.year = resp.data.year;
            $scope.tabs = resp.data;
        }, function (resp) {
            console.log(resp);
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

            login.login(user).then(function (resp) {
                var code = resp.meta.code;
                if (code == 201) {
                    $rootScope.user = resp.data;
                    $rootScope.isLogin = true;
                    sessionStorage.setItem("isLogin", true);
                    sessionStorage.setItem("user", JSON.stringify(resp.data));

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
            }, function (resp) {
                console.log(resp);
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

            reg.reg(user).then(function (resp) {
                var code = resp.meta.code;
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
            }, function (resp) {
                console.log(resp);
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

        p.get($stateParams.pid).then(function (resp) {
            $scope.pPublish = resp.data.publish;
            $scope.pComment = resp.data.comment;
        }, function (resp) {
            console.log(resp);
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
            }).then(function (resp) {
                if (resp.meta.code == 201) {
                    $scope.content = "";
                    var comment = {
                        cdetails: content,
                        ctime: resp.data.publishDate,
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
                } else if (resp.meta.code == 202) {
                    alert("用户未登陆");
                }
            }, function (resp) {
                console.log(resp);
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
            logout.logout().then(function (resp) {
                if (resp.meta.code == 201) {

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
            }, function (resp) {
                console.log(resp);
            });
        };

        $('#myTab a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        });

        zone.getZone($rootScope.user.uid).then(function (resp) {
            $scope.find = resp.data.find;
            $scope.lost = resp.data.lost;
            $scope.comment = resp.data.comment;

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
        }, function (resp) {
            console.log(resp);
        });

        $scope.switchSucceed = function (pid) {
            var that = this;
            if (confirm("确认已经找到失物或失主？") == true) {
                zone.succeed(pid).then(function (resp) {
                    var code = resp.meta.code;
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
                }, function (resp) {
                    console.log(resp);
                });
            }
        };

        $scope.deleteComment = function (cid) {
            var that = this;
            if (confirm("确认删除该条评论？") == true) {
                zone.deleteComment(cid).then(function (resp) {
                    var code = resp.meta.code;
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
                }, function (resp) {
                    console.log(resp);
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
            modify.modify(user.uid, data).then(function (resp) {
                var code = resp.meta.code;
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
            }, function (resp) {
                console.log(resp);
            });
        }
    }
]);

qianxun.controller('infoCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'fall',
    function ($rootScope, $scope, $state, $timeout, fall) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };

        var currentUrl = $state.current.url,
            data = {
                pnum: 0
            };

        $scope.fallData = [];
        $scope.text = "数据加载中";

        if (currentUrl == "/find") {
            data.ptype = 1;
            $rootScope.active.isFindActive = true;
        } else if (currentUrl == "/lost") {
            data.ptype = 0;
            $rootScope.active.isLostActive = true;
        }

        $scope.getFallData = function (data) {
            fall.fallInfo(data).then(function (resp) {
                //console.log(resp.data);
                for (var i = 0, l = resp.data.fall.length; i < l; i++) {
                    $scope.fallData.push(resp.data.fall[i]);
                }
                if ($scope.fallData.length == resp.data.over) {
                    $scope.getFallData = function () {
                        return false;
                    };
                    $scope.text = "已加载全部信息";
                }
                console.log($scope.fallData);
            }, function (resp) {
                console.log(resp);
            });
        };
        $scope.getFallData(data);

        $scope.load = function () {
            $scope.text = "数据加载中";
            data.pnum++;
            $scope.getFallData(data);
        };

        $(window).on('scroll', function (event) {
            if ($(document).height() - $(document).scrollTop() - $(window).height() <= 500) {
                //当滚动到页面底部
                $scope.load();
            }
        });
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

qianxun.controller('publishCtrl', ['$rootScope', '$scope', '$state', 'publish',
    function ($rootScope, $scope, $state, publish) {
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

            publish.publishInfo(good).then(function (resp) {
                var code = resp.meta.code;
                if (code == 201) {
                    $rootScope.item = {
                        title: "信息发布",
                        btnContent: "去看看",
                        content: "发布成功"
                    };

                    var callback = function () {
                        $state.go("index.p", {pid: resp.data.pid});
                    };

                    $rootScope.open(callback);
                }
            }, function (resp) {
                console.log(resp);
            });
        };

        //图片上传
        //uploader.filters.push({
        //    name: 'imageFilter',
        //    fn: function (item /*{File|FileLikeObject}*/, options) {
        //        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        //        return ('|jpg|png|jpeg|'.indexOf(type) !== -1 || this.size <= 1024 * 1024 * 2);
        //    }
        //});
    }
]);

qianxun.controller('resetCtrl', ['$rootScope', '$scope', 'reset',
    function ($rootScope, $scope, reset) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };

        $scope.resetPassword = function (password) {
            var data = {
                oldpass: password.old,
                newpass: password.new,
                uid: $rootScope.user.uid
            };

            reset.reset(data).then(function (resp) {
                var code = resp.meta.code;
                if (code == 201) {
                    $rootScope.item = {
                        title: "修改密码",
                        btnContent: "去登陆",
                        content: "修改密码成功"
                    };

                    var callback = function () {
                        $state.go("index.login");
                    };

                    $rootScope.open(callback);
                } else if (code == 202) {
                    $rootScope.item = {
                        title: "修改密码",
                        btnContent: "确定",
                        content: "原密码错误"
                    };

                    $rootScope.open();
                } else if (code == 203) {
                    alert("用户未登陆，改毛啊");
                } else if (code == 204) {
                    alert("改别人密码");
                }
            }, function (resp) {
                console.log(resp);
            });
        }
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

qianxun.controller('upload', ['$rootScope', '$scope', 'fileUpload',
    function ($rootScope, $scope, fileUpload) {
        $scope.uploadText = "上传图片";
        $scope.uploadBtn = false;
        $scope.upload = function () {
            var file = $scope.myFile;
            var photoName = file.name;
            var pos = photoName.lastIndexOf(".");
            var photoType = photoName.substring(pos + 1);
            console.log('file is ' + JSON.stringify(file));
            fileUpload.uploadFile(file, photoType).then(function(resp){
                var code = resp.meta.code;
                if(code==201){
                    $scope.uploadText = "图片上传成功";
                    $scope.uploadBtn = true;
                    $scope.imgUrl = "/upload/temp/"+$rootScope.user.uid+"."+photoType;
                }
            });
        };

        $scope.change = function (element) {
            $scope.uploadText = "上传图片";
            $scope.uploadBtn = false;
            $scope.$apply(function () {
                var photofile = element.files[0];
                var reader = new FileReader();
                reader.onload = function () {
                    console.log(photofile);
                    if(photofile.size>2*1024*1024){
                        alert("请上传一张小于2M的图片");
                    }
                };
                reader.readAsDataURL(photofile);
            });
        };
    }]);