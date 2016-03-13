'use strict';

(function (undefined) {
  
  var root = this;

  var assigned_ids = {};

  angular.module('angsturm.services')
  .factory('Id', [

    'Mode',

    function (Mode) {

      return {

        getMode: function (property) {
          return Mode[property];
        },

        checkId: function (id) {
          return !!assigned_ids[id];
        },

        getId: function (seed) {
          var hash;
          
          while ( !hash || this.checkId(hash) ) {
            hash = 
              (Math.abs(
                CryptoJS
                  .SHA1(
                    (seed ? 
                      seed :
                        '') + (new Date().valueOf()).toString())
                          .words[0]))
                            .toString().substr(0,6);
          }

          return hash;
        }

      };

    }

  ]);

}).call(this);