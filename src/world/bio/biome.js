import Tile from '../tile'


const ICE = 0
const TUNDRA = 1
const BOREAL_FOREST = 2
const TEMPERATE_FOREST = 3
const WOODLANDS = 4
const GRASSLANDS = 5
const RAINFOREST = 6
const JUNGLE = 7
const SAVANNA = 8
const SHRUBLAND = 9
const DESERT = 10
const MESA = 11
const OCEAN = 12
const LAKE = 13
const CORAL_REEF = 14
const RIVER = 15
const MANGROVE = 16
const SWAMP = 17
const BEACH = 18
const MOUNTAIN = 19
const PEAK = 20


const BIOME_TABLE = [
    { id: ICE, color: "#f2f2f2", name: "Ice" },
    { id: TUNDRA, color: "#b7c8c4", name: "Tundra" },
    { id: BOREAL_FOREST, color: "#008066", name: "Boreal forest" },
    { id: TEMPERATE_FOREST, color: "#00aa44", name: "Temperate forest" },
    { id: WOODLANDS, color: "#71c837", name: "Woodlands" },
    { id: GRASSLANDS, color: "#cdde87", name: "Grasslands" },
    { id: RAINFOREST, color: "#338000", name: "Rainforest" },
    { id: JUNGLE, color: "#165016", name: "Jungle" },
    { id: SAVANNA, color: "#abc837", name: "Savanna" },
    { id: SHRUBLAND, color: "#d3bc5f", name: "Shrubland" },
    { id: DESERT, color: "#ffeeaa", name: "Desert" },
    { id: MESA, color: "#9c5a2e", name: "Mesa" },
    { id: OCEAN, color: "#000080", name: "Ocean" },
    { id: LAKE, color: "#0055d4", name: "Lake" },
    { id: CORAL_REEF, color: "#5cffc4", name: "Coral reef" },
    { id: RIVER, color: "#5fbcd3", name: "River" },
    { id: MANGROVE, color: "#876729", name: "Mangrove" },
    { id: SWAMP, color: "#916f8a", name: "Swamp" },
    { id: BEACH, color: "#ffe680", name: "Beach" },
    { id: MOUNTAIN, color: "#b3b3b3", name: "Mountain" },
    { id: PEAK, color: "#FFF", name: "Peak" },
]



export class BiomeMap {
    constructor(reliefMap, heatMap, moistureMap, waterbodyMap) {
        this.reliefMap = reliefMap
        this.heatMap = heatMap
        this.moistureMap = moistureMap
        this.waterbodyMap = waterbodyMap
    }

    get(point) {
        let type = this.getTileType(point)
        return BIOME_TABLE[type]
    }

    getTileType(point) {
        let relief = this.reliefMap.get(point)
        let heat = this.heatMap.get(point)
        let moisture = this.moistureMap.get(point)
        let waterbody = this.waterbodyMap.get(point)

        if (waterbody) {
            const isWater = relief.isAbyss || relief.isShallow || relief.isReef
            if (heat.isArctic && isWater) return ICE
            if (waterbody.isLake || waterbody.isSea) return LAKE
            return OCEAN
        }

        if (relief.isPeak) return PEAK
        if (relief.isMountain) return MOUNTAIN

        if (heat.isArctic) {
            if (moisture.isHighest || moisture.isWet) return ICE
            return TUNDRA
        }

        if (heat.isSubarctic) {
            if (moisture.isHighest || moisture.isWet) return BOREAL_FOREST
            return TUNDRA
        }

        if (heat.isTemperate) {
            if (moisture.isHighest || moisture.isWet) return TEMPERATE_FOREST
            if (moisture.isSeasonal) return WOODLANDS
            return GRASSLANDS
        }

        if (heat.isSubtropical) {
            if (moisture.isHighest) return RAINFOREST
            if (moisture.isWet) return SAVANNA
            if (moisture.isSeasonal) return SHRUBLAND
            if (moisture.isDry) return SHRUBLAND
            if (moisture.isLowest) return DESERT
        }

        if (heat.isTropical) {
            if (moisture.isHighest) return JUNGLE
            if (moisture.isWet) return RAINFOREST
            if (moisture.isSeasonal) return SAVANNA
            if (moisture.isDry) return SHRUBLAND
            if (moisture.isLowest) return DESERT
        }
    }
}



class Biome {
    constructor(type) {
        this.type = type
    }
}