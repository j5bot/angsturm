'use strict';

/**
 * @ngdoc function
 * @name interfaceDesignerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the interfaceDesignerApp
 */
(function (undefined) {

  var root = this;

  function debug() {
    debugger;

    return true;
  }

  angular.module('interfaceDesignerApp')
    .constant('LAYOUT_ITEM_TEMPLATE',
      {
        id: '',
        aspects: {},
        title: '',
        items: []
      }
    )
    .constant('LAYOUT_ITEM_PROPERTIES',
      {
        hasbgColor: true,
        hasbgImage: true
      }
    )
    .constant('LAYOUT_CONTAINER_PROPERTIES',
      {
        hasBgColor: false,
        hasBgImage: false,
        bgColor: null,
        bgImage: null
      }
    )
    .constant('LAYOUT_ROW_PROPERTIES',
      {
        layout: '50-50',
        hasBgColor: false,
        hasBgImage: false,
        bgColor: null,
        bgImage: null
      }
    )
    .constant('LAYOUT_COLUMN_PROPERTIES',
      {
        hasBgColor: false,
        hasBgImage: false,
        bgColor: null,
        bgImage: null
      }
    )
    .constant('ALLOWED_STYLES',
      {
        bgColor: 'backgroundColor',
        bgImage: 'backgroundImage',
        fgColor: 'color'
      }
    )
    .controller('MainCtrl',
      [
        '$scope',

        'Shared', 
        'LayoutService',
        'PalletService', 'ColorService',

        'Mode',

        'AngsturmMessages',

        'ALLOWED_STYLES',
        'LAYOUT_ITEM_TEMPLATE', 'LAYOUT_ITEM_PROPERTIES',

        function (

          $scope,
          
          Shared,
          LayoutService,
          PalletService, ColorService,
          
          Mode,

          Åmsg,
          
          ALLOWED_STYLES,
          LAYOUT_ITEM_TEMPLATE, LAYOUT_ITEM_PROPERTIES
        
        ) { //, LayoutService
          
          var layout = Shared.layout = LayoutService.layout,
            sender = Åmsg.createSender($scope, 'layout', 'main.controller', 'layout change');

          function toggleItem(property) {
            this[property] = !this[property];
          }

          function itemClasses (options) {
            if ( ! options ) {
              return;
            }

            var classes = angular.extend({}, options);

            if ( ! options.dynamic ) {
              return classes;
            }

            angular.forEach(classes.dynamic, function (value, key) {
              classes[value.class] = true;
            });

            delete classes.dynamic; // = null;

            return classes;
          }

          function stopProp ($event) {
            if (!angular.isUndefined($event)) {
              if ($event.preventDefault) {
                $event.preventDefault();
              }
              if ($event.stopPropagation) {
                $event.stopPropagation();
              }
            }
          }

          function saveAll ($event) {
            stopProp($event);

            var currentItem = layout.currentItem,
              parent = currentItem.parent;

            currentItem.parent = null;
            PalletService.saveLayoutTree(currentItem);
            currentItem.parent = parent;
          }

          function reset ($event) {
            stopProp($event);
            PalletService.resetLayoutTree();
          }

          function removeItem ($event) {
            stopProp($event);
            PalletService.removeItem(layout.currentItem);
          }

          function insertItem (type, $event) {
            stopProp($event);
            PalletService.insertItem(type, layout.currentItem);
            sender({ layout: layout }, 'layout:insert');
          }

          function insertionPoint(item, type, $event) {
            stopProp($event);
            return PalletService.insertionPoint(item, type);
          }

          function selectItem ($event) {
            var $callerScope = this,
              node = this.node || this.item;

            stopProp($event);
            PalletService.selectItem(node, $callerScope);
          }

          function setAliases(aliases, targets) {
            var $callerScope = this;

            if ( ! angular.isArray(aliases) ) {
              aliases = [aliases];
            }
            if ( ! angular.isArray(targets) ) {
              targets = [targets];
            }
            angular.forEach(aliases, function (alias, index) {
              $callerScope[alias] = targets[index];
            });

            return aliases.length > 0;
          }

          function isDev(property) {
            return Mode[property] === 'dev';
          }

          angular.extend($scope, {

            debug: debug,

            Shared: Shared,

            itemClasses: itemClasses,
            insertionPoint: insertionPoint,
            
            selectItem: selectItem,
            insertItem: insertItem,
            removeItem: removeItem,
            
            saveAll: saveAll,
            reset: reset,
            
            colors: ColorService.getColors(),
            setAliases: setAliases,
            isDev: isDev,
            toggleItem: toggleItem
            
          }, LAYOUT_ITEM_PROPERTIES);

        }
      ]
  );

}).call(this);
