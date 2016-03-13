(function (undefined) {

  'use strict';
  'be excellent to each other';

  var root = this,

    F = Object.create(function () {}),
    O = Object.create(null),
    A = Object.create([]),
    children = '_Åchild',

    hop = O.hasOwnProperty,

    _extend = {
      eachExtension: function (ext, idx) {
        var h = hop,
          c = children;

        // add object to collection of objects which extend this
        c = h.call(ext, c) ? ext[c].unshift(this) : ext[c] = [this];

        angular.forEach(ext, _extend.eachProperty.bind(this, ext));
      },

      eachProperty: function (extension, ext, key) {
        var h = hop;
        if (key === children) { return; }
        if (hop.call(extension, key) ||
          angular.isUndefined(this[key])) {
            this[key] = extension[key];
        }
      }
    };

  function Å (o) {
    return Å.prototype.create(o);
  }

  Å.prototype = {
    // create new object with Å and o as prototype
    create: function (o) {
      return Object.create(O).extend(o);
    },
    extend: function (extensions) {
      var o = this.create();

      angular.forEach(arguments, _extend.eachExtension, o);

      return o;
    },
    instanceof: function (o) {
      var h = hop,
        c = children,
        ch = h.call(o, c) ? o[c] : null,
        check = this;

      do {

        if (o === check ||
          ch && ch.indexOf(check) !== -1) {

          return true;

        }

      } while (check);
    }
  };

  angular.module('angsturm', []);
  angular.module('angsturm.controllers', []);
  angular.module('angsturm.directives', []);
  angular.module('angsturm.services', []);

}).call(this);
