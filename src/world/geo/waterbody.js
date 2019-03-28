import _ from 'lodash'

import { ScanlineFill, Grid } from '../../lib/grid'
import { Name } from '../../lib/name'


const EMPTY_VALUE = 0
const OCEAN = 0
const SEA = 1
const LAKE = 2


export class WaterbodyMap {
    constructor(world) {
        this.world = world
        this.nextId = 1
        this.grid = new Grid(world.size, world.size, EMPTY_VALUE)
        this.idMap = {}
        this.minOceanArea = world.area / 10
        this.minSeaArea = world.area / 50
        this.riverSources = []
    }

    get(point) {
        let id = this.grid.get(point)
        return this.idMap[id]
    }

    /* Detect oceans, seas and lakes */
    detect(startPoint) {
        let tileCount = 0
        const isFillable = point => {
            let tile = this.world.get(point)
            let isEmpty = this.grid.get(point) == EMPTY_VALUE
            return tile.relief.isBelowSeaLevel && isEmpty
        }
        const onFill = point => {
            this.grid.set(point, this.nextId)
            tileCount++
        }

        if (isFillable(startPoint)) {
            new ScanlineFill(this.world.grid, startPoint, onFill, isFillable).fill()
            this._buildWaterBody(this.nextId++, startPoint, tileCount)
            return
        }
    }

    _buildWaterBody(id, point, tileCount) {
        if (tileCount == 0) return

        let name = Name.createWaterBodyName()
        let type = LAKE

        if (this._isOceanType(tileCount)) {
            type = OCEAN
        } else if (this._isSeaType(tileCount)) {
            type = SEA
        }
        let waterBody = new WaterBody(id, type, name, point, tileCount)
        this.idMap[id] = waterBody
    }

    _isOceanType(tileCount) {
        return tileCount >= this.minOceanArea
    }

    _isSeaType(tileCount) {
        return !this._isOceanType(tileCount) && tileCount >= this.minSeaArea
    }
}


class WaterBody {
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
