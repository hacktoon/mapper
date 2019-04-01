import _ from 'lodash'

import { Grid } from '../../lib/grid'
import { ScanlineFill } from '../../lib/flood-fill'
import { Name } from '../../lib/name'


const EMPTY_VALUE = 0
const OCEAN = 0
const SEA = 1
const LAKE = 2


export class WaterbodyMap {
    constructor(reliefMap, moistureMap, world) {
        this.nextId = 1
        this.world = world
        this.reliefMap = reliefMap
        this.grid = new Grid(reliefMap.size, reliefMap.size, EMPTY_VALUE)
        this.map = {}
        this.minOceanAreaPercentage = 8
        this.minSeaAreaPercentage = 1
        this.riverSources = []
    }

    get(point) {
        let id = this.grid.get(point)
        return this.map[id]
    }

    /* Detect oceans, seas and lakes */
    detect(startPoint) {
        let tileCount = 0
        const isFillable = point => {
            let tile = this.world.get(point)
            let isEmpty = this.grid.get(point) == EMPTY_VALUE
            return tile.relief.isWater && isEmpty
        }
        const onFill = point => {
            this.grid.set(point, this.nextId)
            tileCount++
        }

        if (isFillable(startPoint)) {
            new ScanlineFill(this.world.grid, startPoint, onFill, isFillable).fill()
            this._buildWaterbody(this.nextId++, startPoint, tileCount)
            return
        }
    }

    _buildWaterbody(id, point, tileCount) {
        if (tileCount == 0) return

        let name = Name.createWaterbodyName()
        let type = LAKE

        if (this._isOceanType(tileCount)) {
            type = OCEAN
        } else if (this._isSeaType(tileCount)) {
            type = SEA
        }
        let waterbody = new Waterbody(id, type, name, point, tileCount)
        this.map[id] = waterbody
    }

    _isOceanType(tileCount) {
        let totalTiles = this.world.area
        let tilePercentage = (100 * tileCount) / totalTiles
        return tilePercentage >= this.minOceanAreaPercentage
    }

    _isSeaType(tileCount) {
        let totalTiles = this.world.area
        let tilePercentage = (100 * tileCount) / totalTiles
        let withinPercentage = tilePercentage >= this.minSeaAreaPercentage
        return !this._isOceanType(tileCount) && withinPercentage
    }
}


class Waterbody {
    constructor(id, type, name, point, area) {
        this.id = id
        this.type = type
        this.name = name
        this.point = point
        this.area = area
    }

    get isOcean() { return this.type == OCEAN }
    get isSea() { return this.type == SEA }
    get isLake() { return this.type == LAKE }
}
