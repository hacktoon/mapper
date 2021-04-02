import { Schema } from '/lib/base/schema'
import { Type } from '/lib/base/type'
import { TileMapDiagram } from '/model/lib/tilemap'


const SCHEMA = new Schema(
    'RegionGroupTileMapDiagram',
    Type.boolean('showGroups', 'Show groups', {default: true}),
    Type.boolean('showGroupBorder', 'Show group border', {default: false}),
    Type.boolean('showRegions', 'Show regions', {default: true}),
    Type.boolean('showRegionLayers', 'Show region layers', {default: true}),
    Type.boolean('showBorderLayers', 'Show border layers', {default: true}),
    Type.boolean('showRegionBorder', 'Show region border', {default: false}),
)


export class RegionGroupTileMapDiagram extends TileMapDiagram {
    static schema = SCHEMA

    static create(tilemap, params) {
        return new RegionGroupTileMapDiagram(tilemap, params)
    }

    constructor(tilemap, params) {
        super(tilemap)
        this.showRegions = params.get('showRegions')
        this.showGroups = params.get('showGroups')
        this.showRegionBorder = params.get('showRegionBorder')
        this.showGroupBorder = params.get('showGroupBorder')
        this.showRegionLayers = params.get('showRegionLayers')
        this.showBorderLayers = params.get('showBorderLayers')
        this.regionColorMap = new RegionColorMap(tilemap.table.regionTileMap)
        this.groupColorMap = new GroupColorMap(tilemap)
    }

    get(point) {
        const region = this.tilemap.getRegion(point)
        const group = this.tilemap.getGroup(point)
        const regionLayer = this.tilemap.getRegionLayer(region)
        const borderLayer = this.tilemap.getBorderRegionLayer(region)
        const regionColor = this.regionColorMap.get(region)
        const groupColor = this.groupColorMap.get(group)
        const isBorderRegion = this.tilemap.isBorderRegion(region)

        if (this.showGroupBorder && this.tilemap.isGroupBorderPoint(point)) {
            return groupColor.brighten(50).toHex()
        }
        if (this.showRegionBorder && this.tilemap.isRegionBorder(point)) {
            let color = this.showGroups ? groupColor.brighten(60) : regionColor.darken(60)
            return color.toHex()
        }
        if (this.showGroups) {
            if (! this.showRegions) return groupColor.toHex()
            let color = regionColor.average(groupColor).average(groupColor)
            if (isBorderRegion) return color.darken(100).toHex()
            if (this.showBorderLayers) {
                color = color.darken(borderLayer * 20)
            }
            if (this.showRegionLayers) {
                color = color.darken(regionLayer * 3)
            }
            return color.toHex()
        }
        if (this.showRegions) {
            let color = isBorderRegion ? regionColor.darken(60) : regionColor
            return color.toHex()
        }
        return regionColor.grayscale().toHex()
    }
}


class RegionColorMap {
    constructor(regionTileMap) {
        const entries = regionTileMap.map(region => [region.id, region.color])
        this.map = Object.fromEntries(entries)
    }

    get(region) {
        return this.map[region.id]
    }
}


class GroupColorMap {
    constructor(groupMap) {
        const entries = groupMap.map(group => [group.id, group.color])
        this.map = Object.fromEntries(entries)
    }

    get(group) {
        return this.map[group.id]
    }
}
