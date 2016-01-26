'use strict';

function EmployeeCtrl($scope, $http) {
    $scope.employees = [];
    $http.get('https://devapplications.mtc.byu.edu/training/v1/api/persons/').then(function (response) {
        $scope.employees = response.data;
    });
    $scope.btnText = 'Add';
    var updatedEmployee;

    function clearFormData() {
        $scope.name = null;
        $scope.title = null;
        $scope.age = null;
        $scope.hireDate = null;
        $scope.photoId = null;
    }

    $scope.addEmployee = function () {

        var newEmployee = {
            name: $scope.name,
            photoid: $scope.photoId,
            age: $scope.age,
            hireDate: $scope.hireDate,
            title: $scope.title
        };
        $http.post('https://devapplications.mtc.byu.edu/training/v1/api/persons/', newEmployee).then(function (response) {
            alert('Employee added!');
            $scope.employees.push(response.data);
        },
        function (response) {
            alert('Employee could not be added. ' + response.status + ' ' + response.statusText);
        });
        clearFormData();
        // TODO take care of API stuff and ID

    };

    $scope.removeEmployee = function (employee) {
        $http.delete('https://devapplications.mtc.byu.edu/training/v1/api/persons/' + employee.id).then(function () {
            $scope.employees.splice($scope.employees.indexOf(employee), 1);
        },
        function (response) {
            alert('Employee could not be deleted. ' + response.status + ' ' + response.statusText);
        });
    };

    $scope.updateEmployeeForm = function (employee) {
        $scope.name = employee.name;
        $scope.title = employee.title;
        $scope.age = employee.age;
        $scope.hireDate = new Date(employee.hireDate);
        $scope.photoid = employee.photoid;
        updatedEmployee = employee;
        $scope.btnText = 'Update';
        $scope.submit = $scope.updateEmployee;
        $scope.$parent.formVisible = true; // display form if hidden
    };

    $scope.updateEmployee = function () {
        var updatedInfo = {
            name: $scope.name,
            photoId: $scope.photoId,
            age: $scope.age,
            hireDate: $scope.hireDate,
            title: $scope.title
        };

        $http.put('https://devapplications.mtc.byu.edu/training/v1/api/persons/' + updatedEmployee.id, updatedInfo).then(function (response) {
            alert('Employee updated!');
            updatedEmployee.name = $scope.name;
            updatedEmployee.photoId = $scope.photoId;
            updatedEmployee.age = $scope.age;
            updatedEmployee.hireDate = $scope.hireDate;
            updatedEmployee.title = $scope.title;
            clearFormData();
            $scope.btnText = 'Add';
            $scope.submit = $scope.addEmployee;
        },
        function (response) {
            alert('Update failed ' + ' ' + response.status + ' ' + response.statusText);
        });
    };

    // assign submission addEmployee function by default
    $scope.submit = $scope.addEmployee;

}

var app = angular.module('EmployeeApp', ['ui.router']);
app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('new', {
            url: '/new',
            templateUrl: 'partials/edit.html'
        })
        .state('update', {
            url: '/update',
            templateUrl: 'partials/edit.html'
        })
        .state('home', {
            url: '/',
            templateUrl: null
        });
});

app.controller('EmployeeCtrl', EmployeeCtrl);
