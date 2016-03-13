(function (undefined) {

  'use strict';

  angular.module('interfaceDesignerApp')
  .factory('ColorService', function () {
  var backgroundColors = [
    'transparent',
    'rgba(0,0,0,1)', // black (#000)
    'rgba(34,34,34,1)', // dk gray (#222)
    'rgba(51,51,51,1)', // dk gray (#333)
    'rgba(102,102,102,1)', // dk gray (#666)
    'rgba(119,119,119,1)', // mid gray (#777)
    // 'rgba(147,147,147,1)', // mid gray (#939393)
    'rgba(153,153,153,1)', // mid gray (#999)
    'rgba(170,170,170,1)', // lt. gray (#aaa)
    'rgba(192,192,192,1)', // lt. gray (#c0c0c0)
    'rgba(221,221,221,1)', // lt. gray (#ddd)
    'rgba(239,239,239,1)', // lt. gray (#efefef)
    'rgba(255,255,255,1)', // white (#fff)

    'rgba(209,0,0,1)', // red
    'rgba(255,102,34,1)', // orange
    'rgba(255,218,33,1)', // yellow
    'rgba(51,221,0,1)', // green
    'rgba(17,51,204,1)', // blue
    'rgba(34,0,102,1)', // indigo
    'rgba(51,0,68,1)', // violet

    'rgba(81,87,74,1)',
    'rgba(68,124,105,1)',
    'rgba(116,196,147,1)',    
    'rgba(142,140,109,1)',
    // 'rgba(228,191,128,1)',

    // 'rgba(233,215,142,1)',
    'rgba(226,151,93,1)',
    'rgba(241,150,112,1)',
    'rgba(225,101,82,1)',
    'rgba(201,74,83,1)',
    'rgba(190,81,104,1)',
    'rgba(163,73,116,1)',
    'rgba(153,55,103,1)',
    'rgba(101,56,125,1)',
    'rgba(78,36,114,1)',
    'rgba(145,99,182,1)',
    'rgba(124,159,176,1)',
    'rgba(86,152,196,1)',
    'rgba(154,191,136,1)'    

  ];
  return {
    getColors: function () {
      return backgroundColors;
    }
  };
});
  
}).call(this);
