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

    factory.get = function (id) {
        var book = $http.get(rootUrl + '/' + id).then(function (resp) {
            return resp.data;
        });
        return book;
    };

    factory.add = function (book) {
        $http.post(rootUrl, book).then(function (resp) {
            return resp;
        });
    };

    factory.update = function (book) {
        $http.put(rootUrl + '/' + book.id, book).then(function (resp) {
            return resp;
        });
    };

    factory.delete = function (id) {
        $http.delete(rootUrl + '/' + id).then(function (resp) {
            return resp;
        });
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
        var p = $http.post(rootUrl + 'comment', comment).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);

qianxun.factory('login', ['$http', function ($http) {
    var factory = {};

    factory.login = function (user) {
        var p = $http.post(rootUrl + 'login', user).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);

qianxun.factory('logout', ['$http', function ($http) {
    var factory = {};

    factory.logout = function () {
        var p = $http.post(rootUrl + 'logout').then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);