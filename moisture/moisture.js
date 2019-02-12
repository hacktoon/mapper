
var MoistureMap = (function(){
    var _MoistureMap = function (size, roughness) {
        var self = this;
        this.size = size;

        this.grid = HeightMap(size, roughness);
        this.codeMap = {
            1: {height: 0,   color: "red",       name: "Very dry"},
            2: {height: 30,  color: "coral",     name: "Dry"},
            3: {height: 100, color: "lightblue", name: "Wet"},
            4: {height: 220, color: "blue",      name: "Very wet"}
        };

        this.build = function(){
            self.grid.forEach(function(rawHeight, point){
                _.each(self.codeMap, function(moisture, code){
                    if (rawHeight >= moisture.height) {
                        self.grid.set(point, Number(code));
                    }
                });
            });
        };
    };

    return {
        new: function(size, roughness) {
            var moisture = new _MoistureMap(size, roughness);
            moisture.build();
            return moisture;
        }
    };
})();

