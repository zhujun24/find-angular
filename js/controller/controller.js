'use strict';

qianxun.controller('indexIndexCtrl', ['$rootScope', '$scope', 'table',
    function ($rootScope, $scope, table) {
        table.all().then(function (tables) {
            console.log(tables.data);

            $rootScope.success = tables.data.succeed;
            $scope.activeTab = 0;

            $scope.tabs = [
                {
                    "title": "招领信息",
                    "contents": tables.data.find
                },
                {
                    "title": "失物信息",
                    "contents": tables.data.lost
                }
            ];
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