import { Schema } from '/lib/base/schema'
import { Type } from '/lib/base/type'
import { Color } from '/lib/base/color'
import { BaseMapDiagram } from '/model/lib/map'


export class MapDiagram extends BaseMapDiagram {
    static schema = new Schema(
        Type.boolean('showBorders', 'Show borders', {default: false}),
        Type.boolean('showNeighbors', 'Show neighbors', {default: false}),
    )

    static create(mapModel, params) {
        return new MapDiagram(mapModel, params)
    }

    constructor(mapModel, params) {
        super(mapModel)
        this.showBorders = params.get('showBorders')
        this.showNeighbors = params.get('showNeighbors')
        this.colorMap = this.buildColorMap()
    }

    buildColorMap() {
        const map = {}
        for(let i = 0; i < this.mapModel.fillCount; i++) {
            map[i] = new Color()
        }
        return map
    }

    get(point) {
        const value = this.mapModel.get(point)
        const showNeighbors = this.showBorders && this.showNeighbors
        if (showNeighbors && this.mapModel.isBorder(point)) {
            const value = this.mapModel.getBorder(point)
            return this.colorMap[value].toHex()
        }
        if (this.showBorders && this.mapModel.isBorder(point)) {
            return this.colorMap[value].darken(40).toHex()
        }
        return this.colorMap[value].toHex()
    }
}