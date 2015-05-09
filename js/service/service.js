'use strict';

qianxun.factory('table', ['$http', function ($http) {
    var url = "api/";
    var factory = {};

    factory.all = function () {
        var table = $http.get(url + "table").then(function (resp) {
            return resp.data;
        });
        return table;
    };

    factory.get = function (id) {
        var book = $http.get(url + '/' + id).then(function (resp) {
            return resp.data;
        });
        return book;
    };

    factory.add = function(book) {
        $http.post(url, book).then(function(resp){
            return resp;
        });
    };

    factory.update = function(book) {
        $http.put(url + '/' + book.id, book).then(function(resp){
            return resp;
        });
    };

    factory.delete = function(id) {
        $http.delete(url + '/' + id).then(function(resp){
            return resp;
        });
    };

    return factory;
}]);