import { Schema, Type } from '/lib/schema'
import { BaseFloodFill, OrganicFloodFill } from '/lib/floodfill/base'
import { FillMap } from '/lib/floodfill'
import { Grid } from '/lib/grid'
import { RandomPointDistribution } from '/lib/point/distribution'
import { BaseMap } from '/model/lib/map'
import { MapDiagram } from './diagram'


export default class FloodFillMap extends BaseMap {
    static id = 'FloodFillMap'

    static schema = new Schema(
        Type.number('width', 'Width', 200, {step: 1, min: 1}),
        Type.number('height', 'Height', 150, {step: 1, min: 1}),
        Type.number('count', 'Count', 15, {step: 1, min: 1}),
        Type.number('iterations', 'Iterations', 30, {step: 1, min: 1}),
        Type.number('variability', 'Variability', 0.5, {
            step: 0.01, min: 0.01, max: 1}),
        Type.text('seed', 'Seed', '')
    )
    static diagram = MapDiagram

    static create(params) {
        return new FloodFillMap(params)
    }

    constructor(params) {
        super(params)
        this.count = params.get('count')
        this.iterations = params.get('iterations')
        this.variability = params.get('variability')
        this.grid = new Grid(this.width, this.height, () => 0)
        const origins = RandomPointDistribution.create(
            this.count, this.width, this.height
        )
        const fills = this.buildFloodFills(this.grid, origins)
        const fillMap = new FillMap(fills)

        while(fillMap.canGrow()) {
            fillMap.grow()
        }
    }

    buildFloodFills(grid, origins) {
        const fills = []
        for(let i = 0; i < origins.length; i++) {
            const params = {
                isEmpty:   point => grid.get(point) === 0,
                setValue:  point => grid.set(point, i + 1),
            }
            const fill = new OrganicFloodFill(
                origins[i], params, this.iterations, this.variability
            )
            fills.push(fill)
        }
        return fills
    }

    get(point) {
        return this.grid.get(point)
    }
}