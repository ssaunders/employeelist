'use strict';

function NewCtrl (EmployeeList, $scope, $location, Toast) {
    $scope.btnText = 'Add Employee';

    $scope.addEmployee = function () {
        var newEmployee = {
            name: $scope.form.name,
            photoId: $scope.form.photoId,
            age: $scope.form.age,
            hireDate: $scope.form.hireDate,
            title: $scope.form.title
        };
        EmployeeList.addNew(newEmployee, function (response) {
            //update list
            Toast.makeToast('Employee Added!', 1500);
        },
        function () {
            Toast.makeToast('Employee couldn\'t be added.', 1500);
        });
        $scope.form = {}; // clear form data
    };
    $scope.submit = $scope.addEmployee;
}

function UpdateCtrl (EmployeeList, $scope, $stateParams, $location, Toast) {
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
            Toast.makeToast('Update Successful!', 1500);
            localEmployee.name = response.data.name;
            localEmployee.photoId = response.data.photoId;
            localEmployee.age = response.data.age;
            localEmployee.hireDate = response.data.hireDate;
            localEmployee.title = response.data.title;
            $scope.btnText = 'Add';
            $location.path('/');
        },
        function (response) {
            Toast.makeToast('Update failed ' + ' ' + response.status + ' ' + response.statusText, 4000);
        });
    };

    $scope.submit = $scope.updateEmployee;
}

function ListCtrl (EmployeeList, $scope) {
    EmployeeList.loadEmployees(function (response) { $scope.employees = response.data; }, function () { alert("Employee couldn't be added"); }); // load initial employees

    $scope.removeEmployee = function (employee) {
        EmployeeList.deleteEmployee(employee.id, function () {
            $scope.employees.splice($scope.employees.indexOf(employee), 1);
        },
        function (response) {
            alert('Employee could not be deleted. ' + response.status + ' ' + response.statusText);
        });
    };
}

function ToastService ($mdToast, $document) {
    function makeToast(text, timeout) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(text)
                .position('top right')
                .hideDelay(timeout)
        );
    }

    return {
        makeToast:makeToast
    }
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

    function loadEmployees (success, fail) {
        $http.get('https://devapplications.mtc.byu.edu/training/v1/api/persons/').then(success);
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

    function addNew(e, success, fail) {
        $http.post('https://devapplications.mtc.byu.edu/training/v1/api/persons/', e).then(function (response) {
            self.employees.push(response.data);
            success();
        },
        function () {
            fail();
        });
    }

    return {
        getEmployeeByID:getEmployeeByID,
        getEmployees:getEmployees,
        loadEmployees:loadEmployees,
        loadEmployeeByID:loadEmployeeByID,
        deleteEmployee:deleteEmployee,
        updateEmployee:updateEmployee,
        addNew:addNew
    };
}

var app = angular.module('EmployeeApp', ['ui.router', 'ngMaterial']);
app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'partials/add.html',
            controller: NewCtrl
        })
        .state('update', {
            url: '/update/:employeeId',
            templateUrl: 'partials/edit.html',
            controller: UpdateCtrl
        })
});

app.service('EmployeeList', ['$http', EmployeeListService])
.service('Toast', ['$mdToast', '$document', ToastService])
.controller('ListCtrl', ['EmployeeList', '$scope', ListCtrl])
.controller('NewCtrl', ['EmployeeList', '$scope', '$location', 'Toast', NewCtrl])
.controller('UpdateCtrl', ['EmployeeList', '$scope', '$stateParams', '$location', 'Toast', UpdateCtrl]);
// .directive('slideable', function () {
//     return {
//         restrict:'C',
//         compile: function (element, attr) {
//             // wrap tag
//             var contents = element.html();
//             element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');
//
//             return function postLink(scope, element, attrs) {
//                 // default properties
//                 attrs.duration = (!attrs.duration) ? '0.5s' : attrs.duration;
//                 attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
//                 element.css({
//                     'overflow': 'hidden',
//                     'height': '0px',
//                     'transitionProperty': 'height',
//                     'transitionDuration': attrs.duration,
//                     'transitionTimingFunction': attrs.easing
//                     });
//                 };
//             }
//         };
//     })
//     .directive('slideToggle', function() {
//         return {
//             restrict: 'A',
//             link: function(scope, element, attrs) {
//                 var target = document.querySelector(attrs.slideToggle);
//                 attrs.expanded = false;
//                 element.bind('click', function() {
//                     var content = target.querySelector('.slideable_content');
//                     if(!attrs.expanded) {
//                         content.style.border = '1px solid rgba(0,0,0,0)';
//                         var y = content.clientHeight;
//                         content.style.border = 0;
//                         target.style.height = y + 'px';
//                     } else {
//                         target.style.height = '0px';
//                     }
//                     attrs.expanded = !attrs.expanded;
//                 });
//             }
//         }
//     });
