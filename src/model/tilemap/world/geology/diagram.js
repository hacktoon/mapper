import { Schema } from '/lib/base/schema'
import { Type } from '/lib/base/type'
import { Direction } from '/lib/base/direction'
import { Color } from '/lib/base/color'

import { TileMapDiagram } from '/model/lib/tilemap'
import { Boundary } from './boundary'


export class GeologyTileMapDiagram extends TileMapDiagram {
    static schema = new Schema(
        'GeologyTileMapDiagram',
        Type.boolean('showBoundaries', 'Show boundaries', {default: true}),
        Type.boolean('showPlateBorders', 'Show borders', {default: false}),
        Type.boolean('showDirections', 'Show directions', {default: false}),
    )

    static create(tileMap, params) {
        return new GeologyTileMapDiagram(tileMap, params)
    }

    constructor(tileMap, params) {
        super(tileMap)
        this.showPlateBorders = params.get('showPlateBorders')
        this.showBoundaries = params.get('showBoundaries')
        this.showDirections = params.get('showDirections')
    }

    get(point) {
        const plate = this.tileMap.getPlate(point)
        const isBorderPoint = this.tileMap.isPlateBorder(point)
        const stress = this.tileMap.getStress(point)
        const hex = plate.isOceanic() ? '#058' : '#26a11f'
        const boundary = this.tileMap.getBoundary(point)
        let color = Color.fromHex(hex)

        if (this.showBoundaries) {
            if (boundary && stress < Boundary.getEnergy(boundary)) {
                color = Boundary.getColor(boundary, color)
                if (isBorderPoint && !Boundary.hasBorder(boundary)) {
                    color = Color.fromHex(hex)
                }
            }
        }
        if (this.showPlateBorders && isBorderPoint) {
            color = color.darken(40)
        }
        return color.darken(stress * 3).toHex()
    }

    getText(point) {
        const plate = this.tileMap.getPlate(point)
        if (this.showDirections && this.tileMap.isPlateOrigin(plate, point)) {
            const dir = Direction.getSymbol(plate.direction)
            const dirName = Direction.getName(plate.direction)
            return `${plate.id}:${dir}${dirName}`
        }
    }
}


class PlateColorMap {
    constructor(tileMap) {
        const entries = tileMap.map(plate => {
            let color =  new Color(0, 250, 0).average(plate.color)
            if (plate.isOceanic()) {
                color = new Color(0, 0, 150)
            }
            return [plate.id, color]
        })
        this.map = Object.fromEntries(entries)
    }

    get(plate) {
        return this.map[plate.id]
    }
}