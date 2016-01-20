'use strict';

function EmployeeCtrl($scope) {
    $scope.employees = [];
    $scope.addEmployee = function () {
        $scope.employees.push({
            name: $scope.name,
            title: $scope.title,
            age: $scope.age,
            hireDate: $scope.hireDate,
            photoid: $scope.photoid
        });
        // TODO take care of API stuff and ID
    };

    $scope.removeEmployee = function () {
        // TODO remove employee from scope.employees
    };

    $scope.showDetails = function () {
        // TODO display details for particular employee
    };
}

var app = angular.module('EmployeeApp', []);

app.controller('EmployeeCtrl', EmployeeCtrl);
