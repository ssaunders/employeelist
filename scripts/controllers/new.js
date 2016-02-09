'use strict';

function NewCtrl (EmployeeList, $scope, $location, Toast) {
    $scope.resetForm = function (form) {
        form.$setPristine(); // clear form data
        form.$setUntouched();
        $scope.form.hireDate = new Date();
    };

    $scope.addEmployee = function (form) {
        var newEmployee = {
            name: $scope.form.name,
            photoId: $scope.form.photoId,
            age: $scope.form.age,
            hireDate: $scope.form.hireDate,
            title: $scope.form.title
        };
        console.log(newEmployee);
        EmployeeList.addNew(newEmployee, function () {
            Toast.makeToast('Employee Added!', 1500);
        },
        function () {
            Toast.makeToast('Employee couldn\'t be added.', 1500);
        });
        $scope.form = {};
        $scope.resetForm(form);
    };
    $scope.submit = $scope.addEmployee;
    $scope.form = {};
    $scope.form.hireDate = new Date();
}
