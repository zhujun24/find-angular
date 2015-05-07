/**
 * Created by shijunwei on 2015/1/6.
 */
angular.module('shiyanshi', [
    'ngRoute',
    'controllers',
    'directives',
    'services',
    'angularFileUpload'
])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        //定义路由
        /*$locationProvider.html5Mode(true);*/
        $routeProvider
            .when('/', {
                templateUrl: 'views/shouye.html'
            })
            .when('/renyuan', {
                templateUrl: 'views/renyuan.html',
                controller: 'renyuanCtrl'
            })
            .when('/guizhang', {
                templateUrl: 'views/guizhang.html',
                controller: 'guizhangCtrl'
            })
            .when('/fenbutu', {
                templateUrl: 'views/fenbutu.html',
                controller: 'fenbutuCtrl'
            })
            .when('/gongneng', {
                templateUrl: 'views/gongneng.html',
                controller: 'gongnengCtrl'
            })
            .when('/yiqishebei', {
                templateUrl: 'views/yiqishebei.html',
                controller: 'yiqishebeiCtrl'
            })
            .when('/yuyue', {
                templateUrl: 'views/yuyue.html',
                controller: 'yuyueCtrl'
            })
            .when('/houtai', {
                templateUrl: 'views/houtai.html',
                controller: 'houtaiCtrl'
            })
            .when('/lianxiwomen', {
                templateUrl: 'views/lianxiwomen.html'
            })
            .when('/zhuce', {
                templateUrl: 'views/zhuce.html',
                controller: 'zhuceCtrl'
            })
            .when('/guizhang/:guizhangId', {
                templateUrl: 'views/component/guizhang.tpl.html',
                controller: ['$scope', '$routeParams', function ($scope, $routeParams) {
                    var vm = $scope.vm = {};
                    vm.guizhangId = $routeParams.guizhangId;
                }]
            })
            .when('/equipmentdetail/:equipmentId', {
                templateUrl: 'views/component/equipmentdetail.html',
                controller: 'equipmentCtrl'
            })
            .when('/order/:equipmentId', {
                templateUrl: 'views/component/order.tpl.html',
                controller: 'orderCtrl'
            })
            .when('/news_detail/:newId', {
                templateUrl: 'views/component/newsDetail.html',
                controller: 'newsDetaileCtrl'
            })
            .when('/myOrders', {
                templateUrl: 'views/myOrders.html',
                controller: 'myOrdersCtrl'
            })
            .when('/changeUserInfo', {
                templateUrl: 'views/changeUserInfo.html',
                controller: 'changeUserInfoCtrl'
            })
            .when('/changePswd', {
                templateUrl: 'views/changePswd.html',
                controller: 'changePswdCtrl'
            })
            //admin
            .when('/orderManage', {
                templateUrl: 'views/admin/ordermanage.html',
                controller: 'orderManageCtrl'
            })
            .when('/equipmentManage', {
                templateUrl: 'views/admin/equipmentmanage.html',
                controller: 'equipmentManageCtrl'
            })
            .when('/laboratoryManage', {
                templateUrl: 'views/admin/laboratoryManage.html',
                controller: 'laboratoryManageCtrl'
            })
            .when('/teachersManage', {
                templateUrl: 'views/admin/teachersManage.html',
                controller: 'teacherManageCtrl'
            })
            .when('/NewsManage', {
                templateUrl: 'views/admin/newsManage.html',
                controller: 'newsManageCtrl'
            })
            .when('/mapManage', {
                templateUrl: 'views/admin/mapManage.html',
                controller: 'mapManageCtrl'
            })
            .when('/labAssistantManage', {
                templateUrl: 'views/admin/labAssistantManage.html',
                controller: 'labAssistantManageCtrl'
            })
            .when('/outsideUserManage', {
                templateUrl: 'views/admin/outsideUserManage.html',
                controller: 'outsideUserManageCtrl'
            })
            .when('/ordersManage', {
                templateUrl: 'views/admin/ordersManage.html',
                controller: 'ordersManageCtrl'
            })


        ;
        $httpProvider.defaults.headers.post = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'};
        //添加拦截器
        /*$httpProvider.interceptors.push('pathInterceptor');*/
    }])
;