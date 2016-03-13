(function AngsturmAspectsInterfaces (undefined) {

  'use strict';
  'be excellent to each other';

  var root = this;

  angular.module('angsturm')
  .constant('AspectsInterfaces', {

      'aspect-background': 'aspectBackground',
      'aspect-bordered': 'aspectBordered',
      'aspect-shadowed': 'aspectShadowed',
      'aspect-padded': 'aspectPadded',
      'aspect-labelled': 'aspectLabelled',
      'aspect-layout': 'aspectLayout',
      'aspect-location': 'aspectLocation',
      'aspect-person': 'aspectPerson',
      'aspect-select-component': 'aspectSelectComponent',

      'aspect-container': [
        'aspect-background','aspect-foreground'
      ],
      'aspect-component': [
        'aspect-shadowed',
        'aspect-select-component'
      ],
      'aspect-column': [
        'aspect-bordered',
        'aspect-shadowed',
        'aspect-labelled',
        'aspect-layout',
        'aspect-container',
        'aspect-padded'
      ],
      'aspect-row': [
        'aspect-bordered',
        'aspect-shadowed',
        'aspect-labelled',
        'aspect-layout',
        'aspect-container'
      ],
      'aspect-attachment-component': ['aspect-linktext'],
      'aspect-image-component': [
        'aspect-bordered',
        'aspect-image',
        'aspect-area'
      ],
      'aspect-link-component': [
        'aspect-image-component',
        'aspect-linktext',
        'aspect-link'
      ],
      'aspect-actions-list-component': [
        'aspect-contract-consumer',
        'aspect-titled',
        'aspect-actions-list'
      ]
  });

}).call(this);
