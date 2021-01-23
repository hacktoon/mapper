import { Schema, Type } from '/lib/schema'
import { Color } from '/lib/color'
import { BaseMapDiagram } from '/model/lib/map'


export class MapDiagram extends BaseMapDiagram {
    static schema = new Schema(
        Type.boolean('showBorders', 'Show borders', true),
        Type.boolean('showOrigins', 'Show origins', true),
        Type.boolean('invertColors', 'Invert colors', false),
        Type.number('showLayer', 'Show layer', 3, {step: 1, min: 0}),
        Type.number('showRegion', 'Show region', -1, {step: 1, min: -1}),
        Type.color('foreground', 'Foreground', Color.fromHex('#251')),
        Type.color('background', 'Background', Color.fromHex('#059')),
        Type.color('borderColor', 'Border color', Color.fromHex('#021')),
    )

    static create(map, params) {
        return new MapDiagram(map, params)
    }

    constructor(map, params) {
        super(map)
        // TODO: set `this.data` and add attributes dynamically
        this.showBorders = params.get('showBorders')
        this.showOrigins = params.get('showOrigins')
        this.showLayer = params.get('showLayer')
        this.foreground = params.get('foreground')
        this.background = params.get('background')
        this.borderColor = params.get('borderColor')
        this.showRegion = params.get('showRegion')
        this.invertColors = params.get('invertColors')
    }

    get(point) {
        const cell = this.map.at(point)
        const isBorder = this.showBorders && cell.isBorder()
        // current layer are seeds
        if (cell.isLayer(this.showLayer)) {
            const bright = isBorder ? 0 : 40
            return this.foreground.brighten(bright).toHex()
        }
        if (this.showOrigins && cell.isOrigin()) {
            return this.foreground.invert().toHex()
        }
        if (isBorder) {
            if (this.map.regionAt(point).id === this.showRegion)
                return this.borderColor.invert().toHex()
            return this.borderColor.toHex()
        }

        const background = this.invertColors ? this.background : this.foreground
        const foreground = this.invertColors ? this.foreground : this.background
        const color = cell.layer > this.showLayer ? foreground : background
        return color.darken(cell.layer * 5).toHex()
    }
}