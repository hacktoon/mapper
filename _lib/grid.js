

var GridFilter = (function(){
    var smooth = function(originalGrid) {
        var grid = _.cloneDeep(originalGrid);
        originalGrid.map(function(value, point) {
            var neighbours = point.neighbours(),
                sum = _.sumBy(neighbours, function(pt) {
                    return originalGrid.get(pt);
                });
            grid.set(point, Math.round(sum / neighbours.length));
        });
        return grid;
    };

    return {
        smooth: smooth
    };

})();


var Grid = (function(){
    var _Grid = function(){
        this.matrix = [];
        this.width = 0;
        this.height = 0;

        this.get = function(point){
            var x = point.x,
                y = point.y;
            if (x >= this.width){ x %= this.width; }
            if (y >= this.height){ y %= this.height; }
            if (x < 0){ x = this.width - 1 - Math.abs(x+1) % this.width; }
            if (y < 0){ y = this.height - 1 - Math.abs(y+1) % this.height; }
            return this.matrix[y][x];
        };

        this.set = function(point, value){
            var x = point.x,
                y = point.y;
            if (x >= this.width){ x %= this.width; }
            if (y >= this.height){ y %= this.height; }
            if (x < 0){ x = this.width - 1 - Math.abs(x+1) % this.width; }
            if (y < 0){ y = this.height - 1 - Math.abs(y+1) % this.height; }
            this.matrix[y][x] = value;
        };

        this.reset = function(value){
            var self = this,
                value = value || undefined;
            this.map(function(_, point) {
                self.set(point, value);
            });
        };

        this.map = function(callback){
            for(var y = 0; y < this.height; y++){
                for(var x = 0; x < this.width; x++){
                    callback(this.get(Point.new(x, y)), Point.new(x, y));
                }
            }
        };

        this.inEdge = function(point){
            var isTopLeft = point.x === 0 || point.y === 0,
                isBottomRight = point.x === this.width - 1 ||
                              point.y === this.height - 1;
            return isTopLeft || isBottomRight;
        };

        this.oppositeEdge = function(point){
            var x = point.x,
                y = point.y;
            if (! this.inEdge(point)) {
                throw new RangeError("Point not in edge");
            }
            if (point.x === 0) { x = this.width - 1; }
            if (point.x === this.width - 1) { x = 0; }
            if (point.y === 0) { y = this.height - 1; }
            if (point.y === this.height - 1) { y = 0; }
            return Point.new(x, y);
        };

        this.randomPoints = function(numPoints) {
            var numPoints = numPoints || 1,
                chosenPoints = {},
                count = 0;

            while(count < numPoints){
                var x = _.random(0, this.width-1),
                    y = _.random(0, this.height-1),
                    point = Point.new(x, y),
                    hash = point.hash();
                if (chosenPoints[hash] === undefined){
                    chosenPoints[hash] = point;
                    count++;
                }
            }
            return _.values(chosenPoints);
        };
    };

    return {
        _class: _Grid,

        new: function(width, height, default_value) {
            var grid = new _Grid();

            grid.width = width;
            grid.height = height;

            for(var y = 0; y < height; y++) {
                grid.matrix.push([]);
                for(var x = 0; x < width; x++){
                    grid.matrix[y].push(default_value);
                }
            }
            return grid;
        },
        from: function(matrix) {
            var grid = new _Grid();

            grid.matrix = matrix;
            grid.width = matrix[0].length;
            grid.height = matrix.length;

            return grid;
        },
        str: function(grid){
            for(var y = 0; y < grid.height; y++) {
                Log(grid.matrix[y]);
            }
        }
    };
})();
