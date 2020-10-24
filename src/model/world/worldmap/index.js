import Tile from './tile'
import { Grid } from '/lib/grid'
import { Name } from '/lib/name'
import { Random } from '/lib/random'
import { Type } from '/lib/type'
import { MetaClass } from '/lib/meta'

import { ReliefMap } from './geo/relief'
import { Diagram } from './image'


export default class WorldMap {
    static meta = new MetaClass(
        Type.number("Roughness", 8),
        Type.number("Size", 257, {min: 1, step: 1}),
        Type.seed("Seed", '')
    )
    static Diagram = Diagram

    static create(data) {
        const config = WorldMap.meta.parseConfig(data)
        Random.seed = config.seed
        const reliefMap = new ReliefMap(config.size, config.roughness)
        const grid = new Grid(config.size, config.size, point => new Tile(point))
        return new WorldMap(reliefMap, grid, config)
    }

    constructor(reliefMap, grid, config) {
        this.name = Name.createLandmassName()
        this.seed = config.seed
        this.size = config.size
        this.width = config.size
        this.height = config.size
        this.area = config.size * config.size
        this.grid = grid
        this.reliefMap = reliefMap
    }

    get(point) {
        return this.grid.get(point)
    }
}