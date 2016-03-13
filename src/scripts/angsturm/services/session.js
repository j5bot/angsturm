(function (undefined) {
  
  'use strict';

  var SessionService;

  SessionService = (function() {
    function SessionService() {}

    SessionService.prototype.scopes = [];

    SessionService.prototype.setStorage = function(key, value) {
      var scope, _i, _len, _ref;
      _ref = this.scopes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        scope = _ref[_i];
        scope[key] = value;
      }
      value = value === void 0 ? null : JSON.stringify(value);
      return sessionStorage.setItem(key, value);
    };

    SessionService.prototype.getStorage = function(key) {
      var sessionValue;
      sessionValue = sessionStorage.getItem(key);
      if (sessionValue === 'undefined') {
        return null;
      }
      return JSON.parse(sessionValue);
    };

    SessionService.prototype.register = function(scope) {
      var key, value;
      for (key in sessionStorage) {
        value = sessionStorage[key];
        scope[key] = (value !== null) && value !== 'undefined' ? JSON.parse(value) : null;
      }
      this.scopes.push(scope);
      return scope.$on('$destroy', (function(_this) {
        return function() {
          return (_this.scopes = _this.scopes.filter(function(s) {
            return s.$id !== scope.$id;
          }));
        };
      })(this));
    };

    SessionService.prototype.clear = function() {
      var key, _results;
      _results = [];
      for (key in sessionStorage) {
        _results.push(this.setStorage(key, null));
      }
      return _results;
    };

    // SessionService.prototype.isAuthenticated = function(value) {
    //   return this.accessor('isAuthenticated', value);
    // };

    // SessionService.prototype.user = function(value) {
    //   if (value === null) {
    //     value = null;
    //   }
    //   return this.accessor('user', value);
    // };

    SessionService.prototype.accessor = function(name, value) {
      if (value === null) {
        return this.getStorage(name);
      }
      return this.setStorage(name, value);
    };

    return SessionService;

  })();

  angular.module('angsturm.services').service('sessionService', SessionService);

}).call(this);