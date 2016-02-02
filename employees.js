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

function UpdateCtrl (EmployeeList, $scope, $rootScope, $http, $stateParams, $location) {
    $rootScope.edit = true;
    $scope.btnText = 'Update';
    $scope.form = {};
    var employee = EmployeeList.loadEmployeeByID($stateParams.employeeId, function (response) {
        $scope.form.name = response.data.name;
        $scope.form.title = response.data.title;
        $scope.form.age = response.data.age;
        $scope.form.hireDate = new Date(response.data.hireDate);
        $scope.form.photoId = response.data.photoId;
    },
    function () {});

    $scope.updateEmployee = function () {
        var employee = EmployeeList.loadEmployeeByID($stateParams.employeeId);
        var localEmployee = EmployeeList.getEmployeeByID($stateParams.employeeId);
        var updatedInfo = {
            name: $scope.form.name,
            photoId: $scope.form.photoId,
            age: $scope.form.age,
            hireDate: $scope.form.hireDate,
            title: $scope.form.title
        };
        EmployeeList.updateEmployee($stateParams.employeeId, updatedInfo, function (response) {
            alert('Employee updated!');
            localEmployee.name = response.data.name;
            localEmployee.photoId = response.data.photoId;
            localEmployee.age = response.data.age;
            localEmployee.hireDate = response.data.hireDate;
            localEmployee.title = response.data.title;
            $scope.btnText = 'Add';
            $location.path('/');
            EmployeeList.refreshList();
        },
        function (response) {
            alert('Update failed ' + ' ' + response.status + ' ' + response.statusText);
        });
    };

    $scope.submit = $scope.updateEmployee;
}

function ListCtrl (EmployeeList, $scope, $http) {
    EmployeeList.loadEmployees(function (response) {$scope.employees = response.data}, function() {alert("Employees couldn't be loaded.")}); // load initial employees

    $scope.removeEmployee = function (employee) {
        EmployeeList.deleteEmployee(employee.id, function () {
            $scope.employees.splice($scope.employees.indexOf(employee), 1);
        },
        function (response) {
            alert('Employee could not be deleted. ' + response.status + ' ' + response.statusText);
        });
    };
}

function EmployeeListService ($http) {
    var self = this;
    loadEmployees(function (response) {self.employees = response.data;}, {});

    function getEmployeeByID(id) {
        for (var e of self.employees) {
            if (e.id === id) {
                return e;
            }
        }
        return null;
    }

    function loadEmployees (success, fail) {
        $http.get("https://devapplications.mtc.byu.edu/training/v1/api/persons/").then(success, fail);
    }

    function refreshList () {
        loadEmployees(function (response) {self.employees = response.data;}, {});
    }

    function loadEmployeeByID (id, success, fail) {
        $http.get("https://devapplications.mtc.byu.edu/training/v1/api/persons/" + id).then(success, fail);
    }

    function deleteEmployee (id, success, fail) {
        $http.delete('https://devapplications.mtc.byu.edu/training/v1/api/persons/' + id).then(success, fail);
    }

    function updateEmployee (id, updatedInfo, success, fail) {
        $http.put('https://devapplications.mtc.byu.edu/training/v1/api/persons/' + id, updatedInfo).then(success, fail);
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
        loadEmployeeByID:loadEmployeeByID,
        updateEmployee:updateEmployee,
        getEmployees:getEmployees,
        loadEmployees:loadEmployees,
        deleteEmployee:deleteEmployee,
        addNew:addNew,
        refreshList:refreshList
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
.controller('ListCtrl', ['EmployeeList', '$scope', '$http', ListCtrl])
.controller('MainCtrl', MainCtrl)
.controller('NewCtrl', ['EmployeeList', '$scope', '$rootScope', '$location', NewCtrl])
.controller('UpdateCtrl', ['EmployeeList', '$scope', '$rootScope', '$http', '$stateParams', '$location', UpdateCtrl]);
