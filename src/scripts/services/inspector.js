'use strict';

(function (undefined) {
  
  var root = this,

    ITEM_KEY = '$$hashkey',
    TOGGLE_EXPRESSION = '(item.settings.{{ expression }}) = !(item.settings.{{ expression }})',
    IS_TOGGLED_EXPRESSION = '!!(item.settings.{{ expression }})',
    TEMPLATE_EXPRESSION = 'views-inspectors-{{ type }}.html',
    SETTING_EXPRESSION = 'setting.setting.{{ setting }}.value',
    SET_EXPRESSION = 'item.settings.{{ setting }} = value',

    patternImageRE = new RegExp('.*/bg/(.*)$','i');

  angular.module('inspector.services', [])
  .factory('InspectorService', [

    '$interpolate',
    '$parse',

    'Mode',

    'PalletService',

    function (

      $interpolate,
      $parse,

      Mode,

      PalletService

    ) {

      function isDev(property) {
        return Mode[property] === 'dev';
      }

      function interpolate(expression, locals) {
        return $interpolate(expression)(locals);
      }

      function parseAndExecute (context, expression, locals) {
        return $parse(interpolate(expression,locals))(context);
      }

      function getOptions(context, inspector) {
        var settings = context.setting && context.setting.setting,
          options = angular.copy(context.setting && context.setting[inspector]),
          setting = options && options.setting,
          value = setting && settings[setting];

        value = value.value;

        if ( angular.isUndefined(setting) ) {
          return {};
        }

        options.value = value;
        options.expression = interpolate(SETTING_EXPRESSION, { setting: setting }); 
        return options;
      }

      function set (context, name, value, setting) {
        return parseAndExecute(context, SET_EXPRESSION, {
          property: name,
          setting: setting._Åname,
          value: value
        });
      }

      function toggle (context, expression) {
        return parseAndExecute(context, TOGGLE_EXPRESSION, {
          expression: expression
        });
      }

      function isToggled (context, expression) {
        return parseAndExecute(context, IS_TOGGLED_EXPRESSION, {
          expression: expression
        });
      }

      function imageIsPattern (image, pattern) {
        return image && image.replace && (image.replace(patternImageRE, '$1') === pattern);
      }

      function template (type) {
        return interpolate(TEMPLATE_EXPRESSION, { type: type });
      }

      function sliderSettings (setting) {
        var sliderConfig = setting.slider,
          options = {};
      }

      function sideClasses (settings) {
        var sides = ['top','right','bottom','left'], active = [], result = {};
        
        angular.forEach(sides, function (side, index) {
          if (settings[side]) {
            active.push(side.substr(0,1));
          }
        });

        if (active.length === 0) {
          return 't-r-b-l';
        }

        result[active.join('-')] = true;
        return result;
      }

      function selectedKey ($callerScope) {
        return PalletService.getSelectedItem($callerScope)[ITEM_KEY] || -1;
      }

      return {
        template: template,
        toggled: isToggled,
        toggle: toggle,
        set: set,
        options: getOptions,
        selectedKey: selectedKey
      };

    }

  ]);

}).call(this);