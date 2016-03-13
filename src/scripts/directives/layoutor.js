'use strict';

/**
 * @ngdoc function
 * @name interfaceDesignerApp.directive:layoutor
 * @description
 * # layoutor
 * Directive creates a layoutor control
 * part of the interfaceDesignerApp
 */
angular.module('interfaceDesignerApp')

.directive('layoutor',
  [
    'Shared', 'LayoutService', 'PalletService',
    'LAYOUT_ITEM_PROPERTIES',
    
    function (Shared, LayoutService, PalletService, LAYOUT_ITEM_PROPERTIES) {

      function canAdd(type) {
        var layout = LayoutService.layout;
        return PalletService.canAdd(layout.currentItem ? layout.currentItem.aspects : '', type);
      }

      function hasActive() {
        return LayoutService.layout && LayoutService.layout.currentItem !== null;
      }

      function consider(type) {
        var layout = LayoutService.layout;
        layout.consider = type;
      }

      function reconsider() {
        LayoutService.layout.consider = null;
      }

      var treeOptions = {

        accept: function (sourceNodeScope, destNodeScope, destIndex) {
          if ( angular.isUndefined(sourceNodeScope.node) || angular.isUndefined(destNodeScope.node) ) {
            console.log('source or dest is undefined');
            return false;
          }
          console.log('nodes:', sourceNodeScope.node.aspects, destNodeScope.node.aspects);
          return PalletService.canMove(sourceNodeScope.node.aspects, destNodeScope.node.aspects);
        }

      };

      return {
        scope: true,
        templateUrl: 'views/layoutor.html',
        link: function ($linkScope, $linkElement, $linkAttrs) {

          LayoutService.layout.then(function (layout) {

            Shared.layoutor = 'all';

            angular.extend($linkScope, {

              collapsed: false,

              canAdd: canAdd,
              hasActive: hasActive,
              consider: consider,
              reconsider: reconsider,

              treeOptions: treeOptions,
              layout: layout

            });

          });

        }
      };
    }
  ]
)
.directive('interfaceDesigner', [

  'Shared',
  'AngsturmScope',

  function (

    Shared,
    Ås

  ) {

    Shared.layoutor = 'all';

    function layoutorIs(type) {
      return Shared.layoutor.all || (Shared.layoutor[type] === true);
    }

    function showSection(type) {
      
      if ((Shared.layoutor === type) || (Shared.layoutor === 'all')) {
        return true;
      }
      return false;
    }

    return {

      link: function ($scope, $element, $attrs) {

        function setSection (section) {
            Shared.layoutor = section;
        }

        Ås.decorate($scope, {
          layoutor: Shared.layoutor,
          setSection: setSection,
          showSection: showSection
        });
      }

    };

  }

]);