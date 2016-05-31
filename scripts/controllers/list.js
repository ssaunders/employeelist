'use strict';

function ListCtrl (EmployeeList, $scope, $interval, $timeout) {
    $scope.loadingError = false;
    EmployeeList.employees.then(function (employees) {
        $scope.employees = employees; //since Angular listens & updates to changes on a variable, the directive just works.
    }, function (e) {
        $scope.loadingError = true;
        console.error(e);
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
