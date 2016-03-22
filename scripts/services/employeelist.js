'use strict';

function EmployeeListService ($http) {
    var self = this;
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

    function loadEmployees () {
        return $http.get('https://devapplications.mtc.byu.edu/training/v1/api/persons/');
    }

    function loadEmployeeByID (id, success, fail) {
        $http.get('https://devapplications.mtc.byu.edu/training/v1/api/persons/' + id).then(success, fail);
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
        get employees () {
            return self.employees;
        },
        getEmployeeByID:getEmployeeByID,
        getEmployees:getEmployees,
        loadEmployees:loadEmployees,
        loadEmployeeByID:loadEmployeeByID,
        deleteEmployee:deleteEmployee,
        updateEmployee:updateEmployee,
        addNew:addNew
    };
}
