'use strict';

(function (undefined) {

  var root = this,

    storage = {

      sources: ['content'],
      
      content: {

        endpoint: null, // we'll be fetching from endpoint later

        items: [

          {
            'aspects': ['aspect-component', 'aspect-heading', 'aspect-textblock'],
            'settings': {
              'thumbnail': '',
              'fullsize': '',
              'headingSize': 'h2',
              'text': 'Supercool!',
              'textblock': 'This is a bunch of longer text, yo.'
            }
          }

        ]

      }

    };

  function ContentService () {}

  ContentService.prototype = {
    getContent: function () {
      return storage;
    },
    get: function (address) {
      return storage[address || '_'];
    }
  };

  // right now this is very like the shared service, because we're just working with fakeness...
  angular.module('content.services', [])
  .service('ContentService', ContentService);

}).call(this);