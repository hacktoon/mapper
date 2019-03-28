import _ from 'lodash'

import World from './world'
import { WaterbodyMap } from './geo/waterbody'
import { RiverMap } from './geo/river'
import { ReliefMap } from './geo/relief'
import { HeatMap } from './climate/heat'
import { MoistureMap } from './climate/moisture'


export default class WorldBuilder {
    constructor(size, roughness) {
        this.world = new World(size)
        this.reliefMap = new ReliefMap(size, roughness)
        this.moistureMap = new MoistureMap(size, roughness)
        this.heatMap = new HeatMap(size, .17)
        this.waterbodyMap = new WaterbodyMap(this.world)
        //this.riverMap = new RiverMap(this.world, this.waterbodyMap)
    }

    build() {
        this.world.forEach((tile, point) => {
            tile.relief = this.reliefMap.get(point)
            tile.moisture = this.moistureMap.get(point)
            tile.heat = this.heatMap.get(point)
            this._buildTileClimate(tile)
        })

        this._detectSurface()
        return this.world
    }

    _buildTileClimate(tile) {
        if (tile.relief.isHighest)
            tile.heat.lower(2)
        if (tile.heat.isPolar)
            tile.moisture.lower(3)
        if (tile.heat.isSubtropical)
            tile.moisture.lower(1)
        if (tile.heat.isTropical)
            tile.moisture.raise(2)
    }

    _detectSurface() {
        this.world.forEach((_, point) => {
            this.waterbodyMap.detect(point)
        })

        // this.world.forEach((_, point) => {
        //     this.riverMap.detect(point)
        // })
    }
}
