import _ from 'lodash'

import { Grid } from '../../lib/grid'
import { HeightMap } from '../../lib/heightmap'
import { Random } from '../../lib/base';


export const VOLCANO_CHANCE = .006

export const TRENCH = 0
export const ABYSSAL = 1
export const DEEP = 2
export const SHALLOW = 3
export const BANKS = 4
export const BASIN = 5
export const PLAIN = 6
export const HIGHLAND = 7
export const TABLE = 8
export const HILL = 9
export const MOUNTAIN = 10

export const VOLCANO = 'V'
export const DEPRESSION = 'D'


const HEIGHT_TABLE = [
    { minHeight:   0, mapTo: TRENCH },
    { minHeight:   2, mapTo: ABYSSAL },
    { minHeight:  20, mapTo: DEEP },
    { minHeight:  94, mapTo: BASIN },
    { minHeight:  95, mapTo: BANKS },
    { minHeight:  96, mapTo: DEEP },
    { minHeight: 115, mapTo: SHALLOW },
    { minHeight: 150, mapTo: BASIN },
    { minHeight: 151, mapTo: BANKS },
    { minHeight: 153, mapTo: SHALLOW },
    { minHeight: 175, mapTo: BASIN },
    { minHeight: 198, mapTo: PLAIN },
    { minHeight: 235, mapTo: HIGHLAND },
    { minHeight: 236, mapTo: TABLE },
    { minHeight: 237, mapTo: HIGHLAND },
    { minHeight: 252, mapTo: HILL },
    { minHeight: 254, mapTo: HIGHLAND },
    { minHeight: 257, mapTo: MOUNTAIN },
]

export const RELIEF_MAP = {
    [TRENCH]:     { id: TRENCH,     color: "#000023", name: "Trench" },
    [ABYSSAL]:    { id: ABYSSAL,    color: "#000034", name: "Abyssal" },
    [DEEP]:       { id: DEEP,       color: "#000045", name: "Deep" },
    [SHALLOW]:    { id: SHALLOW,    color: "#000078", name: "Shallow" },
    [BANKS]:      { id: BANKS,      color: "#2d3806", name: "Banks" },
    [BASIN]:      { id: BASIN,      color: "#0a5816", name: "Basin" },
    [PLAIN]:      { id: PLAIN,      color: "#31771a", name: "Plain" },
    [HIGHLAND]:   { id: HIGHLAND,   color: "#6f942b", name: "Highland" },
    [HILL]:       { id: HILL,       color: "#AAAAAA", name: "Hill" },
    [MOUNTAIN]:   { id: MOUNTAIN,   color: "#CCCCCC", name: "Mountain" },
    [TABLE]:      { id: TABLE,      color: "#766842", name: "Table" },
    [VOLCANO]:    { id: VOLCANO,    color: "orange",  name: "Volcano" },
    [DEPRESSION]: { id: DEPRESSION, color: "#5f5c33", name: "Depression" },
}

// TODO:  on region map, build mountains up to, 4, 8 tiles p/region
//        (4 = Peak)
//        (9 = Everest)


export class ReliefMap {
    constructor(size, roughness) {
        this.heightCodeMap = new HeightCodeMap()
        this.heightMap = new HeightMap(size, roughness)
        this.maskHeightMap = new HeightMap(size, roughness)
        this.grid = this._buildGrid(size, this.heightMap)
        this.maskGrid = this._buildGrid(size, this.maskHeightMap)
    }

    _buildGrid(size, heightMap) {
        return new Grid(size, size, point => {
            const height = heightMap.get(point)
            return this.heightCodeMap.get(height)
        })
    }

    isTrench(pt) { return this.get(pt) == TRENCH }
    isAbyss(pt) { return this.get(pt) == ABYSSAL }
    isDeep(pt) { return this.get(pt) == DEEP }
    isShallow(pt) { return this.get(pt) == SHALLOW }
    isBanks(pt) { return this.get(pt) == BANKS }
    isBasin(pt) { return this.get(pt) == BASIN }
    isPlain(pt) { return this.get(pt) == PLAIN }
    isHighland(pt) { return this.get(pt) == HIGHLAND }
    isTable(pt) { return this.get(pt) == TABLE }
    isHill(pt) { return this.get(pt) == HILL }
    isMountain(pt) { return this.get(pt) == MOUNTAIN }
    isVolcano(pt) { return this.get(pt) == VOLCANO }
    isDepression(pt) { return this.get(pt) == DEPRESSION }

    isWater(pt) { return this.get(pt) <= BANKS }
    isLand(pt) { return !this.isWater(pt) }

    getName(point) {
        const code = this.get(point)
        return RELIEF_MAP[code].name
    }

    getColor(point) {
        const code = this.get(point)
        return RELIEF_MAP[code].color
    }

    get(point, enableMask=true) {
        const relief = this.grid.get(point)
        if (enableMask) {
            const maskRelief = this.maskGrid.get(point)
            return ReliefMask.apply(relief, maskRelief)
        }
        return relief
    }
}


class HeightCodeMap {
    constructor(table = HEIGHT_TABLE) {
        this.table = table
        this.map = this._buildMap(table)
    }

    _buildMap() {
        const map = []
        const isLast = index => index == this.table.length - 1
        for (let [index, code] of this.table.entries()) {
            if (isLast(index)) {
                map.push(code.mapTo)
            } else {
                this._pushMapSegment(map, index, code)
            }
        }
        return map
    }

    _pushMapSegment(map, index, code) {
        const maxSegmentHeight = this.table[index + 1].minHeight - 1
        for (let i = code.minHeight; i <= maxSegmentHeight; i++) {
            map.push(code.mapTo)
        }
    }

    get(height) {
        return this.map[height]
    }
}


class ReliefMask {
    static apply(relief, maskRelief) {
        if (relief == MOUNTAIN && Random.chance(VOLCANO_CHANCE)) {
            return VOLCANO
        }
        if (maskRelief > PLAIN) {
            return _.clamp(relief, ABYSSAL, HIGHLAND)
        }
        if (maskRelief == SHALLOW) {
            return _.clamp(relief, ABYSSAL, PLAIN)
        }
        if (maskRelief == BASIN || maskRelief == BANKS) {
            return Math.max(ABYSSAL, relief - 1)
        }
        return relief
    }
}
