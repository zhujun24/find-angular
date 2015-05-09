'use strict';

var qianxun = angular.module('qianxun', [
    'ui.router',
    'mgcrea.ngStrap.tab',
    'ui.load'
]);

qianxun.run(function ($rootScope) {
    $rootScope.active = {
        isIndexActive: true,
        isFindActive: false,
        isLostActive: false,
        isZoneActive: false,
        isAboutActive: false,
        isLoginActive: false,
        isRegActive: false
    }
});

qianxun.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when("", "/index/index");

    $urlRouterProvider.otherwise("/index/index");

    $stateProvider
        .state("index", {
            url: "/index",
            templateUrl: "tpl/index.html"
        })
        .state("index.index", {
            url: "/index",
            templateUrl: "tpl/index.index.html",
            controller: "indexIndexCtrl"
        })
        .state("index.about", {
            url: "/about",
            templateUrl: "tpl/about.html"
        })
        .state("index.login", {
            url: "/login",
            templateUrl: "tpl/login.html",
            controller: "loginCtrl"
        })
        .state("index.reg", {
            url: "/reg",
            templateUrl: "tpl/reg.html",
            controller: "regCtrl"
        })
        .state("index.introduction", {
            url: "/introduction",
            templateUrl: "tpl/introduction.html",
            controller: "introductionCtrl"
        })
        .state("index.zone", {
            url: "/login",
            templateUrl: "tpl/zone.html",
            controller: "zoneCtrl"
        })
        .state("index.p", {
            url: "/p/{pid}",
            templateUrl: "tpl/p.html",
            controller: "pCtrl"
        });
});