angular.module('interfaceDesignerApp').service('MockDataModel', function MockDataModel() {
    this.data = [
        {
            gameid: 1,
            opponent: "Tech",
            date: new Date(2014, 4, 7),
            attendance: 2038
        },
        {
            gameid: 2,
            opponent: "State",
            date: new Date(2014, 4, 13),
            attendance: 1655
        },
        {
            gameid: 3,
            opponent: "College",
            date: new Date(2014, 4, 20),
            attendance: 1897
        }        
    ];
    
    this.getData = function() {
        return this.data;
    };
    
    this.setData = function(data) {
        this.data = data;
    };
   
    this.findOne = function(gameid) {
        // find the game that matches that id
        var list = $.grep(this.getData(), function(element, index) {
            return (element.gameid == gameid);
        });
        if(list.length === 0) {
            return {};
        }
        // even if list contains multiple items, just return first one
        return list[0];
    };
   
    this.findAll = function() {
        return this.getData();
    };
    
    // options parameter is an object with key value pairs
    // in this simple implementation, value is limited to a single value (no arrays)
    this.findMany = function(options) {
        // find games that match all of the options
        var list = $.grep(this.getData(), function(element, index) {
            var matchAll = true;
            $.each(options, function(optionKey, optionValue) {
                if(element[optionKey] != optionValue) {
                    matchAll = false;
                    return false;
                }
            });
            return matchAll;
        });        
    };
    
    // add a new data item that does not exist already
    // must compute a new unique id and backfill in
    this.addOne = function(dataItem) {
        // must calculate a unique ID to add the new data
        var newId = this.newId();
        dataItem.gameid = newId;
        this.data.push(dataItem);
        return dataItem;
    };
    
    // return an id to insert a new data item at
    this.newId = function() {
        // find all current ids
        var currentIds = $.map(this.getData(), function(dataItem) { return dataItem.gameid; });
        // since id is numeric, and we will treat like an autoincrement field, find max
        var maxId = Math.max.apply(Math, currentIds);
        // increment by one
        return maxId + 1;
    };
    
    this.updateOne = function(gameid, dataItem) {
        // find the game that matches that id
        var games = this.getData();
        var match = null;
        for (var i=0; i < games.length; i++) {
            if(games[i].gameid == gameid) {
                match = games[i];
                break;
            }
        }
        if(!angular.isObject(match)) {
            return {};
        }
        angular.extend(match, dataItem);
        return match;
    };
    
    this.deleteOne = function(gameid) {
        // find the game that matches that id
        var games = this.getData();
        var match = false;
        for (var i=0; i < games.length; i++) {
            if(games[i].gameid == gameid) {
                match = true;
                games.splice(i, 1);
                break;
            }
        }
        return match;
    };
    
});