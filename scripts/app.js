'use strict';

angular.module('EmployeeApp', ['ui.router', 'ngMaterial', 'ngMessages'])
.config(function ($stateProvider, $mdIconProvider, $urlRouterProvider) {

    $mdIconProvider.icon("menu", "./img/icon/ic_menu_black_24px.svg", 24);

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
        });
})
.service('EmployeeList', ['$http', EmployeeListService])
.service('Toast', ['$mdToast', ToastService])
.controller('MainCtrl', ['$scope', '$mdSidenav', MainCtrl])
.controller('ListCtrl', ['EmployeeList', '$scope', '$interval', '$timeout', ListCtrl])
.controller('NewCtrl', ['EmployeeList', '$scope', '$location', '$mdSidenav', 'Toast', NewCtrl])
.controller('UpdateCtrl', ['EmployeeList', '$scope', '$stateParams', '$location', '$mdSidenav', 'Toast', UpdateCtrl]);
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
