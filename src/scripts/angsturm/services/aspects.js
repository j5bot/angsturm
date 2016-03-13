/* globals JSON3 */

/**
 * @ngdoc function
 * @name layout.services:aspects
 * @description
 * # aspects
 * Service to supply the interfaces for various aspects, and object trimming methods,
 * storage of objects should assertively replace previous versions so that dirty tracking
 * isn't needed on the field/property level
 */
(function (undefined) {

  'use strict';
  'be excellent to each other';

  var root = this;

  function decorate (aspect) {
    var Aspects = this;

    if (angular.isArray(aspect)) {
      angular.forEach(aspect, Aspects.decorate, Aspects);
      return Aspects;
    }

    angular.forEach(aspect.interfaces, decorateFromInterfaceWithName, {
      Aspects: Aspects,
      aspect: aspect
    });

    return Aspects;
  }

  function decorateFromInterfaceWithName (interfaceName, interfaceKey) {
    var context = this,
      aspect = context.aspect,
      Aspects = context.Aspects;

    if (angular.isArray(interfaceName)) {
      angular.forEach(interfaceName, decorateFromInterfaceWithName, context);
      return Aspects;
    }

    angular.forEach(
      aspect,
      decorateWithLocation,
      {
        aspect: aspect,
        Aspects: Aspects,
        aspectName: interfaceName,
        name: interfaceKey
      }
    );

    return Aspects;
  }

  function decorateWithLocation (decoration, location) {
    var aspect = this.aspect,
      aspectProperties = aspect[location],
      Aspects = this.Aspects,
      aspectName = this.aspectName,
      key = this.name,

      target;

    target = Aspects[location] || (Aspects[location] = {});
    if ( ! (location === 'interfaces' && target[key]) ) {
      target[key] = aspectName;
    }

    target = target[aspectName] || (target[aspectName] = {});


    angular.extend(target, decoration);

    return Aspects;
  }

  function aspectsToString (aspects) {
    var attrs = [];
    angular.forEach(aspects, function (value, aspect) {

      if ( angular.isObject(value) || angular.isArray(value) ) {
        value = '="' + JSON3.stringify(value) + '"';
      }

      if ( ! angular.isString(value) ) {
        value = JSON3.stringify(value);
      }

      if ( angular.equals( value, angular.element.camelCase(value) ) ) {
        value = '';
      }

      attrs.push(' ' + aspect + value);
    });
    return attrs.join('');
  }

  function aspectHas (item, value) {
    var t = item.properties[this];
    if ( ! angular.isUndefined(value) ) {

      t.value = value;

      return t;
    }
    return t;
  }

  function Aspects() {}

  Aspects.prototype = Aspects.fn = {
    has: aspectHas,
    set: aspectHas,
    decorate: decorate,
    asAttributes: aspectsToString,
    options: {
      componentType: Aspects.elements
    }
  };

  angular.module('angsturm.services')
  .factory('Aspects', [

    '$timeout',
    'AspectsInterfaces',

    function (

      $timeout,
      AspectsInterfaces

    ) {

      angular.extend(Aspects.prototype, {
        interfaces: AspectsInterfaces
      });

      return {
        elements: Aspects.elements,
        interfaces: AspectsInterfaces,
        labels: Aspects.labels,
        has: Aspects.fn.has,
        set: Aspects.fn.has,
        decorate: decorate,
        asAttributes: aspectsToString,
        options: {
          componentType: Aspects.elements
        }
      };

    }

  ]);

}).call(this);
