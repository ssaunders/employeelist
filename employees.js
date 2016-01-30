'use strict';

function MainCtrl ($scope, $http, $stateParams, $rootScope) {
    $rootScope.edit = false;
    $scope.btnText = 'Add';
}

function NewCtrl (EmployeeList, $scope, $rootScope, $location) {
    $rootScope.edit = true;
    $scope.btnText = 'Add';

    $scope.addEmployee = function (e) {
        var newEmployee = {
            name: $scope.form.name,
            photoId: $scope.form.photoId,
            age: $scope.form.age,
            hireDate: $scope.form.hireDate,
            title: $scope.form.title
        };
        EmployeeList.addNew(newEmployee);
        $location.path('/');
    };
    $scope.submit = $scope.addEmployee;
}

function UpdateCtrl (EmployeeList, $scope, $rootScope, $http, $stateParams, $location, $interval) {
    $rootScope.edit = true;
    $scope.btnText = 'Update';
    $interval(function () {
      var employee = EmployeeList.getEmployeeByID($stateParams.employeeId);
      $scope.form = {};
      $scope.form.name = employee.name;
      $scope.form.title = employee.title;
      $scope.form.age = employee.age;
      $scope.form.hireDate = new Date(employee.hireDate);
      $scope.form.photoId = employee.photoId;
    }, 50, 8);

    $scope.updateEmployee = function () {
        var employee = EmployeeList.getEmployeeByID($stateParams.employeeId);
        var updatedInfo = {
            name: $scope.form.name,
            photoId: $scope.form.photoId,
            age: $scope.form.age,
            hireDate: $scope.form.hireDate,
            title: $scope.form.title
        };
        console.log(updatedInfo);
        $http.put('https://devapplications.mtc.byu.edu/training/v1/api/persons/' + employee.id, updatedInfo).then(function (response) {
            alert('Employee updated!');
            employee.name = $scope.form.name;
            employee.photoId = $scope.form.photoId;
            employee.age = $scope.form.age;
            employee.hireDate = $scope.form.hireDate;
            employee.title = $scope.form.title;
            $scope.btnText = 'Add';
            $location.path('/');
        },
        function (response) {
            alert('Update failed ' + ' ' + response.status + ' ' + response.statusText);
        });
    };

    $scope.submit = $scope.updateEmployee;
}

function ListCtrl (EmployeeList, $interval, $scope, $http) {
    $interval(function () {$scope.employees = EmployeeList.getEmployees()}, 250, 6); // load initial employees

    $scope.removeEmployee = function (employee) {
        $http.delete('https://devapplications.mtc.byu.edu/training/v1/api/persons/' + employee.id).then(function () {
            $scope.employees.splice($scope.employees.indexOf(employee), 1);
        },
        function (response) {
            alert('Employee could not be deleted. ' + response.status + ' ' + response.statusText);
        });
    };
}

function EmployeeListService ($http) {
    var self = this;
    $http.get('https://devapplications.mtc.byu.edu/training/v1/api/persons/').then(function (response) {
        self.employees = response.data;
    });

    function getEmployeeByID (id) {
        for (var e of self.employees) {
            if (e.id === id) {
                return e;
            }
        }
        return null;
    }

    function getEmployees () {
        return self.employees;
    }

    function addNew(e) {
        $http.post('https://devapplications.mtc.byu.edu/training/v1/api/persons/', e).then(function (response) {
            self.employees.push(response.data);
        });
    }

    return {
        getEmployeeByID:getEmployeeByID,
        getEmployees:getEmployees,
        addNew:addNew
    };
}

var app = angular.module('EmployeeApp', ['ui.router']);
app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('new', {
            url: '/new',
            templateUrl: 'partials/edit.html',
            controller: NewCtrl
        })
        .state('update', {
            url: '/update/:employeeId',
            templateUrl: 'partials/edit.html',
            controller: UpdateCtrl
        })
        .state('home', {
            url: '/',
            templateUrl: null,
            controller: MainCtrl
        });
});

app.service('EmployeeList', ['$http', EmployeeListService])
.controller('ListCtrl', ['EmployeeList', '$interval', '$scope', '$http', ListCtrl])
.controller('MainCtrl', MainCtrl)
.controller('NewCtrl', ['EmployeeList', '$scope', '$rootScope', '$location', NewCtrl])
.controller('UpdateCtrl', ['EmployeeList', '$scope', '$rootScope', '$http', '$stateParams', '$location', '$interval', UpdateCtrl]);
