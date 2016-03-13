if (typeof module === "object") module.exports = SortedObjectArray;

SortedObjectArray.prototype.insert = function (element) {
    var array = this.array;
    var index = array.length;
    array.push(element);

    while (index) {
        var i = index, j = --index;

        if (this.getKey(i) < this.getKey(j)) {
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    return this;
};

SortedObjectArray.prototype.getKey = function(index) {
    return this.array[index][this.key];
};

SortedObjectArray.prototype.search = function (element) {
    var elementKey = (typeof(element) === 'object')? element[this.key]: element;

    var low = 0;
    var array = this.array;
    var high = array.length;

    while (high > low) {
        var index = (high + low) / 2 >>> 0;
        var cursor = this.getKey(index);

        if (cursor < elementKey) low = index + 1;
        else if (cursor > elementKey) high = index;
        else return index;
    }

    return -1;
};

SortedObjectArray.prototype.remove = function (element) {
    var index = this.search(element);
    if (index >= 0) this.array.splice(index, 1);
    return this;
};

function SortedObjectArray() {
    var index = 0;

    if (typeof(arguments[0]) != 'object' && arguments[0] != null){
        this.key = arguments[0];
        index = 1;
    } else {
        this.key = 'id';
    }
    
    this.array = [];
    var length = arguments.length;
    
    while (index < length) this.insert(arguments[index++]);
}