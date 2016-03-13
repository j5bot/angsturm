/* globals JSON3 */

'use strict';

(function (undefined) {
  
  var root = this;

  angular.module('interfaceDesignerApp')
  .factory('MockServiceFactory', [

    function () {

      function newId(service) {
        var id = service.data.length;

        if ( ! angular.isUndefined(service.data[id]) ) {
          return newId(service);
        }

        return id;
      }

      function serialize(data) {
        var obj = {};

        angular.forEach(data, function (value, index) {
          if ( ! (angular.isUndefined(value) || value === null) ) {
            obj[index] = value;
          }
        });

        return JSON3.stringify(obj);
      }

      function deserialize(key) {
        var str = localStorage.getItem(key),
          items = [], i = 0;

        if ( angular.isString(str) ) {
          str = JSON3.parse(str);
        }

        angular.forEach(str, function (value, index) {
          if ( ! (angular.isUndefined(value) || value === null) ) {
            items[i++] = value;
            items[i - 1].index = i - 1;
          }
        });

        return items;
      }

      function retrieve(service) {
        return deserialize(service.localStorageAddress);
      }

      function store(service, data) {
        service.data = data;
        localStorage.setItem(service.localStorageAddress, serialize(data));
      }

      function filter(data, fn) {
        var result = data.map(function (v,i,a) {
          return JSON3.parse(v);
        });
        if (fn) {
          result = result.filter(fn);
        }
        return result.filter(function (v,i,a) {
          return ! (angular.isUndefined(v) || v === null);
        });
      }

      var Service = {

        localStorageAddress: 'mock-service',

        initialData: null,

        initialize: function () {
          var existing = retrieve(this);

          if ( existing && existing.length > 0 ) {
            this.initialData = existing;
          }

          store(this, this.initialData);
          return this;
        },

        getData: function () {
          return [200, this.data, {}];
        },
        setData: function (data) {
          this.data = data;
          store(this, this.data);
          return this;
        },

        newId: function () {
          var id = newId(this);
          this.data[id] = true; // reserve the id
          return id;
        },

        create: function (data, prefix) {
          var id = this.newId();
          this.update(id, data);
          return id;
        },
        read: function (id) {
          var data = this.data[id];

          if ( ! angular.isUndefined(data) ) {
            return data;
          }

          angular.forEach(this.data, function (v, k) {
            if ( k === id || v.id === id ) {
              data = v;
            }
          });

          return data;
        },
        update: function (id, data) {
          if ( ! data.id ) {
            data.id = id;
          }

          this.data[id] = data;
          store(this, this.data);
          return this;
        },
        delete: function (id) {
          this.data[id] = 0;
          return this;
        },
        query: function (fn) {
          return filter(this.data,fn);
        },

        head: function (path, parameters, data) {
          var count = Object.keys(this.getData()).length;

          if (count) {
            return [200, {}, {
              'X-Response-Count': count
            }];
          }
        },

        get: function (path, parameters, data) {

          if ( path === '' ) {
            return this.getData();
          }

          var matches = this.pathRE.exec(path);

          if ( matches.length === 0 ) {
            return { error: true };
          }

          var id = matches[0],
            item = this.read(id);

          return [200, item, {}];
        },

        // TODO mock parameter based items
        post: function (path, parameters, data) {

          if ( angular.isUndefined(path) || path === '' ) {
            path = this.newId();
          } 

          console.log('mock post data:', data);
          this.update(path, data);

          return [200, this.read(path), {}];
        }

      };

      var services = {};

      function createService (serviceName, methods) {
        var service = services[serviceName] = Object.create(Service);

        if ( ! angular.isUndefined(methods) ) {
          angular.extend(service, methods);
        }

        service.initialize();
        return service;
      }

      function getService (serviceName) {
        return services[serviceName] || createService(serviceName);
      }

      return {
        get: getService,
        create: createService
      };

    }

  ]);

}).call(this);