'use strict';

function EmployeeCtrl($scope, $http, $stateParams, $rootScope) {
    $scope.employees = [];
    $http.get('https://devapplications.mtc.byu.edu/training/v1/api/persons/').then(function (response) {
        $scope.employees = response.data;
        if ($stateParams.employeeId) {
            $scope.updateEmployeeForm();
        }
        $rootScope.$on('$stateChangeSuccess',
        function () {
            if ($stateParams.employeeId) {
                $scope.updateEmployeeForm();
            }
        });
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

    function getEmployeeByID(id) {
        for (var e of $scope.employees) {
            if (e.id === id) {
                return e;
            }
        }
        return null;
    }

    $scope.addEmployee = function () {

        var newEmployee = {
            name: $scope.name,
            photoId: $scope.photoId,
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

    $scope.updateEmployeeForm = function () {
        var employee = getEmployeeByID($stateParams.employeeId);
        $scope.name = employee.name;
        $scope.title = employee.title;
        $scope.age = employee.age;
        $scope.hireDate = new Date(employee.hireDate);
        $scope.photoId = employee.photoId;
        $scope.btnText = 'Update';
        $scope.submit = $scope.updateEmployee;
        $scope.$parent.formVisible = true; // display form if hidden
    };

    $scope.updateEmployee = function () {
        var employee = getEmployeeByID($stateParams.employeeId);
        var updatedInfo = {
            name: $scope.name,
            photoId: $scope.photoId,
            age: $scope.age,
            hireDate: $scope.hireDate,
            title: $scope.title
        };
        console.log(updatedInfo);
        $http.put('https://devapplications.mtc.byu.edu/training/v1/api/persons/' + employee.id, updatedInfo).then(function (response) {
            alert('Employee updated!');
            employee.name = $scope.name;
            employee.photoId = $scope.photoId;
            employee.age = $scope.age;
            employee.hireDate = $scope.hireDate;
            employee.title = $scope.title;
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
            templateUrl: 'partials/edit.html',
        })
        .state('update', {
            url: '/update/:employeeId',
            templateUrl: 'partials/edit.html'
        })
        .state('home', {
            url: '/',
            templateUrl: null
        });
});

app.controller('EmployeeCtrl', EmployeeCtrl);
