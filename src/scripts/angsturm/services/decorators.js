(function (undefined) {
  
  var root = this;

  angular.module('interfaces.decorator', [])
  .service('AspectDecorator', [

    'Aspects',

      function ( Aspects ) {

        return Aspects.decorate(
          [
            {
              interfaces: { 'aspect-labelled': 'aspectLabelled' },
              base: { 'label': {} },
              terser: { 'label': { 'editType': 'text' } },
              labels: { 'label': { 'label': 'Label' } }
            },
            {
              interfaces: { 'aspect-layout': 'aspectLayout' },
              base: { 'layout': {} },
              terser: {
                'layout': { editType: 'select',
                  selection: {},
                  options: {}
                }
              },
              labels: { 'layout': { 'label': 'Layout' } }
            },
            {
              interfaces: { 'aspect-container': 'aspectContainer' },
              base: {
                // 'bgColor': {
                //   color: {},
                //   opacity: {}
                // },
                // 'fgColor': {
                //   color: {},
                //   opacity: {}
                // },
                // 'bgImage': {},
                // 'bgClass': {}
              },
              terser: {
                // 'hasBgColor': { editType: 'function-checkbox', value: Aspects.fn.has.bind('bgColor') },
                // 'bgColor': { editType: 'color', color: {}, opacity: {} },
                // 'hasFgColor': { editType: 'function-checkbox', value: Aspects.fn.has.bind('fgColor') },
                // 'fgColor': { editType: 'color' },
                // 'hasBgImage': { editType: 'function-checkbox', value: Aspects.fn.has.bind('bgImage') },
                // 'bgImage': { editType: 'bg-image-file-loader' },
                // 'bgClass': { editType: 'select',
                //   selection: {},
                //   toggleExpression: 'field.source().properties.bgImage',
                //   options: [
                //     { label: 'fixed', value: 'bg-fixed' },
                //     { label: 'fixed/cover', value: 'bg-fixed-cover' },
                //     { label: 'repeat', value: 'bg-repeats' }
                //   ]
                // }
              }
            },
            {
              interfaces: { 'aspect-component': 'aspectComponent' },
              base: {
                componentType: {},
                settings: {}
              },
              terser: {
                'componentType': { editType: 'component-select',
                  selection: {},
                  options: {}
                }
              }
            },
            {
              interfaces: {
                'aspect-column': ['aspect-labelled', 'aspect-container']
              }
            },
            {
              interfaces: {
                'aspect-row': ['aspect-labelled', 'aspect-layout', 'aspect-container']
              }
            }
          ]
        );
      }
    ]
  );


}).call(this);