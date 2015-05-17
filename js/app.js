'use strict';

var qianxun = angular.module('qianxun', [
    'ui.router',
    'ui.bootstrap'
]);

qianxun.run(['$rootScope', '$state', '$modal',
        function ($rootScope, $state, $modal) {

            // 监测安全路由
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                var toUrl = toState.url;
                var secureUrl = ['/zone', '/publish/lost', '/publish/find', '/modify'];
                if (secureUrl.indexOf(toUrl) > -1) {
                    if (!$rootScope.isLogin) {
                        localStorage.setItem("publish", toState.name);
                        event.preventDefault();
                        $state.go("index.login");
                    }
                }
            });

            $rootScope.isLogin = sessionStorage.getItem("isLogin");
            $rootScope.user = JSON.parse(sessionStorage.getItem("user"));

            $rootScope.open = function (callback) {
                var modalInstance = $modal.open({
                    templateUrl: 'tpl/model.html',
                    controller: 'modalCtrl',
                    size: "",
                    resolve: {
                        item: function () {
                            return $rootScope.item;
                        },
                        callback: callback
                    }
                });
            };
        }
    ]
);

qianxun.config(function ($stateProvider, $urlRouterProvider) {

    // 路由重定向
    $urlRouterProvider
        .when("/index", "/index/index")
        .otherwise("/index/index");

    // Now set up the states
    $stateProvider
        .state('index', {
            url: "/index",
            template: "<div ui-view></div>"
        })
        .state('index.index', {
            url: "/index",
            templateUrl: "tpl/index.html",
            controller: "indexCtrl"
        })
        .state('index.find', {
            url: "/find",
            templateUrl: "tpl/info.html",
            controller: "findCtrl"
        })
        .state('index.lost', {
            url: "/lost",
            templateUrl: "tpl/info.html",
            controller: "lostCtrl"
        })
        .state('index.zone', {
            url: "/zone",
            templateUrl: "tpl/zone.html",
            controller: "zoneCtrl"
        })
        .state('index.about', {
            url: "/about",
            templateUrl: "tpl/about.html",
            controller: "aboutCtrl"
        })
        .state('index.introduction', {
            url: "/introduction",
            templateUrl: "tpl/introduction.html",
            controller: "introductionCtrl"
        })
        .state('index.reg', {
            url: "/reg",
            templateUrl: "tpl/reg.html",
            controller: "regCtrl"
        })
        .state('index.modify', {
            url: "/modify",
            templateUrl: "tpl/reg.html",
            controller: "modifyCtrl"
        })
        .state('index.login', {
            url: "/login",
            templateUrl: "tpl/login.html",
            controller: "loginCtrl"
        })
        .state('index.p', {
            url: "/p/{pid}",
            templateUrl: "tpl/p.html",
            controller: "pCtrl"
        })
        .state('index.publishFind', {
            url: "/publish/find",
            templateUrl: "tpl/publish.html",
            controller: "publishFindCtrl"
        })
        .state('index.publishLost', {
            url: "/publish/lost",
            templateUrl: "tpl/publish.html",
            controller: "publishLostCtrl"
        });
});