'use strict';
/* global Dropbox, loadImage */

(function (undefined) {
  
  var root = this;

  angular.module('commonApp.directives')
  .directive('dropboxDropin', [

    '$q',

    function ($q) {

      var loadImageOptions = { canvas: true };

      return {
        controller: function ($scope, $element, $attrs) {

          var options = $scope.$eval($attrs.dropboxDropinOptions) || {};

          function callIt (method, args) {
            args = angular.isArray(args) ? args : [args];
            
            if ( angular.isString(options[method]) ) {
              options[method] = $scope.$eval(options[method]);
            }

            if (angular.isFunction(options[method])) {
              options[method].apply($scope, args.concat([$scope, $element, $attrs]));
            }
          }

          function onChosen (files) {
            var result;

            if (options.multiselect) {
              result = files.map(function (v) {
                return v.link;
              });
            } else {
              result = files[0].link;
            }

            callIt('chosen', result);
          }

          function onCancel () {
            callIt('cancel');
          }

          function onSaved () {
            callIt('saved');
          }

          function onProgress () {
            callIt('progress');
          }

          function onError (msg) {
            callIt('error');
          }

          function onChoose ($event) {
            callIt('beforeChoose');

            Dropbox.choose({
              success: onChosen,
              cancel: onCancel,
              linkType: 'direct',
              multiselect: false //,
              // extensions: options.exts || options.extensions || ['.png','.jpg','.gif']
            });

            callIt('choose');
          }

          function onFilesLoaded (results) {
            var opt = {
              files: results
            };

            // angular.forEach(results, function (result, key) {
            //   opt.files.push({
            //     url: result.toDataURL(),
            //     name: result.name
            //   });

            //   result = null;
            // });
            // results = null;

            Dropbox.save(opt);

            callIt('save');
          }

          function loadFile(files, results) {
              var file = files.shift(),
                
                eachFile = function (canvas) {
                  
                  results.push({ name: this.name, url: canvas.toDataURL() });

                  if (files.length > 0) {
                    loadFile(files, results);
                    return;
                  }
                  onFilesLoaded(results);

                }.bind(file),

                canvas = loadImage(file, eachFile, loadImageOptions);
          }

          function onSave ($event, data) {
            callIt('beforeSave');

            var results = [];

            loadFile(data.files, results);
          }

          function localFileUrl (name, opt, canvas) {
            opt.files.push({ url: canvas.toDataURL(), name: name });

            var $et = $(this.target);
            $('canvas', $et).remove();
            
            canvas = null;
          }

          var DropboxDropin = {
            onChosen: onChosen,
            onCancel: onCancel,
            onSaved: onSaved,
            onProgress: onProgress,
            onError: onError,
            onChoose: onChoose,
            onSave: onSave
          };

          return DropboxDropin;

        },

        link: function ($scope, $element, $attrs, controller) {

          var type = $attrs.dropboxDropin;

          switch (type) {
            case 'chooser':
              $element.on('click', 'button', controller.onChoose);
              break;
            case 'saver':
              $element.append('<input type="file" id="file' + $scope.$index + '" />');
              $element.fileupload({
                canvas: true,
                change: controller.onSave,
                progress: controller.onProgress,
                error: controller.onError
              }).addClass('fileinput-button');
              break;
          }

        }

      };

    }

  ]);

}).call(this);