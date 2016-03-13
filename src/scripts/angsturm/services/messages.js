'use strict';

/**
 * Provides interscope messaging
 */

(function (undefined) {
  
  var root = this;

  angular.module('angsturm.services')
  .factory('AngsturmMessages', [

    function () {

      var listeners = {},
        senders = {};

      return {

        createSender: function ($scope, channel, sender, defaultMessage, direction) {

          var channelId = $scope.$id + '.' + channel,
            targetScope = direction === 'emit' ? $scope : $scope.$root,
            // targetScope = $scope,
            method = '$' + (direction || 'broadcast'),
            sendFn = function (message, channelOverride) {
              targetScope[method](channelOverride || channel, {
                origin: $scope,
                sender: sender,
                value: message || defaultMessage
              });
            },
            s = senders[channelId] = senders[channelId] || [];
          
          s.push(sendFn);

          return sendFn;

        },

        send: function ($scope, channel, sender, message, direction) {
          this.createSender($scope, channel, sender, message, direction)();
        },

        listen: function ($scope, channel, id, fn, scopeCheckExpression, context) {

          var channelId = $scope.$id + '.' + channel + (id ? '.' + id : ''),
            on = $scope.$on(channel, function (event, data) {

              if ( angular.isUndefined(data.origin) ) {
                return;
              }

              var $dataScope = data.origin;

              console.log(channelId,
                $scope.$eval(scopeCheckExpression), $dataScope.$eval(scopeCheckExpression),
                data
              );

              if ( angular.equals(
                $scope.$eval(scopeCheckExpression), $dataScope.$eval(scopeCheckExpression)
                )
              ) {

                fn.call(context || $scope, event, data);

              }

            }),
            l = listeners[channelId] = listeners[channelId] || [];

          l.push(on);

        }

      };

    }

  ]);

}).call(this);