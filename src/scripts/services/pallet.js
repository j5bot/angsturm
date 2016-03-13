'use strict';

angular.module('pallet.services', ['layout.services'])

// allowable locations for layout components
.constant('ALLOWED_MATRIX', {
  layout: { column: false, component: false, container: 'in', row: false },
  container: { column: false, component: false, container: 'after', row: 'in', layout: 'container' },
  row: { column: 'in', component: false, container: false, row: 'after', layout: false },
  column: { column: 'after', component: 'in', container: false, row: 'in', layout: false },
  component: { component: 'after' }
})

// elements after N are automatically inserted into the layout when N is inserted
.constant('AUTO_INSERT', ['container','row','column','component'])

.factory('PalletService', [

  'Shared',

  'AUTO_INSERT',
  'ALLOWED_MATRIX',
  'LAYOUT_ITEM_TEMPLATE',

  'LayoutService',
  'AngsturmMessages',

  function (
    
    Shared,

    AUTO_INSERT,
    ALLOWED_MATRIX,
    LAYOUT_ITEM_TEMPLATE,

    LayoutService,

    Åmsg

  ) {

    var layout = LayoutService.layout, 

      getLayoutTree = function () { return layout; },

      saveLayoutTree = function (currentItem) {
        return LayoutService.save(currentItem);
        // window.localStorage.setItem('layoutTree', JSON.stringify(tree));
      },

      resetLayoutTree = function () {
        layout = LayoutService.layout = LayoutService.load(layout.id);
        // window.localStorage.removeItem('layoutTree');
      },

      canAdd = function (aspects, child) {
        return inOrAfter(firstAspect(itemAspects(aspects)), child);
      },

      eachAspectPair = function (sourceAspects, destAspects, func, returnWhen) {

        var result = false,
          source, dest;

        for (var si = 0, sl = sourceAspects.length; si < sl; si++) {
          for (var di = 0, dl = destAspects.length; di < dl; di++) {

            source = sourceAspects[si];
            dest = destAspects[di];

            result = func.call(this, source, dest);

            switch ( returnWhen ) {
              
              case 'first':
                if ( result ) {
                  return result;
                }
                break;

              case 'fail':
                if ( !result ) {
                  return result;
                }
                break;

              default:
                continue;

            }
          }
        }

        return result;

      },

      canMoveCheck = function (source, dest) {
        return inOrAfter(dest, source) === 'in';
      },

      canMove = function (sourceAspects, destAspects) {
        return eachAspectPair(itemAspectArray(sourceAspects), itemAspectArray(destAspects), canMoveCheck, 'first');
      },

      inOrAfter = function (parent, child) {
        return (ALLOWED_MATRIX[parent] && ALLOWED_MATRIX[parent][child]) || false;
      },

      insertionPoint = function (item, location) {

        var active = item && item.active,
          consider = layout.consider;

        if ( ! (active && item.aspects && consider) ) {
          return false;
        }

        var aspect = firstAspect(itemAspects(item.aspects)),
          where = inOrAfter(aspect, consider);

        return consider && (where === location);
      },

      removeItem = function (item) {
        var $parent = item && item.parent,
          items = ($parent && $parent.node && $parent.node.items) || ($parent && $parent.item && $parent.item.items) || [],
          index;

        // early return, nothing to do
        if (!$parent) {
          return;
        }

        index = items.indexOf(item);
        items.splice(index, 1);
      },

      itemAspects = function (aspects) {
        return itemAspectArray(aspects).join(' ');
      },

      itemAspectArray = function (aspects) {
        if ( ! aspects ) {
          return [];
        }

        if (angular.isArray(aspects)) {
          angular.forEach(aspects, function (aspect, key) {
            aspects[key] = aspect.replace('aspect-','').split(':')[0];
          });
        }
        if (angular.isObject(aspects)) {
          var temp = [];
          angular.forEach(aspects, function (value, key) {
            temp.push(key.replace('aspect-','').split(':')[0]);
          });
          aspects = temp;
        }
        return aspects;
      },

      firstAspect = function (aspects) {
        if ( ! aspects ) {
          return;
        }

        var aspect = aspects.match(/column|component|container|row/);
        aspect = (aspect && aspect.length && aspect.length > 0) ? aspect[0] : '';

        return aspect;
      },

      insertItem = function (type, item) {
        var aspects = itemAspects(item.aspects),
          autoInsert = AUTO_INSERT[AUTO_INSERT.indexOf(type) + 1];
        
        var aspect = firstAspect(aspects),
          currentItem = item,
          $parent = item && item.parent,
          items = getParentItems(item, item) || [],
        
          newItem = angular.copy(LAYOUT_ITEM_TEMPLATE),
          newAspects = {},
        
          matches, index,
          whereAllowed = inOrAfter(aspect, type),
          parentId = $parent.$id || $parent.title || $parent.id || $parent.item.title || $parent.item.id;

        // early return, nothing to add to
        if ( ! (whereAllowed && $parent) ) {
          return;
        }

        console.log('Shared:', Shared);

        newAspects['aspect-' + type] = { class: type };
        angular.extend(newItem.aspects, newAspects);

        switch (whereAllowed) {
          case 'in':
            currentItem.items.push(newItem);
            index = currentItem.items.indexOf(newItem);
            newItem.parent = currentItem;
            break;
          
          case 'after':
            if (items.length === 0) {
              console.log('can\'t add after when no siblings known');
              return;
            }
            index = items.indexOf(currentItem);
            items.splice(index + 1, 0, newItem);
            index = items.indexOf(newItem);
            newItem.parent = currentItem.parent;
            break;

          default:
            // noop
        }

        newItem.title = parentId + '.' + index;
        newItem.id = parentId + '.' + index;

        if ( ! angular.isUndefined(autoInsert) ) {

          this.insertItem(autoInsert, newItem);

        }

        // this.selectItem(newItem, $parent);
      },

      getParentItems = function (item, scope) {

        return getParent(item, scope, true);

      },

      getParent = function (item, scope, getItems) {

        var parent;

        parent = scope.$parent || scope.parent;

        if ( !parent || (parent === LayoutService.layout) ) {
          return getItems ? LayoutService.layout.items : LayoutService.layout;
        }

        if (parent.item && parent.item.items && parent.item.items.indexOf(item) !== -1) {

          return getItems ? parent.item.items : parent;
        }

        if (parent.node && parent.node.items && parent.node.items.indexOf(item) !== -1) {
          
          return getItems ? parent.node.items : parent;
        }

        return getParent(item, parent, getItems);

      },

      selectItem = function (item, $callerScope) {
        // alert('wtf');
        var layout = LayoutService.layout;

        // console.log(item, 'this is the node');
        if (!!layout.currentItem) {
          delete layout.currentItem.active;
          delete layout.currentItem.parent;
        }

        item.active = true;
        item.parent = getParent(item, $callerScope);

        layout.currentItem = item;
      },

      getSelectedItem = function ($callerScope) {
        return $callerScope.layout.currentItem || {};
      };

    return {

      getLayoutTree: getLayoutTree,
      saveLayoutTree: saveLayoutTree,
      resetLayoutTree: resetLayoutTree,

      canAdd: canAdd,
      canMove: canMove,
      inOrAfter: inOrAfter,
      insertionPoint: insertionPoint,

      itemAspects: itemAspects,
      firstAspect: firstAspect,

      removeItem: removeItem,
      insertItem: insertItem,
      selectItem: selectItem,
      getSelectedItem: getSelectedItem

    };
  }
]);
