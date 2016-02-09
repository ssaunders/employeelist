'use strict';

function ListCtrl (EmployeeList, $scope, $interval, $timeout) {
    $scope.loadingError = false;
    $interval(function () { $scope.employees = EmployeeList.employees; }, 250, 6);
    $timeout(function () {
        if (!$scope.employees) {
            $scope.loadingError = true;
        }
    },
    1800);
    $scope.removeEmployee = function (employee) {
        EmployeeList.deleteEmployee(employee.id, function () {
            $scope.employees.splice($scope.employees.indexOf(employee), 1);
        },
        function (response) {
            alert('Employee could not be deleted. ' + response.status + ' ' + response.statusText);
        });
    };
}
