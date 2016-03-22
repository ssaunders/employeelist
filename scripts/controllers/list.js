'use strict';

function ListCtrl (EmployeeList, $scope, $interval, $timeout) {
    $scope.loadingError = false;
    EmployeeList.loadEmployees().then(function (missionaries) {
        $scope.missionaries = missionaries;
    });
    $scope.removeEmployee = function (employee) {
        EmployeeList.deleteEmployee(employee.id, function () {
            $scope.employees.splice($scope.employees.indexOf(employee), 1);
        },
        function (response) {
            alert('Employee could not be deleted. ' + response.status + ' ' + response.statusText);
        });
    };
}
