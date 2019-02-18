

var TectonicsMap = (function() {
    var _TectonicsMap = function (size, numPlates) {
        var self = this;

        this.grid = Grid.new(size, size);
        this.plates = [];
        this.plateIdMap = {};
        this.onPlatePointCallback = _.noop
        this.onPlateEdgeCallback = _.noop

        this.onPlatePoint = function (callback) {
            self.onPlatePointCallback = function(point, fillValue) {
                var plate = self.plateIdMap[fillValue];
                callback(point, plate);
            };
        };

        this.onPlateEdge = function (callback) {
            self.onPlateEdgeCallback = function(point) {
                callback(point);
            };
        };

        this.getPlateById = function (id) {
            return self.plateIdMap[id];
        };

        /* Grow the plates until all them complete. */
        this.build = function (times, chance, isPartial) {
            var totalCompleted = 0,
                completedMap = {};

            initPlates();
            while (totalCompleted < self.plates.length) {
                self.plates.forEach(function(plate) {
                    if (plate.region.isComplete()) {
                        totalCompleted += completedMap[plate.id] ? 0 : 1;
                        completedMap[plate.id] = 1;
                        return;
                    }
                    plate.region.grow(times, chance, isPartial);
                });
            }
        };

        var initPlates = function() {
            GridPointDistribution(self.grid, numPlates, function (point, plateId) {
                var plate = Plate.new(plateId);
                plate.region = GridFill.new(self.grid, plateId);
                plate.region.onPointFill(self.onPlatePointCallback);
                plate.region.onEdgeDetect(self.onPlateEdgeCallback);
                self.plateIdMap[plateId] = plate;
                plate.region.startAt(point);
                self.plates.push(plate);
            });
        };

        this.forEachPlate = function(callback) {
            self.plates.forEach(callback);
        };
    };

    return {
        new: function (size, numPlates) {
            return new _TectonicsMap(size, numPlates);
        }
    };
})();


var Plate = (function() {
    var _Plate = function(id) {
        var self = this;
        this.id = id;
        this.region = undefined;
        this.speed = _.sample([1, 2, 3]);
        this.density = _.sample([1, 1, 2, 2, 3]);
        this.direction = Direction.randomCardinal();

        this.forEachEdge = function(callback) {
            self.region.edges(callback);
        };

        this.forEachSeed = function(callback) {
            self.region.seeds(callback);
        };
    };

    return {
        new: function(id) {
            return new _Plate(id);
        }
    };
})();


var PlateDeformation = (function() {
    var _PlateDeformation = function (plate) {
        var self = this,
            directionPenalty = 300;
        this.plate = plate;

        this.between = function (plate) {
            var direction = self.plate.direction;
            if (Direction.isDivergent(direction, plate.direction)) {
                return -directionPenalty;
            } else if (Direction.isConvergent(direction, plate.direction)) {
                return directionPenalty;
            }
            return 0;
        };
    };

    return {
        new: function(target_plate) {
            return new _PlateDeformation(target_plate);
        }
    };
})();
