
var World = (function(){
    var _World = function (roughness, plates){
        var self = this;

        this.size = 257;
        this.area = Math.pow(this.size, 2);
        this.terrainMap = TerrainMap.new(this.size, roughness);
        this.tectonicsMap = TectonicsMap.new(this.size, plates);
        this.heatMap = HeatMap.new(this.size);
        this.rainMap = RainMap.new(this.size, roughness/2);
    };

    return {
        new: function (roughness, plates) {
            var world = new _World(roughness, plates);
            WorldFilter.apply(world);
            world.tectonicsMap.buildPlates(); // change to setPoint - add to other maps
            return world;
        }
        /**
         * HeightMapCreation(function(point, value){
         *      TerrainMap.setHeight(point, value)
         * })
         * .PlateDeformation(function(point, value){
         *      TerrainMap.setPoint(point, value)
         * })
         */
    };
})();


var WorldFilter = (function(){
    var smoothPoint = function (grid, point) {
        var neighborhood = PointNeighborhood.new(point),
            neighborCount = 0,
            sum = 0;
        neighborhood.around(function (neighbor) {
            sum += grid.get(neighbor);
            neighborCount++;
        });
        return Math.round(sum / neighborCount);
    };

    var apply = function (world) {
        var originalGrid = world.terrainMap.heightMap.grid,
            newGrid = _.cloneDeep(originalGrid),
            height = 0;
        originalGrid.forEach(function (value, point) {
            height = smoothPoint(originalGrid, point);
            height = world.terrainMap.getNormalizedHeight(height);
            newGrid.set(point, height);
        });
        world.terrainMap.heightMap.grid = newGrid;
    };

    return {
        apply: apply
    };

})();
