'use strict';

/**
 * @ngdoc function
 * @name interfaceDesignerApp.directive:inspector
 * @description
 * # inspector
 * Directive creates an inspector control
 * part of the interfaceDesignerApp
 */
(function (undefined) {

  var root = this;

  angular.module('interfaceDesignerApp')
  .directive('inspector',
    [

      'Shared',
      'Aspects',

      'AngsturmComposer',
      'AngsturmMessages',

      'LayoutService',
      'PalletService',
      'ContentService',
      'ColorService',
      'InspectorService',

      'Mode',
      'LAYOUT_ITEM_PROPERTIES',
      'LAYOUT_CONTAINER_PROPERTIES',
      'LAYOUT_ROW_PROPERTIES',
      'LAYOUT_COLUMN_PROPERTIES',

      function (

        Shared,
        Aspects,

        Åc,
        Åmsg,

        LayoutService,
        PalletService,
        ContentService,
        ColorService,
        InspectorService,

        Mode,
        LAYOUT_ITEM_PROPERTIES,
        LAYOUT_CONTAINER_PROPERTIES,
        LAYOUT_ROW_PROPERTIES,
        LAYOUT_COLUMN_PROPERTIES

      ) {

        var layout = LayoutService.layout, // Shared.layout,

          content = ContentService.getContent(),

          itemTemplates = {
            item: LAYOUT_ITEM_PROPERTIES,
            container: LAYOUT_CONTAINER_PROPERTIES,
            row: LAYOUT_ROW_PROPERTIES,
            column: LAYOUT_COLUMN_PROPERTIES
          };

        function setColor(field, color) {
          field.setting.color.value = color;
          return false;
        }

        // TODO: DRY this ... the logic is always the same,
        function setImageDataURL(file, setting, value) {
          setting.value = value;

          return {
            file: file,
            setting: setting,
            value: value
          };
        }

        function getValueFromOptions (options) {
          return angular.isUndefined(options.value) ?
            (angular.isUndefined(options.default) ? 100 : options.default) :
              options.value;
        }

        function slider(field) {

          // console.log('field: ' + angular.toJson(field));

          if ( ! field.slider ) {
            return {};
          }

          var options = field.slider,
            sliderOptions = {
              start: options.start,
              end: options.end,
              step: options.step,
            },

            property = options.property,
            expr = 'field.setting.' + property + '.value',
            val;

          val =
            sliderOptions.value =
              (field.setting[property].value ||
                (field.setting[property].value = getValueFromOptions(options))
              );

          return {
            field: field.setting,
            id: field.order,
            options: sliderOptions,
            expr: expr,
            value: val, // field.setting[property].value,
            property: property
          };
        }

        function siderClasser() {
          var setting = this.setting,
            sides = ['top','right','bottom','left'], active = [], result = {};

          angular.forEach(sides, function (side, index) {

            if (setting.setting[side] && setting.setting[side].value) {
              active.push(side.substr(0,1));
            }

          });

          if (active.length === 0) {
            return 't-r-b-l';
          }

          result[active.join('-')] = true;

          return result;
        }

        function getTypes() {
          var current = LayoutService.layout.currentItem;

          if (angular.isUndefined(current)) {
            return;
          }
          var aspects = current.aspects,
            types = [];

          angular.forEach(aspects, function (value, key) {
            if (angular.isUndefined(value) || angular.isUndefined(key)) {
              return;
            }

            if (angular.isNumber(key)) {
              types.push(value.replace('aspect-',''));
              return;
            }

            types.push(key.replace('aspect-',''));
          });

          if (current.component) {
            types.push(current.component.componentType);
          }

          return types;
        }

        function getCurrent() {
          return this.current;
        }

        function isDev(property) {
          return Mode[property] === 'dev';
        }

        function extendAspects ($scope, $element, namespace) {
          var aspects = $scope.item.aspects;

          angular.forEach(aspects, function (v, k) {
            $element.attr(namespace + '-' + k, k);
          });
        }

        return {
          restrict: 'EA',
          scope: true,
          templateUrl: 'views/inspector.html',
          controllerAs: 'inspectCtrl',
          controller: function ($scope) {

            var InspectorController = {

              layout: LayoutService.layout,
              colors: ColorService.getColors,
              siderClasser: siderClasser,

              setImageDataURL: setImageDataURL,
              getCurrent: getCurrent.bind($scope),
              getTypes: getTypes,
              selectedKey: InspectorService.selectedKey,
              extendAspects: extendAspects,

              data: {
                layout: LayoutService.layout,
              },

              methods: {
                colors: ColorService.getColors,
                setImageDataURL: setImageDataURL,
                isDev: isDev,
                extendAspects: extendAspects
              }
            };

            angular.extend($scope, InspectorController);

            $scope.collapsed = false;

            $scope.$watch('layout.currentItem', function (n,o) {
              if ( angular.isUndefined(n) ) {
                return;
              }

              var model = LayoutService.layout.currentItem || {};
              // model.ordered = undefined;

              Åc.compose(model);
              Åc.order(model, 'ordered', 'order');

            }, false);

            Åmsg.listen($scope, 'set', null, function ($event, data) {

              Åmsg.createSender(data.origin, 'component:change', 'on')(data.value);

            }, '(this.layout.currentItem.id || model.id)');

            return InspectorController;
          }

        };
      }
    ]
  )
  .directive('inspectorItem',
    [
      '$compile',
      '$templateCache',
      '$timeout',

      'InspectorService',

      'AngsturmScope',
      'AngsturmMessages',

      function (

        $compile,
        $templateCache,
        $timeout,

        InspectorService,

        Ås,
        Åmsg

      ) {

        function executeWithScopeOnSetting (scope, command, parameters) {
          return InspectorService[command]
            .apply(InspectorService,
              scope ? [scope].concat(parameters) : parameters
            );
        }

        function setting (context, which) {
          return context.setting &&
            context.setting.setting &&
              (which ? context.setting.setting[which] : context.setting.setting);
        }

        var InspectorItem = {

          template: function template () {
            var type = this.setting && this.setting.editType;

            if ( angular.isUndefined(type) ) {
              return '';
            }

            return executeWithScopeOnSetting(null, 'template', [type]);
          },

          checked: function checked (which) {
            return this.is(which, true);
          },

          check: function check (which) {
            return this.set(which, !this.get(which).value);
          },

          toggled: function toggled (param) {
            var setting = this.setting && this.setting.toggleExpression;
            if ( ! angular.isString(setting) ) {
              return true;
            }
            return executeWithScopeOnSetting(
              this, 'toggled', [setting]
            );
          },

          toggle: function toggle (param) {
            var setting = this.setting && this.setting.toggleExpression;
            if ( angular.isUndefined(setting) ) {
              return;
            }
            return executeWithScopeOnSetting(
              this, 'toggle', [setting]
            );
          },

          get: function get (which) {
            return setting(this, which);
          },

          getOption: function getOption (inspector, opt) {

            return this.get(this.option(inspector, opt));

          },

          set: function set (which, value) {
            var $scope = this,
              name = which || this.setting._Åname;

            which = setting(this, which);
            which && (which.value = value);

            executeWithScopeOnSetting(this, 'set', [name, which && which.value, this.setting]);

            $timeout(function () { $scope.$apply(); }, 0);

            $scope.setSender({ name: name, setting: which, value: value, settings: this.setting.setting });
          },

          send: function send (which) {
            var value = this.get(which).value;
            this.setSender({ name: which, setting: which, value: value, settings: this.setting.setting });
          },

          setSimple: function setSimple (value) {
            this.set(null, value);
          },

          is: function is (which, value) {
            which = setting(this, which);
            return which && (which.value === value);
          },

          option: function option (inspector, opt) {
            return this.setting &&
              this.setting[inspector] &&
                this.setting[inspector][opt];
          },

          selected: function () {

            var setting = this.setting.setting,
              property = this.setting.property || 'value',
              sel = this.setting.options && this.setting.options.filter(function (v) {

              if ( angular.isUndefined(setting.value) ) {
                return false;
              }

              return v[property] === setting.value;
            });
            return { item: (sel && sel.length > 0) ? sel[0] : undefined };

          },

          options: function options (inspector) {
            return executeWithScopeOnSetting(this, 'options', [inspector]);
          },

          optionValue: function optionValue (inspector, option) {
            option = this.option(inspector, option);
            option = this.get(option);

            return option && option.value;
          }

        };

        return {
          scope: true, // child scope
          restrict: 'EA',
          // require: '^inspector',
          // controllerAs: 'inspector',
          compile: function () {
            return {
              pre: function ($scope, $element, $attrs, inspectorController) {

                $scope.setSender = Åmsg.createSender($scope, 'set', 'set', undefined, 'emit');

                $scope.$watch($attrs.item, function (n,o) {
                  // extend the child scope with directive specific settings
                  Ås.decorate($scope, ['item','setting','value'], $attrs);

                  // Implement the interface
                  Ås.decorate($scope,
                    InspectorItem
                  );

                  // inspectorController.extendAspects($scope, $element, 'inspector');

                }, false);

              }
            };
          }

        };

      }
    ]
  )
  .directive('selectComponent', [

    '$timeout',

    'AngsturmMessages',
    'AngsturmScope', 'AngsturmComposer',

    function (

      $timeout,

      Åmsg,
      Ås, Åc

    ) {

      var sender; // update notifier

      var SelectComponent = {
        setComponent: function (selected) {

          var $callerScope = this,
            settings = $callerScope.item.settings,
            component = settings.component || (settings.component = {}),
            setting = selected.setting,
            value = selected.value,

            currentAspects = component.aspects || (component.aspects = {}),
            newAspects = selected.aspects;

          settings[setting].value = value;

          /*
          When you do an extend here, it shows all the inspector settings ... even the ones
          that are not currently 'active'
           */

          component.aspects = {};
          angular.copy(selected.aspects, component.aspects);

          // we have to re-compose because we could be changing components
          Åc.recompose(component);
          Åc.order(component, 'ordered', 'order');

          // send a notice of update
          sender();

          $timeout(function () { $callerScope.$apply(); }, 0);

        }
      };

      var SelectComponentController = function ($scope) {
        // create an update notifier
        sender = Åmsg.createSender($scope, 'component:change', 'setComponent', $scope.item.settings.component);
      };

      return {
        scope: true,
        controller: SelectComponentController,
        link: function ($scope, $element, $attrs) {
          Ås.decorate($scope,
            SelectComponent
          );
        }
      };

    }
  ])
  .directive('inspectorSettings',
    [

      function () {

        return {
          link: function ($scope, $element, $attrs) { }
        };

      }

    ]
  )
  .directive('backgroundChooser',
    [
      'AngsturmScope',

      function (

        Ås

      ) {

        var patternImageRE = new RegExp('.*/bg/(.*)$','i'),

        BackgroundChooser = {

          isPattern: function () {

            var image = this.value && this.value.value,
              pattern = this.image;

            if ( ! (image && image.replace) ) {
              return false;
            }
            if (image.indexOf('data:') === 0) {
              return false;
            }

            return image.replace(patternImageRE, '$1') === pattern;
          },

          _style: function (image, size) {

            return {
              'background-image': 'url("{{ image }}")'.replace('{{ image }}', image),
              'height': size,
              'width': size,
              'display': 'inline-block'
            };

          },

          pattern: function (size) {
            var image = '/images/bg/' + this.image;

            return this._style(image, size);
          },

          selectedStyle: function (size) {

            var image = this.value.value;

            return this._style(image, size);
          }

        };

        return {
          controller: 'Backgrounds',
          link: function ($scope, $element, $attrs) {

            Ås.decorate($scope, BackgroundChooser);

          }
        };
      }
    ]
  );

  angular.module('commonApp.directives')
  .directive('formFields', [

  function(
  ) {

    return {
      restrict: 'E',
      scope: {
        id: '@elid',
        fields: '=',
        model: '=',
        style: '@formStyle',
        dictionary: '=',
        behaviors: '=',
        validateFunctions: '=',
        submitted: '='
      },
      templateUrl: '/views/inspectors/fields.html'
    };
  }]);

}).call(this);
