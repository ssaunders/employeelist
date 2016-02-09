'use strict';

function UpdateCtrl (EmployeeList, $scope, $stateParams, $location, $mdSidenav, Toast) {
    $scope.cancel = function () {
        $location.path('/');
    };

    $mdSidenav('left').open(); // keep the sidenav open when editing

    $scope.form = {};

    EmployeeList.loadEmployeeByID($stateParams.employeeId, function (response) {
        $scope.form.name = response.data.name;
        $scope.form.title = response.data.title;
        $scope.form.age = response.data.age;
        $scope.form.hireDate = new Date(response.data.hireDate);
        $scope.form.photoId = response.data.photoId;
    },
    function () {});
    $scope.updateEmployee = function () {
        var updatedInfo = {
            name: $scope.form.name,
            photoId: $scope.form.photoId,
            age: $scope.form.age,
            hireDate: $scope.form.hireDate,
            title: $scope.form.title
        };
        var localEmployee = EmployeeList.getEmployeeByID($stateParams.employeeId);
        EmployeeList.updateEmployee($stateParams.employeeId, updatedInfo, function (response) {
            Toast.makeToast('Update Successful!', 1500);
            localEmployee.name = response.data.name;
            localEmployee.photoId = response.data.photoId;
            localEmployee.age = response.data.age;
            localEmployee.hireDate = response.data.hireDate;
            localEmployee.title = response.data.title;
            $location.path('/');
        },
        function (response) {
            Toast.makeToast('Update failed ' + ' ' + response.status + ' ' + response.statusText, 4000);
        });
    };

    $scope.submit = $scope.updateEmployee;
}
