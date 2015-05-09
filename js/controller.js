'use strict';

qianxun.controller('indexCtrl', ['$rootScope', '$scope', 'table',
    function ($rootScope, $scope, table) {
        table.all().then(function (tables) {
            console.log(tables.data);

            $rootScope.success = tables.data.succeed;

            $rootScope.active = {
                isIndexActive: true,
                isFindActive: false,
                isLostActive: false,
                isZoneActive: false,
                isAboutActive: false,
                isLoginActive: false,
                isRegActive: false
            };

            $scope.activeTab = 0;

            $scope.tabs = tables.data;
        });
    }
]);

qianxun.controller('zoneCtrl', ['$scope',
    function ($scope) {
        $scope.hehe = "hello";
    }
]);

qianxun.controller('regCtrl', ['$scope',
    function ($scope) {
        $scope.hehe = "hello";
    }
]);

qianxun.controller('loginCtrl', ['$scope',
    function ($scope) {
        $scope.hehe = "hello";
    }
]);

qianxun.controller('introductionCtrl', ['$scope',
    function ($scope) {
        $scope.hehe = "hello";
    }
]);

qianxun.controller('aboutCtrl', ['$scope',
    function ($scope) {
        $scope.hehe = "hello";
    }
]);

qianxun.controller('introductionCtrl', ['$scope',
    function ($scope) {
        $scope.hehe = "hello";
    }
]);

qianxun.controller('pCtrl', ['$scope',
    function ($scope) {
        $scope.hehe = "hello";
    }
]);

qianxun.controller('galleryCtrl', ['$scope',
    function ($scope) {
        $scope.hehe = "hello";
    }
]);

qianxun.controller('navCtrl', ['$scope',
    function ($scope) {
        $scope.hehe = "hello";
    }
]);

qianxun.controller('pCtrl', ['$rootScope', '$scope', '$routeParams',
    function ($rootScope, $scope, $routeParams) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };

        console.log($routeParams.pid);

        //p.get($routeParams.pid).then(function (tables) {
        //    console.log(tables.data);
        //});
    }
]);