'use strict';

qianxun.controller('indexCtrl', ['$rootScope', '$scope', 'table',
    function ($rootScope, $scope, table) {
        table.all().then(function (tables) {
            console.log(tables);

            $rootScope.success = tables.data.succeed;

            $rootScope.active = {isIndexActive: true, isFindActive: false, isLostActive: false, isZoneActive: false, isAboutActive: false, isLoginActive: false, isRegActive: false};

            $scope.activeTab = 0;

            $scope.tabs = tables.data;
        });
    }
]);

qianxun.controller('pCtrl', ['$rootScope', '$scope', '$routeParams', 'p',
    function ($rootScope, $scope, $routeParams, p) {
        $rootScope.active = {isIndexActive: false, isFindActive: false, isLostActive: false, isZoneActive: false, isAboutActive: false, isLoginActive: false, isRegActive: false};

        p.get($routeParams.id).then(function (p) {
            console.log(p.data);
            $scope.p = p.data;
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