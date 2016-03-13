'use strict';

(function (undefined) {
  
  angular.module('interfaceDesignerApp')
  .factory('MockServices', [

    'MockServiceFactory',

    function (MockServiceFactory) {

      var pathRE = /([^\/]+)(.*)/mi;

      var Services = {

        contractor: MockServiceFactory.create('contractor',
          {
            localStorageAddress: 'contractor-mock',

            pathRE: pathRE,

            initialData: [
              { 'id': 0, 'label': 'Actions', 'value': '1', 'title': 'Actions' },
              { 'id': 1, 'label': 'Second', 'value': '2', 'title': 'Second' },
              { 'id': 2, 'label': 'Third', 'value': '3', 'title': 'Third' }
            ]

          }),

        endpoints: MockServiceFactory.create('endpoints',
          {
            localStorageAddress: 'endpoints-mock',

            pathRE: pathRE,

            initialData: [
              { 'value': '1', 'data': { 'service': 'forms', 'label': 'Data source 3', 'action': 'forms', 'item': '3' }, 'label': 'Data source 3' },
              { 'value': '2', 'data': { 'service': 'actions', 'label': 'Actions', 'action': 'actions', 'item': '4' }, 'label': 'Actions' },
              { 'value': '3', 'data': { 'service': 'media', 'label': 'Data source 5', 'action': 'media', 'item': '5' }, 'label': 'Data source 5' }
            ]

          }),

        forms: MockServiceFactory.create('forms',
          {
            localStorageAddress: 'forms-mock',
            pathRE: pathRE,
            initialData: [
              { 'foo': 'bar' },
              { 'random': 'list of items' },
              { 'because we can render': 'pretty much anything' }
            ]
          }),

        actions: MockServiceFactory.create('actions',
          {
            localStorageAddress: 'actions-mock',
            pathRE: pathRE,
            initialData: [
              { 'value': '1', 'data': { 'title': 'Action 1' } },
              { 'value': '2', 'data': { 'title': 'Action 2' } },
              { 'value': '3', 'data': { 'title': 'Action 3' } }
            ]
          }),

        layouts: MockServiceFactory.create('layouts',
          {
            localStorageAddress: 'layouts-mock',
            pathRE: pathRE,
            initialData: [
              {
                id: '-1',
                aspects: { 'aspect-layout': { class: 'layout' } },
                title: 'Layout',
                items: [
                  {
                    "id": "0",
                    "title": "Rich Content Node",
                    "aspects": {
                        "aspect-container": {
                            "class": "container"
                        }
                    },
                    "items": [{
                        "id": "002.0",
                        "aspects": {
                            "aspect-row": {
                                "class": "row"
                            }
                        },
                        "title": "Titles Row",
                        "items": [{
                            "id": "064.0",
                            "aspects": {
                                "aspect-column": {
                                    "class": "column"
                                }
                            },
                            "title": "Titles Column",
                            "items": [{
                                "id": "0CA.0",
                                "aspects": {
                                    "aspect-component": {
                                        "class": "component"
                                    }
                                },
                                "title": "Title",
                                "items": []
                            }],
                            "settings": {
                            }
                        }],

                        "settings": {
                        }
                    }],
                    "settings": {
                    }
                  }
                ]
              }
            ]
          })
        
      };

      return Services;

    }

  ]);

}).call(this);