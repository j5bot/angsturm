(function (undefined) {
  
  'use strict';

  function StateLocationService(location, state, stateHistoryService) {
    this.location = location;
    this.state = state;
    this.stateHistoryService = stateHistoryService;
  }

  StateLocationService.prototype.preventCall = [];

  StateLocationService.prototype.locationChange = function() {
    var entry;
    if (this.preventCall.pop('locationChange') !== null) {
      return;
    }
    entry = this.stateHistoryService.get(this.location.url());
    if (entry === null) {
      return;
    }
    this.preventCall.push('stateChange');
    return this.state.go(entry.name, entry.params, {
      location: false
    });
  };

  StateLocationService.prototype.stateChange = function() {
    var entry, url;
    if (this.preventCall.pop('stateChange') !== null) {
      return;
    }
    entry = {
      name: this.state.current.name,
      params: this.state.params
    };
    url = '/' + this.state.params.subscriptionUrl + '/' + (Math.guid().substr(0, 8));
    this.stateHistoryService.set(url, entry);
    this.preventCall.push('locationChange');
    return this.location.url(url);
  };

  angular.module('angsturm.services').service('stateLocationService', [
    '$location', '$state', 'stateHistoryService',
    StateLocationService
  ]);

}).call(this);