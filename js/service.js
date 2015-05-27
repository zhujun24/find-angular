'use strict';

var rootUrl = "api/v1/";

qianxun.factory('index', ['$http', function ($http) {
    var factory = {};

    factory.all = function () {
        var index = $http.get(rootUrl + "index").then(function (resp) {
            return resp.data;
        });

        return index;
    };

    return factory;
}]);

qianxun.factory('p', ['$http', function ($http) {
    var factory = {};

    factory.get = function (pid) {
        var p = $http.get(rootUrl + 'p/' + pid).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    factory.comment = function (comment) {
        var p = $http.post(rootUrl + 'p/comment', comment).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);

qianxun.factory('login', ['$http', function ($http) {
    var factory = {};

    factory.login = function (user) {
        var p = $http.post(rootUrl + 'user/login', user).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);

qianxun.factory('reg', ['$http', function ($http) {
    var factory = {};

    factory.reg = function (user) {
        var p = $http.post(rootUrl + 'user/reg', user).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);

qianxun.factory('logout', ['$http', function ($http) {
    var factory = {};

    factory.logout = function () {
        var p = $http.post(rootUrl + 'user/logout').then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);

qianxun.factory('zone', ['$http', function ($http) {
    var factory = {};

    factory.getZone = function (uid) {
        var p = $http.get(rootUrl + 'user/zone/' + uid).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    factory.succeed = function (pid) {
        var p = $http.put(rootUrl + 'p/' + pid + '/succeed').then(function (resp) {
            return resp.data;
        });
        return p;
    };

    factory.deleteComment = function (cid) {
        var p = $http.put(rootUrl + 'comment/delete/' + cid).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    factory.deleteP = function(pid){
        var p = $http.put(rootUrl + 'p/delete/' + pid).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);

qianxun.factory('modify', ['$http', function ($http) {
    var factory = {};

    factory.modify = function (uid, user) {
        var p = $http.put(rootUrl + 'user/modify/' + uid, user).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);

qianxun.factory('publish', ['$http', function ($http) {
    var factory = {};

    factory.publishInfo = function (good) {
        var p = $http.post(rootUrl + 'p', good).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);

qianxun.factory('fall', ['$http', function ($http) {
    var factory = {};

    factory.fallInfo = function (data) {
        var p = $http.post(rootUrl + 'fall', data).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);

qianxun.factory('reset', ['$http', function ($http) {
    var factory = {};

    factory.reset = function (user) {
        var p = $http.put(rootUrl + 'reset', user).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);

qianxun.service('fileUpload', ['$http', function ($http) {
    var factory = {};

    factory.uploadFile = function (file, photoType) {
        var fd = new FormData();
        var uploadUrl = rootUrl + "photo";
        fd.append('file', file);

        var p = $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function (resp) {
            localStorage.setItem("photoType", photoType);
            return resp.data;
        });
        return p;
    };

    return factory;
}]);

qianxun.service('searchService', ['$http', function ($http) {
    var factory = {};

    factory.search = function (data) {

        var p = $http.post(rootUrl + "search", data).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);