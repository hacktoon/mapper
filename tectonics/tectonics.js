
var TectonicsBuilder = function (world) {
    var self = this,
        map = TectonicsMap.new(world.size),
        growthRate = 15,
        chanceToGrow = true,
        partialGrow = true;

    map.onPlatePoint(function (point, plate) {
        var tile = world.getTile(point);
        tile.plate = plate;
        if (plate.density == 3) {
            world.lowerTerrain(point)
            world.lowerTerrain(point)
            world.lowerTerrain(point)
        }
    });
    map.onPlateEdge(function (point, plate) {
        var tile = world.getTile(point);
        tile.isPlateEdge = true;
    });
    map.initPlates(world.numPlates);
    map.build(growthRate, chanceToGrow, partialGrow);

    return map;
};


var TectonicsMap = (function() {
    var _TectonicsMap = function (size) {
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
                completedMap = {},
                chance = _.defaultTo(chance, false);

            while (totalCompleted < self.plates.length) {
                self.plates.forEach(function(plate) {
                    if (plate.region.isComplete()) {
                        totalCompleted += completedMap[plate.id] ? 0 : 1;
                        completedMap[plate.id] = 1;
                        return;
                    }
                    if (chance && _.sample([true, false]))
                        return;

                    plate.region.grow(times, isPartial);
                });
            }
        };

        this.initPlates = function(numPlates) {
            GridPointDistribution(self.grid, numPlates, function (point, plateId) {
                var plate = Plate.new(plateId);
                var gridFill = GridFill.new(self.grid, plateId);
                gridFill.onPointFill(self.onPlatePointCallback);
                gridFill.onEdgeDetect(self.onPlateEdgeCallback);
                plate.region = gridFill;
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
        new: function (size) {
            return new _TectonicsMap(size);
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
