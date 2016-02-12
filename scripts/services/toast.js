'use strict';

function ToastService ($mdToast) {
    function makeToast(text, timeout) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(text)
                .position('left bottom')
                .hideDelay(timeout)
        );
    }

    return {
        makeToast:makeToast
    };
}
