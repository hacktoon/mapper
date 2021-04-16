import { Schema } from '/lib/base/schema'
import { Type } from '/lib/base/type'
import { TileMapDiagram } from '/model/lib/tilemap'


const SCHEMA = new Schema(
    'RegionGroupTileMapDiagram',
    Type.boolean('showGroups', 'Show groups', {default: true}),
    Type.boolean('showGroupBorder', 'Show group border', {default: false}),
    Type.boolean('showRegions', 'Show regions', {default: false}),
    Type.boolean('showRegionLayers', 'Show region layers', {default: true}),
    Type.boolean('showGroupLayers', 'Show group layers', {default: true}),
    Type.boolean('showRegionBorder', 'Show region border', {default: false}),
)


export class RegionGroupTileMapDiagram extends TileMapDiagram {
    static schema = SCHEMA

    static create(tileMap, params) {
        return new RegionGroupTileMapDiagram(tileMap, params)
    }

    constructor(tileMap, params) {
        super(tileMap)
        this.showRegions = params.get('showRegions')
        this.showGroups = params.get('showGroups')
        this.showRegionBorder = params.get('showRegionBorder')
        this.showGroupBorder = params.get('showGroupBorder')
        this.showRegionLayers = params.get('showRegionLayers')
        this.showGroupLayers = params.get('showGroupLayers')
        this.regionColorMap = new RegionColorMap(tileMap.data.regionTileMap)
        this.groupColorMap = new GroupColorMap(tileMap)
    }

    get(point) {
        const region = this.tileMap.getRegion(point)
        const group = this.tileMap.getGroup(point)
        const regionLayer = this.tileMap.getRegionLayer(region)
        const groupLayer = this.tileMap.getGroupLayer(region)
        const regionColor = this.regionColorMap.get(region)
        const groupColor = this.groupColorMap.get(group)
        const isBorderRegion = this.tileMap.isBorderRegion(region)

        if (this.showGroupBorder && this.tileMap.isGroupBorderPoint(point)) {
            return groupColor.brighten(50).toHex()
        }
        if (this.showRegionBorder && this.tileMap.isRegionBorder(point)) {
            let color = this.showGroups ? groupColor.brighten(60) : regionColor.darken(60)
            return color.toHex()
        }
        if (this.showGroups) {
            let color = groupColor
            if (this.showRegions)
                color = regionColor.average(groupColor).average(groupColor)
            if (isBorderRegion)
                return color.darken(90).toHex()
            if (this.showGroupLayers) {
                color = color.darken(groupLayer * 20)
            }
            if (this.showRegionLayers) {
                color = color.brighten(regionLayer * 4)
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
