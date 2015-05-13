'use strict';

var qianxun = angular.module('qianxun', [
    'ui.router',
    'ui.bootstrap'
]);

qianxun.run(['$rootScope', '$state',
        function ($rootScope, $state) {

            // 监测安全路由
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                var toUrl = toState.url;
                if ('/zone' == toUrl) {
                    if (!$rootScope.isLogin) {
                        event.preventDefault();
                        $state.go("index.login");
                    }
                }
            });

            $rootScope.isLogin = sessionStorage.getItem("isLogin");
            $rootScope.user = JSON.parse(sessionStorage.getItem("user"));
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
            templateUrl: "tpl/pbtn.html",
            controller: "findCtrl"
        })
        .state('index.lost', {
            url: "/lost",
            templateUrl: "tpl/pbtn.html",
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
        .state('index.reg', {
            url: "/reg",
            templateUrl: "tpl/reg.html",
            controller: "regCtrl"
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
        });
});