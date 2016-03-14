'use strict';

(function (undefined) {

  angular.module('angsturm.services')
  .factory('AngsturmDynamicCSS', [

    '$interpolate',

    function (

      $interpolate

    ) {

      var

        BORDER_INTERPOLATER = $interpolate('border-style: {{ style }}; border-color: {{ color }}; border-width: {{ width }};'),
        PADDING_INTERPOLATER = $interpolate('padding: {{ width }};'),
        RADIUS_INTERPOLATER = $interpolate('border-radius: {{ width }}{{ unit }};'),
        SIDES_INTERPOLATER = $interpolate('{{ top }}{{ unit }} {{ right }}{{ unit }} {{ bottom }}{{ unit }} {{ left }}{{ unit }}'),
        SHADOW_INTERPOLATER = $interpolate('box-shadow: {{ horizon }}px {{ vertical }}px {{ blur }}px {{ spread }}px {{ color }};'),
        BROWSER_PREFIXED_INTERPOLATER = $interpolate('{{ property }}: {{ prefix }}{{ style }};'),

        BG_TINTED_IMAGE_STYLE_INTERPOLATER = $interpolate('linear-gradient(top, {{ color }}, {{ color }} ), url( {{ image }} )'),
        IMAGE_INTERPOLATER = $interpolate('{{ property }}: url( {{ image }} );'),

        COLOR_INTERPOLATER = $interpolate('{{ property }}: {{ color }};'),

        // BG_IMAGE_PROPERTY = 'background-image',
        // BG_TINTED_IMAGE_PROPERTY = 'background-image',

        prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''],

        classnameRE = /([^A-Za-z0-9]{1})/gim,

        // storage for references
        classes = {},
        hashKeys = {},
        ids = {};

      function cssSafe (string) {
        return string && string.replace(classnameRE, '-').replace(/-$/,'');
      }

      function getOpacity (properties) {
        var opacity = properties &&
          (angular.isUndefined(properties.opacity) ? 1 : (properties.opacity / 100));

        return opacity;
      }

      function getColor (properties) {
        var color = properties && properties.color,
          opacity = getOpacity(properties);

        if ( angular.isUndefined(color) || color === true ) {
          return;
        }

        if (opacity < 1) {
          color = color.replace(/\,1\)$/, ',' + opacity + ')');
        }

        return color;
      }

      function getImage (properties) {
        return properties && properties.image;
      }

      function getImageName (properties) {
        return properties && properties.imageName;
      }

      function getSides (properties) {
        return properties && properties.sides;
      }

      function getWidth (properties) {
        return properties && properties.width && properties.width.toString();
      }

      function getForeground (properties) {
        if ( angular.isUndefined(properties) ) {
          return {};
        }

        var color = getColor(properties),
          opacity = getOpacity(properties) || 1,

          result = {};

        if ( angular.isUndefined(color) ) {
          return result;
        }

        result.style = COLOR_INTERPOLATER({
          property: 'color',
          color: color
        });

        result.class = 'fg_' + (color === true ? 'inherit' : cssSafe(color));
        result.styleChildren = true;

        return result;
      }

      function getBackground (properties) {
        if ( angular.isUndefined(properties) ) {
          return {};
        }

        var color = getColor(properties),
          image = getImage(properties),
          imageName = getImageName(properties),
          opacity = getOpacity(properties),

          flags = 0,
          result = {};

        if ( angular.isUndefined(color) || color === true ) {
          flags += 1;
        }
        if ( angular.isUndefined(opacity) || opacity === 1 ) {
          flags += 2;
        }
        if ( angular.isUndefined(image) || image === true ) {
          flags += 4;
        }

        if (color === true) {
          color = 'transparent';
        }

        switch (flags) {

          // nothing
          case 7:
          case 5:
            return result;

          // no image or no opacity/image combination,
          // so simple bgcolor is the only need
          case 4:
          case 6:
            result.class = cssSafe(color);
            result.style = COLOR_INTERPOLATER({
              property: 'background-color',
              color: color
            });

            break;

          // color behind image
          case 2:
            result.class = cssSafe(color) + '_' + cssSafe(imageName || image);
            result.style = COLOR_INTERPOLATER({
              property: 'background-color',
              color: color
            }) + '\n' + IMAGE_INTERPOLATER({
              image: image
            });

            break;

          // color and/or opacity not defined,
          // so simple bgimage is the only need
          case 3:
          case 1:
            result.class = cssSafe(imageName || image);
            result.style = IMAGE_INTERPOLATER({ property: 'background-image', image: image });
            break;

          // image and transparent color / color in front of image
          case 0:
            var style = [],
              base = BG_TINTED_IMAGE_STYLE_INTERPOLATER({
                color: color,
                image: image
              });

            angular.forEach(prefixes, function (prefix, index) {
              style.push(
                BROWSER_PREFIXED_INTERPOLATER({
                  property: 'background-image',
                  prefix: prefix,
                  style: base,
                })
              );
            });

            result.class = (color === true ? 'inherit' : cssSafe(color) + '_' + cssSafe(imageName || image));
            result.style = style.join('\n');
            break;
        }

        result.class = result.class ? 'bg_' + result.class : undefined;

        return result;
      }

      function getBorder (properties) {

        if ( angular.isUndefined(properties) ) {
          return {};
        }

        var color = getColor(properties) || 'transparent',
          opacity = getOpacity(properties) || 1,
          sides = getSides(properties),
          width = getWidth(properties),

          radius = properties.radius,
          circle = properties.circle,

          flags = 0,
          result = {};

        if (color === true) {
          color = 'transparent';
        }

        if ( ! (width > 0 || radius > 0 || circle ) ) {
          return result;
        }

        if ( angular.isUndefined(sides) ) {
          width = angular.isUndefined(width) ? '0' : width + 'px';
        } else {
          sides.unit = 'px';
          width = SIDES_INTERPOLATER(sides);
        }

        result.class = 'border_' + cssSafe(color) +
          '_solid_' + cssSafe(width.replace(/px/g,'')) +
            (radius ? '_' + cssSafe(radius) : '') +
              (circle ? '_circle' : '');

        result.style = BORDER_INTERPOLATER({
          color: color,
          style: 'solid',
          width: width
        });

        if (radius && !circle) {
          result.style += '\n' + RADIUS_INTERPOLATER({ width: radius, unit: 'px' });
        }
        if (circle) {
          result.style += '\n' + RADIUS_INTERPOLATER({
            width: '50',
            unit: '%'
          }) + '\noverflow: hidden;';
        }

        return result;
      }

      function getPadding (properties) {

        if ( angular.isUndefined(properties) ) {
          return {};
        }

        var sides = getSides(properties),
          width = properties.size,

          flags = 0,
          result = {};

        if ( ! (angular.isNumber(width) && width > 0) ) {
          return result;
        }

        if ( angular.isUndefined(sides) ) {
          width = angular.isUndefined(width) ? '0' : width + 'px';
        } else {
          sides.unit = 'px';
          width = SIDES_INTERPOLATER(sides);
        }

        result.class = 'pad_' + cssSafe(width.replace(/px/g,''));

        result.style = PADDING_INTERPOLATER({
          width: width
        });

        return result;
      }

      function getShadow (properties) {
        if (angular.isUndefined(properties) ) {
          return {};
        }

        var color = getColor(properties),
          opacity = getOpacity(properties) || 1,
          horizon = properties.horizon || 0,
          vertical = properties.vertical || 0,
          blur = properties.blur,
          spread = properties.spread,

          result = {};

        if ( angular.isUndefined(color) || color === true ) {
          return result;
        }

        result.class = 'shadow' +
          (color !== true ? cssSafe(color) : '') +
            '_' + horizon + '-' + vertical + '-' + blur + '-' + spread;

        result.style = SHADOW_INTERPOLATER({
          color: color,
          horizon: horizon,
          vertical: vertical,
          blur: blur,
          spread: spread
        });

        return result;
      }

      function initKey (object, key) {
        if (angular.isUndefined(object[key])) {
          object[key] = {};
        }
      }

      function reclass (adder, remover, idoh, contextkey, newclass) {
        initKey(classes, contextkey);
        initKey(ids, contextkey);
        initKey(ids[contextkey], idoh);

        var idohclasses = ids[contextkey][idoh];

        angular.forEach(idohclasses, function (oldclass, key) {
          if (oldclass === newclass) {
            return;
          }

          var usesclass = classes[contextkey][oldclass];
          delete usesclass[idoh];

          if (Object.keys(usesclass).length === 0) {
            delete classes[contextkey][oldclass];
          }

          delete idohclasses[key];

          remover(oldclass);
        });

        adder(newclass);

        initKey(classes[contextkey], newclass);

        idohclasses[newclass] =
          classes[contextkey][newclass][idoh] =
            newclass;
      }

      return {
        foreground: getForeground,
        background: getBackground,
        border: getBorder,
        shadow: getShadow,
        padding: getPadding,
        reclass: reclass
      };

    }

  ]);

}).call(this);
