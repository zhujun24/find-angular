'use strict';

qianxun.controller('indexCtrl', ['$rootScope', '$scope', 'table',
    function ($rootScope, $scope, table) {
        $rootScope.active = {
            isIndexActive: true,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };

        table.all().then(function (tables) {
            console.log(tables);

            $rootScope.success = tables.data.succeed;

            $scope.activeTab = 0;

            $scope.tabs = tables.data;
        });
    }
]);

qianxun.controller('loginCtrl', ['$rootScope', '$scope',
    function ($rootScope, $scope) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: true,
            isRegActive: false
        };

        //$rootScope.active = {isIndexActive: false, isFindActive: false, isLostActive: false, isZoneActive: false, isAboutActive: false, isLoginActive: true, isRegActive: false};

        //p.get($routeParams.id).then(function (p) {
        //    console.log(p.data);
        $scope.p = 111;
        //});
    }
]);

qianxun.controller('pCtrl', ['$rootScope', '$scope', '$routeParams', 'p',
    function ($rootScope, $scope, $routeParams, p) {
        $rootScope.active = {
            isIndexActive: false,
            isFindActive: false,
            isLostActive: false,
            isZoneActive: false,
            isAboutActive: false,
            isLoginActive: false,
            isRegActive: false
        };

        p.get($routeParams.id).then(function (p) {
            console.log(p.data);
            $scope.p = p.data;
        });
    }
]);