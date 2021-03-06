(function() {
  'use strict';

  angular.module('foundation.iconic', [])
    .service('Iconic', iconic)
    .directive('zfIconic', zfIconic)
  ;

  //iconic wrapper
  function iconic() {
    var iconicObject = IconicJS();

    var service = {};

    service.getAccess = getAccess;

    return service;

    function getAccess() {
      return iconicObject;
    }
  }

  zfIconic.$inject = ['Iconic', 'FoundationApi']

  function zfIconic(iconic, foundationApi) {
    var directive = {
      restrict: 'A',
      template: '<img ng-transclude>',
      transclude: true,
      replace: true,
      scope: {
        dynSrc: '=?',
        size: '@?',
        icon: '@'
      },
      compile: compile
    };

    return directive;

    function compile() {
      return {
        pre: preLink,
        post: postLink
      };

      function preLink(scope, iElement, iAttrs, ctrl, transclude) {
        var assetPath = 'assets/img/iconic/';

        if(scope.dynSrc) {
          iAttrs.$set('data-src', scope.dynSrc);
        } else {
          // To support expressions on data-src
          iAttrs.$set('data-src', assetPath + scope.icon + '.svg');
        };

        var iconicClass;
        switch (scope.size) {
          case 'small':
            iconicClass = 'iconic-sm'
            break;
          case 'medium':
            iconicClass = 'iconic-md'
            break;
          case 'large':
            iconicClass = 'iconic-lg'
            break;
          default:
            iconicClass = 'iconic-fluid'
        }
        angular.element(iElement).addClass(iconicClass);
      }

      function postLink(scope, element, attrs) {
        var ico = iconic.getAccess();

        ico.inject(element[0]);

        foundationApi.subscribe('resize', function() {
          ico.update();
        });
      }
    }
  }

})();
