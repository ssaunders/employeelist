'use strict';

function EmployeeCtrl($scope) {
    $scope.employees = [];
    $scope.btnText = 'Add';
    var updatedEmployee;

    function clearFormData() {
        $scope.name = null;
        $scope.title = null;
        $scope.age = null;
        $scope.hireDate = null;
        $scope.photoid = null;
    }

    $scope.addEmployee = function () {

        $scope.employees.push({
            name: $scope.name,
            title: $scope.title,
            age: $scope.age,
            hireDate: $scope.hireDate,
            photoid: $scope.photoid,
            visibleDetails: false
        });
        clearFormData();
        // TODO take care of API stuff and ID

    };

    $scope.removeEmployee = function (employee) {
        $scope.employees.splice($scope.employees.indexOf(employee), 1);
    };

    $scope.updateEmployeeForm = function (employee) {
        $scope.name = employee.name;
        $scope.title = employee.title;
        $scope.age = employee.age;
        $scope.hireDate = employee.hireDate;
        $scope.photoid = employee.photoid;
        updatedEmployee = employee;
        $scope.btnText = 'Update';
        $scope.submit = $scope.updateEmployee
        $rootScope.formVisible = true; // display form if hidden
    }

    $scope.updateEmployee = function () {
        updatedEmployee.name = $scope.name;
        updatedEmployee.title = $scope.title;
        updatedEmployee.age = $scope.age;
        updatedEmployee.hireDate = $scope.hireDate;
        updatedEmployee.photoid = $scope.photoid;

        clearFormData();
        $scope.btnText = 'Add';
        $scope.submit = $scope.addEmployee;
    }

    // assign submission addEmployee function by default
    $scope.submit = $scope.addEmployee;

}

var app = angular.module('EmployeeApp', []);

app.controller('EmployeeCtrl', EmployeeCtrl);
