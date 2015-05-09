'use strict';

var rootUrl = "api/v1/";

qianxun.factory('table', ['$http', function ($http) {
    var factory = {};

    factory.all = function () {
        var table = $http.get(rootUrl + "table").then(function (resp) {
            return resp.data;
        });
        return table;
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
        var p = $http.get(rootUrl + '/p/' + pid).then(function (resp) {
            return resp.data;
        });
        return p;
    };

    return factory;
}]);