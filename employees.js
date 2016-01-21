'use strict';

function EmployeeCtrl($scope) {
    $scope.employees = [];
    $scope.addEmployee = function () {
        $scope.employees.push({
            name: $scope.name,
            title: $scope.title,
            age: $scope.age,
            hireDate: $scope.hireDate,
            photoid: $scope.photoid,
            visibleDetails: false
        });
        // clear form data
        $scope.name = null;
        $scope.title = null;
        $scope.age = null;
        $scope.hireDate = null;
        $scope.photoid = null;
        // TODO take care of API stuff and ID

    };

    $scope.removeEmployee = function (employee) {
        $scope.employees.splice($scope.employees.indexOf(employee), 1);
    };

}

var app = angular.module('EmployeeApp', []);

app.controller('EmployeeCtrl', EmployeeCtrl);
