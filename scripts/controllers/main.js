function MainCtrl($scope, $mdSidenav) {
    $scope.toggleBar = function() {
        $mdSidenav('left').toggle();
    };
}
