'use strict';

/**
 * @ngdoc overview
 * @name interfaceDesignerApp
 * @description
 * # interfaceDesignerApp
 *
 * Main module of the application.
 *
 *
 * TODO: move constants into services
 * TODO: better way to bind select control options
 */
(function (undefined) {

  // Define common modules
  angular
    .module('commonApp.directives', []);

  angular
    .module('commonApp.services', []);

  var root = this,

    app = angular.module('interfaceDesignerApp', [
      'ui.router',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngMockE2E',
      'ui.select',
      'ui.tree',
      'mm.foundation',
      'xeditable',
      'RecursionHelper',
      'angular-md5',

      'angsturm',
      'angsturm.controllers',
      'angsturm.directives',
      'angsturm.services',

      'aspects.aspects',

      'pallet.services',
      'content.services',
      'layout.services',
      'inspector.services',

      'commonApp.services',
      'commonApp.directives'
    ]);

  // Configure the mode for different application features
  // Pretty much used to set debug flags
  app.constant('Mode', {
    showID: 'dev',
    // addID: 'dev',
    // insertionPoints: 'dev',
    main: 'dev',
    json: 'dev'
  })
  // Default configuration for resources
  .constant('ApplicationResourceConfig', {
    type: 'api',
    application: 'interface-builder',
    version: 'v1',
    datatype: '' // '.json'
  })
  // Default resource endpoint url pattern
  .constant('ResourcePattern', '/:type/:version/:application/:action/:item/:id:path:datatype')
  // Default resource extensions
  .constant('ResourceServicesConfig', {})
  .constant('EndpointsServiceAction', 'endpoints')
  // List of available content components
  .constant('ComponentList', [
    {
      label: 'Heading',
      value: 'heading',
      markup: '<i class="fa fa-header"></i> Heading',
      setting: 'componentType',
      aspects: {
        'aspect-heading-size': { class: 'heading-size' },
        'aspect-text': { class: 'heading-text' }
      }
    },
    {
      label: 'Markdown',
      value: 'markdown',
      markup: '<i class="fa fa-edit"></i> Markdown',
      setting: 'componentType',
      aspects: {
        'aspect-formatted-text': { 'class': 'markdown' }
      }
    },
    {
      label: 'Text Block',
      value: 'text',
      markup: '<i class="fa fa-paragraph"></i> Text Block',
      setting: 'componentType',
      aspects: {
        'aspect-text-block': { class: 'text-block' }
      }
    },
    {
      label: 'Image',
      value: 'image',
      markup: '<i class="fa fa-image"></i> Image',
      setting: 'componentType',
      aspects: {
        'aspect-file': { class: 'file' },
        'aspect-image': { class: 'image' },
        'aspect-area': { class: 'area' } // ,
        // 'aspect-bordered': { class: 'bordered' }
      }
    },
    {
      label: 'Video',
      value: 'video',
      markup: '<i class="fa fa-video-camera"></i> Video',
      setting: 'componentType',
      aspects: {
        'aspect-file': { class: 'file' },
        'aspect-video': { class: 'video' },
        'aspect-area': { class: 'area' }
      }
    },
    {
      label: 'Attachment',
      value: 'attachment',
      markup: '<i class="fa fa-file"></i> Attachment',
      setting: 'componentType',
      aspects: {
        'aspect-file': { class: 'file' },
        'aspect-linktext': { class: 'linktext' }
      }
    }
    // {
    //   label: 'VCard',
    //   value: 'vcard',
    //   markup: '<i class="fa fa-user"></i> VCard',
    //   setting: 'componentType',
    //   aspects: {
    //     'aspect-person': { class: 'vcard' },
    //     'aspect-location': { class: 'location' }
    //   }
    // }
    // ,
    // {
    //   label: 'Link',
    //   value: 'link',
    //   markup: '<i class="fa fa-link"></i> Link',
    //   setting: 'componentType',
    //   aspects: {
    //     'aspect-link-component': { class: 'link' }
    //   }
    // },
    // {
    //   label: 'Link to List',
    //   value: 'link-to-list',
    //   markup: '<i class="fa fa-link"></i><i class="fa fa-list"></i> Link to List',
    //   setting: 'componentType',
    //   aspects: {
    //     'aspect-contract-consumer': { class: 'contract-consumer' },
    //     'aspect-link-component': { class: 'link' }
    //   }
    // },
    // {
    //   label: 'Actions',
    //   value: 'actions-list',
    //   markup: '<i class="fa fa-pencil-square-o"></i> Actions List',
    //   setting: 'componentType',
    //   aspects: {
    //     'aspect-actions-list-component': { class: 'actions-list' },
    //   }
    // },
    // {
    //   label: 'Actions CTA',
    //   value: 'actions-cta',
    //   markup: '<i class="fa fa-thumb-tack"></i> Actions CTA',
    //   setting: 'componentType',
    //   aspects: {
    //     'aspect-contract-consumer': { class: 'contract-consumer' },
    //     'aspect-link-component': { class: 'link' },
    //     'aspect-list-count': { class: 'count' }
    //   }
    // },
    // {
    //   label: 'Any List',
    //   value: 'any-list',
    //   markup: '<i class="fa fa-cubes"></i> Any List',
    //   setting: 'componentType',
    //   aspects: {
    //     'aspect-contract-consumer': { class: 'contract-consumer' },
    //     'aspect-list-templated': { class: 'list' }
    //   }
    // }
  ])
  // List of available row/column layouts
  .constant('LayoutOptions', [
    //Horizontal
    { group: '-Horizontal-', label: '100% Width', value: 'single' },
    { group: '-Horizontal-', label: 'Left Sidebar', value: 'sidebar-left' },
    { group: '-Horizontal-', label: 'Right Sidebar', value: 'sidebar-right' },
    { group: '-Horizontal-', label: '50/50', value: 'fifty-fifty' },
    { group: '-Horizontal-', label: 'Three-Up', value: 'triple' },
    { group: '-Horizontal-', label: 'Quad', value: 'quad' },
    { group: '-Horizontal-', label: 'Side / Main / Side', value: 'side-main-side' },
    { group: '-Horizontal-', label: 'Double-Right', value: 'double-up-right' },
    { group: '-Horizontal-', label: 'Double-Left', value: 'double-up-left' },

    // { label: '<hr/>', value: '---' },

    { group: '-Vertical-', label: 'Fill First Section', value: 'fill-first' },
    { group: '-Vertical-', label: 'Fill Last Section', value: 'fill-last' },
    { group: '-Vertical-', label: 'Hamburger Buns', value: 'hamburger-buns' },
    { group: '-Vertical-', label: 'Panini', value: 'panini' },
    { group: '-Vertical-', label: 'Even / Steven', value: 'even-steven' }
  ])
  // Aspects / properties available to content components
  .constant('ComponentAspects', [
    {
      interfaces: { 'aspect-heading-size': 'aspectHeadingSize' },
      base: { 'headingSize': {} },
      terser: {
        'headingSize': {
          order: 1,
          editType: 'select',
          // toggleExpression: 'true',
          selection: {},
          options: [
            { label: 'Largest', value: 'h1', markup: '<h1>Largest</h1>' },
            { label: 'Larger', value: 'h2', markup: '<h2>Larger</h2>' },
            { label: 'Large', value: 'h3', markup: '<h3>Large</h3>' },
            { label: 'Normal', value: 'h4', markup: '<h4>Normal</h4>' },
            { label: 'Smaller', value: 'h5', markup: '<h5>Smaller</h5>' },
            { label: 'Smallest', value: 'h6', markup: '<h6>Smallest</h6>' }
          ]
        }
      },
      inspector: {
        'headingSize': {
          'templateUrl': 'views-inspectors-{{ editType }}.html'
        }
      },
      labels: { 'headingSize': { 'label': 'Heading Size' } }
    },
    {
      interfaces: { 'aspect-text': 'aspectText' },
      base: { text: {} },
      terser: { 'text': {
          order: 2,
          editType: 'textarea'
        }
      },
      labels: { 'text': { 'label': 'Text' } }
    },
    {
      interfaces: { 'aspect-text-block': 'aspectTextBlock' },
      base: { textblock: {} },
      terser: { 'textblock': {
        order: 3,
        editType: 'textarea'
      }
    },
      labels: { 'textblock': { 'label': 'Text Block' }}
    },
    {
      interfaces: {
        'aspect-image': 'aspectImage'
      },
      base: { 'image': {} },
      terser: {
        'image': {
          order: 1,
          editType: 'file-reference'
        }
      },
      labels: {
        'image': { 'label': 'Image' }
      }
    },
    {
      interfaces: {
        'aspect-video': 'aspectVideo'
      },
      base: { 'image': {} },
      terser: {
        'video': {
          order: 1,
          editType: 'file-reference'
        }
      },
      labels: {
        'video': { 'label': 'Video' }
      }
    },
    {
      interfaces: {
        'aspect-file': 'aspectFile'
      },
      base: { 'file': {} },
      terser: {
        'file': {
          order: 1,
          editType: 'file-reference'
        }
      },
      labels: {
        'file': { 'label': 'File' }
      }
    },
    {
      interfaces: { 'aspect-person': 'aspectPerson' },
      base: {
        name: {},
        email: {}
      },
      terser: {
        name: {
          order: 1,
          editType: 'text'
        },
        email: {
          order: 2,
          editType: 'text'
        }
      },
      labels: {
        name: { 'label': 'Name' },
        email: { 'label': 'Email' }
      }
    },
    {
      interfaces: { 'aspect-location': 'aspectLocation' },
      base: {
        address: {},
        locality: {},
        state: {},
        postCode: {}
      },
      terser: {
        address: {
          order: 3,
          editType: 'text'
        },
        locality: {
          order: 4,
          editType: 'text',
          pattern: '^[A-Za-z]$'
        },
        state: {
          order: 5,
          editType: 'text'
        },
        postCode: {
          order: 6,
          editType: 'text'
        }
      },
      labels: {
        address: { 'label': 'Street Address' },
        locality: { 'label': 'City/Locality' },
        state: { 'label': 'State/Province' },
        postCode: { 'label': 'Postal Code' }
      }
    },
    {
      interfaces: { 'aspect-link': 'aspectLink' },
      base: { linkType: {} },
      terser: {
        linkType: {
          order: 26,
          editType: 'select',
          options: [
            { value: 'linktext', label: 'Text', markup: '<i class="fa fa-text-height"></i> Text' },
            { value: 'image', label: 'Image', markup: '<i class="fa fa-image"></i> Image' },
            { value: 'button', label: 'Button', markup: '<i class="fa fa-square"></i> Button' }
          ]
        },

        // Overrides
        image: {
          toggleExpression: 'linkType.value === "image"'
        },
        height: {
          toggleExpression: 'linkType.value === "image"'
        },
        width: {
          toggleExpression: 'linkType.value === "image"'
        }
      },
      labels: {
        linkType: { label: 'Link Type' }
      }
    },
    {
      interfaces: { 'aspect-linktext': 'aspectLinktext' },
      base: { linkText: {} },
      terser: {
        linkText: {
          order: 27,
          editType: 'text'
        }
      },
      labels: {
        linkText: { label: 'Link Text' }
      }
    },
    {
      interfaces: { 'aspect-contract-consumer': 'aspectContractConsumer' },
      base: { contract: {} },
      terser: {
        contract: {
          order: 0,
          editType: 'select',
          options: [],
        }
      },
      labels: { contract: { label: 'List / Contract' } }
    },
    {
      interfaces: { 'aspect-list-templated': 'aspectListTemplated' },
      base: {
        listTemplate: {}
      },
      terser: {
        listTemplate: {
          order: 25,
          editType: 'text',
          default: 'views-components-json.html'
        }
      },
      labels: {
        listTemplate: {
          label: 'List Template'
        }
      }
    },
    {
      interfaces: { 'aspect-titled': 'aspectTitled' },
      base: {
        titleText: {}
      },
      terser: {
        hasTitle: {
          order: 10,
          editType: 'function-checkbox',
          toggleExpression: 'titleText.value'
        },
        titleText: {
          order: 11,
          editType: 'textarea',
          toggleExpression: 'titleText.value'
        },
      },
      labels: { hasTitle: { label: 'Use Title' }, titleText: { label: 'Title' } }
    },
    {
      interfaces: { 'aspect-formatted-text': 'aspectFormattedText' },
      base: {
        markdownText: { source: {}, compiled: {} },
      },
      terser: {
        markdownText: {
          order: 20,
          editType: 'markdown-textblock'
        }
      },
      labels: {
        markdownText: {
          label: 'Markdown Text'
        }
      }
    },
    {
      interfaces: { 'aspect-actions-list': 'aspectActionsList' },
      terser: {
        titleText: {
          defaultValue: 'Actions'
        },
        itemTemplate: {
          value: 'views-component-actions-item.html'
        },
        listTemplate: {
          value: 'views-component-actions-list.html'
        }
      }
    },
    {
      interfaces: { 'aspect-list-count': 'aspectListCount' },
      base: {
        'showListCount': {}
      },
      terser: {
        'showListCount': {
          order: 40,
          editType: 'checkbox'
        }
      },
      labels: {
        'showListCount': { label: 'Show Count' }
      }
    }
  ])
  // Aspects / properties available to layout components
  .constant('LayoutAspects', [
    {
      interfaces: { 'aspect-labelled': 'aspectLabelled' },
      base: { 'label': {} },
      terser: { 'label': { order: 1, 'editType': 'text' } },
      labels: { 'label': { 'label': 'Label' } }
    },
    {
      interfaces: { 'aspect-layout': 'aspectLayout' },
      base: { 'layout': {} },
      attributes: { 'layout': {
          'attribute': 'layout',
          'valueExpression': 'layout.value'
        }
      },
      terser: {
        'layout': {
          order: 2,
          editType: 'select',
          selection: {},
          options: []
        }
      },
      labels: { 'layout': { 'label': 'Layout' } }
    },
    {
      interfaces: { 'aspect-uploader': 'aspectUploader' },
      base: { 'uploader': {} },
      terser: {
        'uploader': {
          order: 1,
          editType: 'uploader'
        }
      },
      labels: {
        'uploader': { label: 'File Uploader' }
      }
    },
    {
      interfaces: { 'aspect-area': 'aspectArea' },
      base: { 'height': {}, 'width': {} },
      terser: {
        'height': {
          editType: 'text',
          order: 99990
        },
        'width': {
          editType: 'text',
          order: 99991
        }
      },
      labels: {
        'height': { label: 'Set Height' },
        'width': { label: 'Set Width' }
      }
    },
    {
      interfaces: { 'aspect-shadowed': 'aspectShadowed' },
      base: {
        'shadowColor': {
          'color': {},
          'opacity': {}
        },
        'shadowHorizontal': {
          'position': {}
        },
        'shadowVertical': {
          'position': {}
        },
        'shadowBlur': {
          'distance': {}
        },
        'shadowSpread': {
          'size': {}
        },
        'shadowInset': {}
      },
      inform: {
        'hasShadow': {
          informExpression: 'shadowColor.color.value',
          informDecoration: 'complex-shadow'
        }
      },
      terser: {
        'hasShadow': {
          order: 25, editType: 'function-checkbox',
          toggleExpression: 'shadowColor.color.value'
        },
        'shadowColor': {
          order: 26, editType: 'color',
          toggleExpression: 'shadowColor.color.value',
          slider: {
            setting: 'opacity', label: 'opacity', suffix: '%', start: 0, end: 100, step: 10, value: 100
          }
        },
        'shadowVertical': {
          order: 27, editType: 'number-slider',
          toggleExpression: 'shadowColor.color.value',
          slider: {
            setting: 'position', label: 'Vert. Pos.', suffix: 'px', start: 0, end: 20, step: 1, value: 5
          }
        },
        'shadowHorizontal': {
          order: 28, editType: 'number-slider',
          toggleExpression: 'shadowColor.color.value',
          slider: {
            setting: 'position', label: 'Horiz. Pos.', suffix: 'px', start: 0, end: 20, step: 1, value: 5
          }
        },
        'shadowBlur': {
          order: 29, editType: 'number-slider',
          toggleExpression: 'shadowColor.color.value',
          slider: {
            setting: 'distance', label: 'Blur Dist.', suffix: 'px', start: 0, end: 20, step: 1, value: 5
          }
        },
        'shadowSpread': {
          order: 30, editType: 'number-slider',
          toggleExpression: 'shadowColor.color.value',
          slider: {
            setting: 'size', label: 'Spread Size', suffix: 'px', start: 0, end: 20, step: 1, value: 5
          }
        },
        'shadowInset': {
          order: 31, editType: 'checkbox',
          toggleExpression: 'shadowColor.color.value'
        }
      },
      labels: {
        'hasShadow': { label: 'Box Shadow' },
        'shadowColor': { label: 'Color' },
        'shadowHorizontal': { label: 'Horiz. Pos.' },
        'shadowVertical': { label: 'Vert. Pos.' },
        'shadowBlur': { label: 'Blur' },
        'shadowSpread': { label: 'Spread' },
        'shadowInset': { label: 'Inset' }
      }
    },
    {
      interfaces: { 'aspect-bordered': 'aspectBordered' },
      base: {
        'borderColor': {
          'color': {},
          'opacity': {}
        },
        'borderWidth': {
          'width': {}
        },
        'borderSides': {
          'top': {},
          'bottom': {},
          'left': {},
          'right': {}
        },
        'borderRadius': {},
        'borderCircle': {}
      },
      inform: {
        'hasBorder': {
          informExpression: 'borderColor.color.value',
          informDecoration: 'complex-border'
        }
      },
      terser: {
        'hasBorder': {
          order: 20, editType: 'function-checkbox',
          toggleExpression: 'borderColor.color.value'
        },
        borderColor: {
          order: 21, editType: 'color',
          toggleExpression: 'borderColor.color.value',
          slider: { setting: 'opacity', label: 'Opacity', suffix: '%', start: 0, end: 100, step: 10, value: 100 }
          },
        borderWidth: {
          order: 22, editType: 'number-slider',
          toggleExpression: 'borderColor.color.value',
          slider: { setting: 'width', label: 'Width', suffix: 'px', start: 1, end: 10, step: 1, value: 1 }
        },
        borderSides: {
          order: 23, editType: 'sider', top: {}, bottom: {}, left: {}, right: {},
          toggleExpression: 'borderColor.color.value',
          sider: { setting: 'borderSides', default: { bottom: true } }
        },
        borderRadius: {
          order: 24, editType: 'text',
          toggleExpression: 'borderColor.color.value'
        },
        borderCircle: {
          order: 25, editType: 'checkbox',
          toggleExpression: 'borderColor.color.value'
        }
      },
      labels: {
        'hasBorder': { 'label': 'Border' },
        'borderColor': { 'label': 'Border Color' },
        'borderWidth': { 'label': 'Border Width' },
        'borderSides': { 'label': 'Sides' },
        'borderRadius': { 'label': 'Radius' },
        'borderCircle': { 'label': 'Circular' }
      }
    },
    {
      interfaces: { 'aspect-foreground': 'aspectForeground' }
    },
    {
      interfaces: { 'aspect-background': 'aspectBackground' },
      base: {
        'bgColor': {
          color: {},
          opacity: {}
        },
        'fgColor': {
          color: {},
          opacity: {}
        },
        'bgImage': {},
        'bgClass': {}
      },
      inform: {
        'hasBackground': {
          informExpression: 'bgColor.color.value',
          informDecoration: 'complex-background'
        }
      },
      terser: {
        'hasBgColor': { order: 3, editType: 'function-checkbox', toggleExpression: 'bgColor.color.value' },
        'bgColor': {
          order: 4, editType: 'color',
          toggleExpression: 'bgColor.color.value',
          slider: { setting: 'opacity', label: 'Opacity', suffix: '%', start: 0, end: 100, step: 10, value: 100 }
        },
        'hasFgColor': { order: 5, editType: 'function-checkbox', toggleExpression: 'fgColor.color.value' },
        'fgColor': {
          order: 6, editType: 'color',
          toggleExpression: 'fgColor.color.value',
          slider: { setting: 'opacity', label: 'Opacity', suffix: '%', start: 0, end: 100, step: 10, value: 100 }
        },
        'hasBgImage': { order: 7, editType: 'function-checkbox', toggleExpression: 'bgImage.value' },
        'bgImage': { order: 8, editType: 'bg-image-file-loader', toggleExpression: 'bgImage.value' },
        'bgClass': { order: 9, editType: 'select',
          selection: {},
          toggleExpression: 'bgImage.value',
          options: [
            { label: 'fixed', value: 'bg-fixed' },
            { label: 'fixed/cover', value: 'bg-fixed-cover' },
            { label: 'repeat', value: 'bg-repeats' }
          ]
        }
      },
      labels: {
        'hasBgColor': { 'label': 'Background Color' },
        'hasFgColor': { 'label': 'Foreground Color' },
        'hasBgImage': { 'label': 'Background Image' },
        'bgColor': { 'label': 'Background Color' },
        'bgImage': { 'label': 'Upload Image' },
        'bgClass': { 'label': 'Background Type' }
      }
    },
    {
      interfaces: { 'aspect-padded': 'aspectPadded' },
      base: {
        paddingSize: { size: {} },
        paddingSides: {
          top: {},
          right: {},
          bottom: {},
          left: {}
        }
      },
      inform: {
        hasPadding: {
          informExpression: 'paddingSize.size.value',
          informDecoration: 'complex-padding'
        }
      },
      terser: {
        hasPadding: {
          order: 30, editType: 'function-checkbox',
          toggleExpression: 'paddingSize.size.value'
        },
        paddingSize: {
          order: 31, editType: 'number-slider',
          toggleExpression: 'paddingSize.size.value',
          slider: { setting: 'size', label: 'Padding Size', suffix: 'px', start: 1, end: 100, step: 5, value: 10 }
        },
        paddingSides: {
          order: 32, editType: 'sider',
          toggleExpression: 'paddingSize.size.value'
        }
      },
      labels: {
        hasPadding: { label: 'Padded' },
        paddingSize: { label: 'Padding' },
        paddingSides: { label: 'Padding Sides' }
      }
    },
    {
      interfaces: { 'aspect-select-component': 'aspectSelectComponent' },
      base: {
        componentType: {},
      },
      terser: {
        'componentType': { order: 1, editType: 'component-select',
          selection: {},
          options: []
        }
      },
      labels: {
        'componentType': { 'label': 'Component Type' }
      }
    }
  ])
  // Composition pipeline.  Composed objects are created from the aspects they implement
  // Each aspect will express one or more of the pipeline property sets / objects
  // The first item in the pipeline is the name of the empty object which forms the base
  // of the composited object.  The last item in the pipeline is the object which will
  // hold the user-supplied values.  Each item in between the first and last will decorate
  // the composite object with properties necessary for it to be used in the context in
  // which is created.  For example, the pipeline contains 'labels' which provides the
  // label for properties in the inspector view.
  .constant('PIPELINE', ['base','attributes','terser','labels','settings'])
  // Legacy for using the viiFields directive
  .constant('viiModulePath', 'modules/')
  // Path to the inspector / form fields
  .constant('formFieldsTemplate', 'interfaceDesigner/app/templates/inspector/fields.html')
  // Establish the interface designer routing
  // Decorate the Aspects service with aspects-related constants declared here in the app
  // e.g. ComponentList, ContractAspects, ComponentAspects, LayoutAspects, LayoutOptions
  // Decorate select controls with the appropriate options
  //
  // Decoration of Aspects collates the aspect objects into their different aspect vectors.
  // e.g. interfaces, base, terser, etc.  Any vector defined on any aspect will cause a
  // corresponding vector to be created on the Aspects service
  //
  // Set up for lazy / run-time creation of injectables
  .config([

    '$routeProvider',
    '$stateProvider',
    '$filterProvider',
    '$compileProvider',
    '$controllerProvider',
    '$provide',

    function (

      $routeProvider,
      $stateProvider,
      $filterProvider,
      $compileProvider,
      $controllerProvider,
      $provide

    ) {

      /*
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          'layouts': [ 'LayoutService', function (LayoutService) {
            return LayoutService.load('default');
          }]
        }
      })
      .when('/:id', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        resolve: {
          'layouts': [ '$route', 'LayoutService', function ($route, LayoutService) {
            return LayoutService.load($route.current.params.id);
          }]
        }
      });
      */

      $stateProvider
        .state('designer', {
          url: '',
          abstract: true,
          template: '<ui-view/>'
        })
        .state('designer.root', {
          url: '/',
          abstract: true,
          template: '<ui-view/>'
        })
        .state('designer.default', {
          url: '',
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          resolve: {
            'layouts': [ 'LayoutService', function (LayoutService) {
              return LayoutService.load('default');
            }]
          }
        })
        .state('designer.layout', {
          url: '^/:id',
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          resolve: {
            'layouts': [ '$stateParams', 'LayoutService', function ($stateParams, LayoutService) {
              return LayoutService.load($stateParams.id);
            }]
          }
        });

      $provide.decorator('Aspects', [

        '$delegate',

        'ComponentList',
        'ContractAspects',
        'ComponentAspects',
        'LayoutAspects',
        'LayoutOptions',

        function (

          $delegate,

          ComponentList,
          ContractAspects,
          ComponentAspects,
          LayoutAspects,
          LayoutOptions

        ) {

          $delegate.decorate(LayoutAspects);
          $delegate.decorate(ComponentAspects);
          $delegate.decorate(ContractAspects);

          $delegate.terser.aspectLayout.layout.options = LayoutOptions;
          $delegate.terser.aspectSelectComponent.componentType.options = ComponentList;

          return $delegate;

        }

      ]);

      // Enable run-time creation of injectables
      lazyProviders(app, {
        $provide: $provide,
        $filterProvider: $filterProvider,
        $compileProvider: $compileProvider,
        $controllerProvider: $controllerProvider
      });

    }

  ])
  // Set up theme and preload inspector templates
  .run([

    'editableOptions',
    '$templateCache',
    'viiModulePath',
    'formFieldsTemplate',

  function (

    editableOptions,
    $templateCache,

    modulePath,
    formFieldsTemplate

  ) {

    editableOptions.theme = 'default';

    // preload templates
    $templateCache.get(modulePath + formFieldsTemplate);

  }])

  // Add the debug-specific jsonEditor direction
  // TODO: move elsewhere
  .directive('jsonEditor', [

    'LayoutService',

    function (

      LayoutService

    ) {

      var watchValue,
        editors = [];

      return {
        link: function ($scope, $element, $attrs) {

          $element.jsonEditor($scope.$eval($attrs.jsonEditor));

          var el = $element;

          editors.push(el);

          $scope.updateJSON = $scope.updateJSON || function () {

            $scope.layout = LayoutService.layout;

            angular.forEach(editors, function (el, index) {

              var clone = el.clone(),
                data = $scope.$eval(el.attr('json-editor'));

              console.log(data);

              clone.jsonEditor(data);
              el.replaceWith(clone);
              editors[index] = clone;

            });

          };

        }

      };

    }

  ]);

  // Method to set up lazy creation of injectables
  function lazyProviders (app, providers) {

    var $provide = providers.$provide,
      $compileProvider = providers.$compileProvider,
      $controllerProvider = providers.$controllerProvider,
      $filterProvider = providers.$filterProvider;

    var map = {
      controller: { own: true, method: 'register' },
      service: true,
      factory: true,
      filter: { own: true, method: 'register' },
      value: true,
      directive: { own: 'compile' }
    };

    angular.forEach(map, function (provider, providerName) {
      var own = provider.own,
        method = provider.method || providerName,
        pro;

      if ( provider === true || !provider.own ) {
        own = '$provide';
      } else {
        own = '$' + (own === true ? providerName : own) + 'Provider';
      }

      pro = providers[own];

      app['_' + providerName] = app[providerName];

      app[providerName] = function () {
        pro[method].apply(pro, arguments);
        return this;
      };

    });

  }

  // bootstrap button shim
  // TODO: move somewhere better
  $.button = $.fn.button = function (options) {

    var $t = $(this);

    if ( options.icons ) {

      $.each(options.icons, function (value, key) {

        value = value.replace(/(ui-)(.*)(thick$|$)/,'$2');

        $t.prepend($('<i class="icon"></i>').addClass(value));

      });

    }

    return $t;

  };

  $.progressbar = $.fn.progressbar = angular.noop;

}).call(this);
