
var TectonicsPainter = (function () {
    var _TectonicsPainter = function (tectonics, canvas, tilesize) {
        var self = this;
        this.tectonics = tectonics;
        this.canvas = canvas;
        this.tilesize = tilesize;
        this.ctx = canvas.getContext("2d");
        this.colorMap = (function () {
            var colors = [];
            _.times(tectonics.plates.length, function () {
                colors.push(RandomColor());
            })
            return colors;
        })();

        this.drawPoint = function(point, color) {
            var point = self.tectonics.grid.wrap(point),
                ts = self.tilesize;
            self.ctx.fillStyle = color;
            self.ctx.fillRect(point.x * ts, point.y * ts, ts, ts);
        };

        this.drawEdges = function(color) {
            _.each(self.tectonics.plates, function (plate) {
                plate.forEachEdge(function (point) {
                    self.drawPoint(point, color || "#000");
                });
            });
        };

        this.drawEdgesByDirection = function(direction, color) {
            _.each(self.tectonics.plates, function (plate) {
                plate.forEachEdgeInDirection(direction, function (point) {
                    self.drawPoint(point, color);
                });
            });
        };

        this.draw = function(label) {
            var grid = self.tectonics.grid,
                label = _.defaultTo(label, true),
                ts = self.tilesize;

            canvas.width = grid.width * ts;
            canvas.height = grid.height * ts;

            grid.forEach(function (value, point) {
                var color = self.colorMap[value] || '#FFF';
                self.drawPoint(point, color);
            });

            if (label)
                drawLabel();
        };

        var drawLabel = function(){
            _.each(self.tectonics.plates, function (plate) {
                var symbol = Direction.getSymbol(plate.direction),
                    text = symbol + plate.speed +"S\n"+plate.density+"D",
                    point = plate.region.startPoint,
                    x = self.tilesize * point.x,
                    y = self.tilesize * point.y;
                self.ctx.fillStyle = "white";
                self.ctx.font = "20px Arial";
                self.ctx.strokeStyle = "black";
                self.ctx.fillText(text, x, y);
                self.ctx.strokeText(text, x, y);
            });
        };
    };

    return {
        _class: _TectonicsPainter,
        new: function (tectonics, canvas, tilesize) {
            return new _TectonicsPainter(tectonics, canvas, tilesize);
        }
    };
})();
