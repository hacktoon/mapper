
const TYPE_TABLE = (function() {
    return [
        { color: "", name: "Ocean" },
        { color: "", name: "Litoral" },
        { color: "", name: "Coral" },
        { color: "", name: "Beach" },
        { color: "", name: "River source" },
        { color: "", name: "River" },
        { color: "", name: "Lake" },
        { color: "", name: "Mangrove" },
        { color: "", name: "Swamp" },
        { color: "", name: "Grassland" },
        { color: "", name: "Shrubland" },
        { color: "", name: "Savanna" },
        { color: "", name: "Forest" },
        { color: "", name: "Taiga" },
        { color: "", name: "Jungle" },
        { color: "", name: "Desert" },
        { color: "", name: "Tundra" },
        { color: "", name: "Mountain" },
        { color: "", name: "Peak" },
        { color: "#FFFFFF", name: "Iceberg" },
        { color: "#FFFFFF", name: "Ice cap" },
    ].map((obj, i) => { obj.id = i; return obj })
})()
window.TYPE_TABLE = TYPE_TABLE


export default class Tile {
    constructor (point) {
        this.point = point
        this.type = undefined
        this.lake = ""
        this.sea = ""
        this.river = ""
        this.ocean = ""
        this.volcano = ""
        this.isLand = true
        this.isWater = false
        this.state = undefined
    }

    setLake(lake) {
        this.lake = lake
    }
}


class TileMap {
    static get(id = null) {

    }
}
