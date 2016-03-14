'use strict';

(function (undefined) {

  var root = this;

  // TODO: move the CSS_PROPERTIES into aspect definitions

  var SETTINGS_EXPRESSION = '(this.componentSettings || this.item.settings).',
    CSS_PROPERTIES = {
      'foreground': {
        'color': 'fgColor.color.value',
        'opacity': 'fgColor.color.opacity'
      },
      'background': {
        'color': 'bgColor.color.value',
        'opacity': 'bgColor.opacity.value',
        'image': 'bgImage.value',
        'imageName': 'bgImage.name',
        'class': 'bgClass.value'
      },
      'border': {
        'color': 'borderColor.color.value',
        'opacity': 'borderColor.opacity.value',
        'width': 'borderWidth.width.value',
        'sides': 'borderSides',
        'radius': 'borderRadius.value',
        'circle': 'borderCircle.value'
      },
      'shadow': {
        'color': 'shadowColor.color.value',
        'opacity': 'shadowColor.opacity.value',
        'horizon': 'shadowHorizontal.position.value',
        'vertical': 'shadowVertical.position.value',
        'blur': 'shadowBlur.distance.value',
        'spread': 'shadowSpread.size.value'
      },
      'padding': {
        'size': 'paddingSize.size.value',
        'sides': 'paddingSides'
      }
    };

  function getSettings ($callerScope) {
    if ( angular.isUndefined($callerScope.item.settings) && angular.isUndefined($callerScope.componentSettings) ) {
      return;
    }

    return $callerScope.componentSettings || $callerScope.item.settings;
  }

  function getProperties($callerScope, key) {
      var properties = CSS_PROPERTIES[key],
        out = {},
        settings = this.getSettings($callerScope);

      angular.forEach(properties, function (expression, property) {
        out[property] = $callerScope.$eval(SETTINGS_EXPRESSION + expression);
      });

      return out;
  }

  function foregroundProperties ($callerScope) {
    return this.getProperties($callerScope, 'foreground');
  }

  function backgroundProperties ($callerScope) {
    return this.getProperties($callerScope, 'background');
  }

  function getSides (sides, value) {
    var sidesOut = {},
      length = 0;

    angular.forEach(sides, function (v, side) {
      if (v.value) {
        sidesOut[side] = v.value === true ? value : v.value;
        length++;
      } else {
        sidesOut[side] = 0;
      }
    });

    // all sides specified, or none specified (defaults to all)
    if (length === 0 || length === 4) {
      sidesOut = undefined;
    }

    return sidesOut;
  }

  function borderProperties ($callerScope) {
    var properties = this.getProperties($callerScope, 'border');
    properties.sides = getSides(properties.sides, properties.width);
    return properties;
  }

  function paddingProperties ($callerScope) {
    var properties = this.getProperties($callerScope, 'padding');
    properties.sides = getSides(properties.sides, properties.size);
    return properties;
  }

  function shadowProperties ($callerScope) {
    return this.getProperties($callerScope, 'shadow');
  }

  var ComplexCSS = {

    getSettings: getSettings,
    getProperties: getProperties,

    foregroundProperties: foregroundProperties,
    backgroundProperties: backgroundProperties,
    borderProperties: borderProperties,
    paddingProperties: paddingProperties,
    shadowProperties: shadowProperties

  };

  var SUPPORTED_KEYS = ['background','foreground','border','padding','shadow'],
    linkers = {};

  function onCSSChange ($scope, key, DynamicCSS, adder, remover) {

    var properties = this[key + 'Properties']($scope); // ComplexCSS.getProperties($scope, key);

    var style = DynamicCSS[key].call($scope, properties),
      styleClass = style.class,
      $style;

    if (style && style.class) {
      $style = $('#style_' + style.class);
      if ($style.size() === 0) {
        $style = $('<style>').attr('id', 'style_' + style.class);
        $style.appendTo($('head'));
      }

      if (style.styleChildren === true) {
        styleClass = styleClass + ', .' + styleClass + ' *';
      }

      $style.html('.' + styleClass + ' { ' + style.style + ' }');

      DynamicCSS.reclass(
        adder, remover,
        $scope.$id,
        key, style.class
      );
    }

    if (properties.class) {
      DynamicCSS.reclass(
        adder, remover,
        $scope.$id,
        key + '-sub', properties.class
      );
    }

  }

  function cssLinker (key, channel, dynamic, messages, options) {

    var $scope = options.scope,
      $element = options.element,
      $attrs = options.attrs,
      factory = options.factory;

    var adder = $element.addClass.bind($element),
      remover = $element.removeClass.bind($element);

    function setCSS () {
      factory.onCSSChange($scope, key, dynamic, adder, remover);
    }

    setCSS();

    messages.listen($scope, channel, key, setCSS, '(this.item.id || model.id)');

  }

  /**
   * Require this controller in a directive to bring in associated CSS decorators
   */

  angular.module('angsturm.controllers')
  .controller('AngsturmCSSFactory', [

    '$scope',
    'AngsturmDynamicCSS',
    'AngsturmScope',
    'AngsturmMessages',

    function (

      $scope,
      DynamicCSS,
      Ås,
      Åmsg

    ) {

      this.onCSSChange = onCSSChange;

      angular.forEach(SUPPORTED_KEYS, function (key, index) {
        linkers[key] = cssLinker.bind(this, key, 'component:change', DynamicCSS, Åmsg
        );
      });

      this.getLinker = function (key) {
        return linkers[key];
      };

      Ås.decorate(this, ComplexCSS);

    }

  ]);

}).call(this);
