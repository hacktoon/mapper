
var RainMap = (function(){
    var _RainMap = function (size, roughness) {
        var self = this;
        this.size = size;

        this.grid = HeightMap(size, roughness);
        this.idMap = [
            {height: 0,   color: "red",       name: "Very dry"},
            {height: 30,  color: "coral",     name: "Dry"},
            {height: 90,  color: "lightblue", name: "Wet"},
            {height: 210, color: "blue",      name: "Very wet"}
        ];

        this.build = function(){
            self.grid.forEach(function(rawHeight, point){
                _.each(self.idMap, function(rain, code){
                    if (rawHeight >= rain.height) {
                        self.grid.set(point, Number(code));
                    }
                });
            });
        };
    };

    return {
        new: function(size, roughness) {
            var rain = new _RainMap(size, roughness);
            rain.build();
            return rain;
        }
    };
})();