import _ from 'lodash'

import { Grid } from '../../lib/grid';
import { HeightMap } from '../../lib/heightmap'


const DEFAULT_ELEVATION_ID = 0

const ELEVATION_TABLE = [
    { id: 0, height: 0,   color: "#000056", value: 0 },
    { id: 1, height: 80,  color: "#1a3792", value: 1 },
    { id: 2, height: 120, color: "#3379a6", value: 2 },
    { id: 3, height: 150, color: "#0a5816", value: 3 },
    { id: 4, height: 190, color: "#31771a", value: 4 },
    { id: 5, height: 240, color: "#6f942b", value: 5 },
    { id: 6, height: 255, color: "#d5cab4", value: 6 }
]

// remove export
export class Elevation {
    constructor(id) {
        this.data = ELEVATION_TABLE[id]
    }

    get id() { return this.data.id }
    get height () { return this.data.height }
    get value () { return this.data.value }
    get color () { return this.data.color }
    get isBelowSeaLevel () { return this.data.value < 3 } // remove
    get isAboveSeaLevel() { return this.data.value >= 3 } // remove
    get isMiddle () {
        let middle = Math.floor(ELEVATION_TABLE.length / 2)
        return this.data.value == middle
    }

    raise (amount=1) {
        let raisedIndex = this.data.id + amount
        let id = _.clamp(raisedIndex, 0, ELEVATION_TABLE.length-1)
        this.data = ELEVATION_TABLE[id]
    }

    lower (amount=1) {
        let loweredIndex = this.data.id - amount
        let id = _.clamp(loweredIndex, 0, ELEVATION_TABLE.length-1)
        this.data = ELEVATION_TABLE[id]
    }

    isLower (elevation, amount=undefined) {
        return this.data.id < elevation.id
    }

    isHigher(elevation, amount=undefined) {
        return this.data.id > elevation.id
    }

    get isLowest () {
        return this.data.id == _.first(ELEVATION_TABLE).id
    }

    get isHighest () {
        return this.data.id == _.last(ELEVATION_TABLE).id
    }
}


export class ElevationMap {
    constructor(size, roughness) {
        this.size = size
        this.roughness = roughness
        this.grid = new Grid(size, size, DEFAULT_ELEVATION_ID)
        this.gridMask = new HeightMap(size, roughness).grid

        new HeightMap(this.size, this.roughness, (point, height) => {
            let elevation = this.buildElevation(point, height)
            this.grid.set(point, elevation)
        })
    }

    get(point) {
        return this.grid.get(point)
    }

    buildElevation(point, height) {
        let maskHeight = this.gridMask.get(point)
        let maskElevation = this.getElevationByHeight(maskHeight)
        let elevation = this.getElevationByHeight(height)

        if (maskElevation.isMiddle) {
            elevation.lower()
        }
        return elevation
    }

    getElevationByHeight(height) {
        let id = DEFAULT_ELEVATION_ID
        for (let elevationData of ELEVATION_TABLE) {
            if (height >= elevationData.height) {
                id = elevationData.id
            } else {
                break
            }
        }
        return new Elevation(id)
    }
}
