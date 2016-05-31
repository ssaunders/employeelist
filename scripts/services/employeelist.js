'use strict';

function EmployeeListService($http) {
    var self = this;

    function getEmployeeByID(id) {
        // I haven't tested if you can do this 
        //     vvvvvvvvvvvvvvvvvvv
        return self.employees.then(function(employees) {
                // a fun new array feature. check support first
                employees.find(function(e) {
                    if (e.id === id) {
                        return e;
                    }
                });
            });
    }

    function loadEmployees(success, fail) {
        return $http.get('https://devapplications.mtc.byu.edu/training/v1/api/persons/')
            .then(function (employees) {
                // Caching like this can be an issue, and should not be used if the data source can be edited in multiple places,
                // otherwise it introduces race conditions.
                // Ex. I've asked HR to edit my info. They haven't gotten back to me, so I decide to edit it myself. 
                self.employees = employees;
                success();
            }, fail); // failure does not have to be caught here. It's useful if you have logging,
                      // but unless you have to be way robust, it's ok to just let the operation fail.
    }

    // Ideally, you'd load all employees at once, meaning you'd never use this. 
    // You may have to load data related to an employee (say their work schedule), 
    // but that would be done in a separate service.
    // function loadEmployeeByID(id, success, fail) {
    //     return $http.get('https://devapplications.mtc.byu.edu/training/v1/api/persons/' + id)
    //         .then(success, fail);
    // }

    function deleteEmployee(id, success, fail) {
        return $http.delete('https://devapplications.mtc.byu.edu/training/v1/api/persons/' + id)
            .then(success, fail);
    }

    function updateEmployee(id, updatedInfo, success, fail) {
        return $http.put('https://devapplications.mtc.byu.edu/training/v1/api/persons/' + id, updatedInfo)
            .then(success, fail);
    }

    function addNew(e, success, fail) {
        return $http.post('https://devapplications.mtc.byu.edu/training/v1/api/persons/', e)
            .then(function(response) {
                    success();
                    return loadEmployees();
                    // I've found it best to let the server/database dictate the state of the data, 
                    // even on the front end. So rather than inserting into a data structure we have, 
                    // just load everything new.
                },
                function() {
                    fail();
                });
    }

    return {
        get employees() {
            // It can be annoying to have to .then every time you access data, but it makes for a consistent interface
            return (self.employees ? Promise.resolve(self.employees) : loadEmployees());
        },
        getEmployeeByID: getEmployeeByID,
        // loadEmployees: loadEmployees, // when data loads should never be determined by anyone except the programmer.
        // loadEmployeeByID: loadEmployeeByID,
        deleteEmployee: deleteEmployee,
        updateEmployee: updateEmployee,
        addNew: addNew
    };
}