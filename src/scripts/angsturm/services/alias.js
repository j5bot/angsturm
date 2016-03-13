(function (undefined) {

  'use strict';
  'be excellent to each other';

  var root = this;

  angular.module('angsturm.services')
  .factory('AngsturmAlias', [

    '$injector',

    function (

      $injector

    ) {

      var aliases = {};

      function addSourceDirective (source, index) {
        var alias = this,
          directives = alias.directives,
          directiveProvider = angular.element.camelCase(source.directive) + 'Directive',
          directive;

        if ( ! $injector.has(directiveProvider) ) {
          return;
        }

        directive = directives[index] = $injector.get(directiveProvider);

        angular.forEach(directive, addProvider.bind(this, source, directive), alias);

        return directive;
      }

      function templateMutatorFactory (alias, source) {
        return function (templateElement, templateAttrs) {
          var directive = source.directive,
            ccDirective = angular.element.camelCase(directive);
          templateElement.removeAttr(directive);
          templateAttrs.$attr[ccDirective] = directive;
          templateAttrs[ccDirective] = source.attribute;
        };
      }

      function addProvider (source, directive, directiveDefinition, index) {
        var alias = this,
          providers = alias.providers,
          provider = {
            source: source,
            directive: directive,
            mutator: templateMutatorFactory(alias, source),
            definition: directiveDefinition
          };

        providers.push(provider);
      }

      function addFns (templateElement, templateAttrs, provider) {

        var alias = this,
          preFns = alias.preFns,
          postFns = alias.postFns,
          compile;

        provider.mutator(templateElement, templateAttrs);

        for (var i = 0, l = provider.length; i < l; i++) {
          compile = provider[i].definition.compile(templateElement, templateAttrs);

          preFns.push(compile.pre);
          postFns.push(compile.post);

          provider.source = null;
          provider.directive = null;
          provider.mutator = null;
        }
      }

      function execute (fns, $scope, $element, $attrs) {
        var context = this;

        angular.forEach(fns, function (fn, index) {
          fn.call(context, $scope, $element, $attrs);
        });
      }

      var Alias = {

        init: function (options) {

          var alias = aliases[options.name] = this,
          sources = options.sources || [],

          preFns = alias.preFns = [],
          postFns = alias.postFns = [],

          directives = alias.directives = new Array(sources.length),
          providers = alias.providers = [];

          angular.forEach(sources, addSourceDirective, alias);

          return alias;
        },

        compile: function (targetElement, targetScope) {

          var alias = this;

          angular.forEach(alias.providers, addFns.bind(alias, targetElement, targetScope), alias);

          var pre = execute.bind(alias, alias.preFns),
            post = execute.bind(alias, alias.postFns);

          return {
            pre: pre,
            post: post
          };
        }

      };

      return {

        alias: function (aliasName, aliasOptions) {

          if ( angular.isUndefined(aliasOptions) ) {
            return aliases[aliasName];
          }

          var alias = Object.create(Alias);
          alias.init(aliasOptions);

          return alias;

        }

      };

    }

  ]);

}).call(this);
