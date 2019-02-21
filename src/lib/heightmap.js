
var HeightMap = (function(){
    var _HeightMap = function (size, roughness){
        var self = this;
        this.grid = new Grid(size, size, 0);
        this.callback = _.noop

        this.build = function (callback){
            self.callback = callback;
            setInitialPoints();

            for(var midSize = size - 1; midSize/2 >= 1; midSize /= 2){
                var half = midSize / 2,
                    scale = roughness * midSize;

                for (var y = half; y < size-1; y += midSize) {
                    for (var x = half; x < size-1; x += midSize) {
                        var variance = _.random(-scale, scale),
                            point = Point.new(x, y);
                        square(point, half, variance);
                    }
                }

                for (var y = 0; y <= size-1; y += half) {
                    for (var x = (y + half) % midSize; x <= size-1; x += midSize) {
                        var variance = _.random(-scale, scale),
                            point = Point.new(x, y);
                        diamond(point, half, variance);
                    }
                }
            }
            delete this.grid;
        };

        var setInitialPoints = function () {
            var maxIndex = size - 1;
            var rand = function () { return _.random(0, size); }
            setPoint(Point.new(0, 0), rand());
            setPoint(Point.new(maxIndex, 0), rand());
            setPoint(Point.new(0, maxIndex), rand());
            setPoint(Point.new(maxIndex, maxIndex), rand());
        };

        var diamond = function (point, midSize, offset) {
            var x = point.x,
                y = point.y,
                average = averagePoints([
                    Point.new(x, y - midSize),      // top
                    Point.new(x + midSize, y),      // right
                    Point.new(x, y + midSize),      // bottom
                    Point.new(x - midSize, y)       // left
                ]);
            setPoint(point, average + offset);
        };

        var square = function (point, midSize, offset) {
            var x = point.x,
                y = point.y,
                average = averagePoints([
                    Point.new(x - midSize, y - midSize),   // upper left
                    Point.new(x + midSize, y - midSize),   // upper right
                    Point.new(x + midSize, y + midSize),   // lower right
                    Point.new(x - midSize, y + midSize)    // lower left
                ]);
            setPoint(point, average + offset);
        };

        var setPoint = function (point, height) {
            var height = _.clamp(height, 0, size);
            if (self.grid.isEdge(point)) {
                var oppositeEdge = self.grid.oppositeEdge(point);
                self.grid.set(oppositeEdge, height);
            }
            self.grid.set(point, height);
            self.callback(point, height);
        };

        var averagePoints = function(points) {
            var values = points.map((pt) => self.grid.get(pt));
            values.sort(function (a, b) { return a - b; })
            if (values.length % 2 == 0) {
                var midIndex = (values.length) / 2;
                var first = values[midIndex - 1];
                var second = values[midIndex]
                return Math.round((first + second) / 2);
            } else {
                var index = Math.floor(values.length / 2);
                return values[index];
            }
        };
    };

    return {
        new: function (size, roughness) {
            return new _HeightMap(size, roughness);
        }
    }
})();


var MidpointDisplacement = function (p1, p2, maxSize, roughness, callback) {
    var points = Array(size),
        size = maxSize - 1,
        displacement = roughness * (size / 2);

    var buildPoint = function (p1, p2) {
        if (p2.x - p1.x <= 1) return;
        var x = Math.floor((p1.x + p2.x) / 2),
            y = (p1.y + p2.y) / 2 + _.random(-displacement, displacement);
        y = _.clamp(Math.round(y), 0, maxSize - 1);
        return Point.new(x, y);
    };

    var midpoint = function (p1, p2, size) {
        var point = buildPoint(p1, p2);
        if (!point) return;
        points[point.x] = point;
        callback(point);
        displacement = roughness * size;
        midpoint(p1, point, size / 2);
        midpoint(point, p2, size / 2);
    }

    points[p1.x] = p1;
    callback(p1);
    points[p2.x] = p2;
    callback(p2);

    midpoint(p1, p2, size / 2);
    return points;
};