/**
 * @ngdoc overview
 *
 * @name  ResourceServices / EndpointList
 * @description 
 *
 * # ResourceServices 
 * 
 * Defines the ResourceServices factory for creating resource services.
 * 
 * # EndpointList
 * 
 * Creates a resource service for retrieving the list of available service endpoints.
 */
(function (undefined) {

  'use strict';
  
  var root = this;

  /**
   * @ngdoc module
   * @name ResourceServices
   * @description
   *
   * ## ResourceServices
   * 
   * ResourceServices is a Factory with which you can create Singleton Resource 'services'
   * in order to communicate with angular $resource (HTTP) services in a consistent fashion.
   *
   * A ResourceService has additional $resource/$http methods as given in ResourceServiceMethods,
   * and additional javascript convenience methods for Resource creation / saving as given
   * in ResourceMethods.
   *
   * A ResourceService is Ångsturm-aware, and when it detects that a Resource was composed by
   * Ångsturm, it uses the Ångsturm composer's decomposition methods
   * to prepare a minimal settings-only version of the Resource for storage.
   *
   * ResourceServices are cached according to a hash of the name, URL pattern, default URL parameters,
   * and if applicable the list of additional methods which were provided when the service was
   * created with the call to ResourceServices.createService.
   *
   * Subsequent calls to ResourceServices.createService with a matching hash will return the same
   * service.  Redefinition or removal of the service is not possible at this time.
   */
  angular.module('interfaceDesignerApp')
  .factory('ResourceServices', [
    
    '$resource',
    
    'md5',

    'ResourcePattern',
    'ApplicationResourceConfig',
    'ResourceServicesConfig',

    'AngsturmComposer',

    function (
    
      $resource,

      md5,

      ResourcePattern,
      ApplicationResourceConfig,
      ResourceServicesConfig,

      Åc

    ) {

      var ResourceServiceMethods = {

        head: {
          method: 'head',
          isArray: false
        },

        count: {
          method: 'head',
          isArray: false,
          transformResponse: function (data, headersGetter) {
            data.count = headersGetter('X-Response-Count');
            return angular.fromJson(data);
          }
        },

        update: {
          method: 'post',
          isArray: false,
          transformRequest: function (data, headersGetter) {
            return data._Åcomposed ? Åc.decompose(data, false, true) : data; 
          }
        }

      };

      var ResourceMethods = {

        /**
         * Create an instance of this resource type
         * by invoking the constructor method
         * 
         * @param  {Object} item An item whose properties will be added to the new object
         * @return {Resource}      A Resource instance with the same 'profile' as the generating
         *                           Resource collection/type
         */
        create: function create (item) {
          return new this(item);
        },

        /**
         * Create an instance of this resource type
         * by saving it to the Resource collection
         * 
         * @param  {Object} item An item whose properties will be added to the new resource
         * @return {promise}     A promise which reflects the update operation being executed
         *                         by the Resource collection in order to save the item
         */
        saveNew: function saveNew (item) {
          return this.update(item);
        }

      };

      /**
       * Create a new Resource service with the given URL pattern, default parameters,
       * and resource extension methods.
       * 
       * @param  {[type]} options [description]
       * @return {[type]}         [description]
       */
      function createService (options) {
        return $resource(options.pattern, options.defaults, options.methods);
      }

      function createResourceOptions(name, pattern, defaults, methods) {
        return {
          name: name,
          pattern: pattern || ResourcePattern,
          defaults: defaults,
          methods: angular.isObject(methods) ? angular.extend({}, ResourceServiceMethods, methods) : ResourceServiceMethods
        };
      }

      var ResourceServiceCache = {};

      var ResourceServices = {

        /**
         * Create a new Resource, or return a previously constructed resource based service
         * with the given name, URL pattern, default parameters, and Resource extended methods
         * 
         * @param  {String} name     Name of the service, only used for calculating cache key
         * @param  {RegExp} pattern  The pattern which will be completed by default and
         *                           specified parameters in order to create the Resource URL
         * @param  {Object} defaults Key/value pairs of default parameters for the Resource Service
         * @param  {Object} methods  Key/value pairs of names and signatures for extended methods
         *                           to add to the Resource, which follow HTTP method config format
         * @return {Resource}        Angular Resource object which allows access to collection and
         *                           individual items in the collection
         *                           See https://docs.angularjs.org/api/ngResource/service/$resource
         */
        createService: function create (name, pattern, defaults, methods) {

          var resourceOptions = createResourceOptions(name, pattern, defaults, methods),
            optionsHash;
            
          optionsHash = md5.createHash(
              angular.toJson(angular.extend({}, resourceOptions, {
                methods: angular.isObject(methods) ? Object.keys(methods) : undefined
              }))
            );

          if ( ! angular.isUndefined(ResourceServiceCache[optionsHash]) ) {
            return ResourceServiceCache[optionsHash];
          }

          var service = createService(resourceOptions);

          angular.extend(service, ResourceMethods);

          return (ResourceServiceCache[optionsHash] = service);
        
        }
      };

      ResourceServices.createService('default', ResourcePattern, ApplicationResourceConfig, ResourceServicesConfig);

      return ResourceServices;

    }

  ]);

  angular.module('interfaceDesignerApp')
  .service('EndpointList', [

      'ResourceServices',
      'ResourcePattern',
      'ApplicationResourceConfig',

      'EndpointsServiceAction',

    function (
    
      ResourceServices,
      ResourcePattern,
      ApplicationResourceConfig,

      EndpointsServiceAction

    ) {

      var EndpointSourceResource = ResourceServices.createService(
          'endpoints', 
          undefined,
          angular.extend(ApplicationResourceConfig, { action: EndpointsServiceAction }),
          {}
        );

      return EndpointSourceResource.query();

    }

  ]);

}).call(this);