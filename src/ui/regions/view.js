import React, { useState } from 'react'

import { GridDisplay } from '/lib/ui/display'
import { Form } from '/lib/ui'
import { NumberField, SwitchField } from '/lib/ui/field'


const DEFAULT_TILE_SIZE = 4


function getColor(regionMap, point) {
    const region = regionMap.get(point)
    const color = region.color.toHex()

    if (region.isOrigin(point)) {
        return 'black'
    }
    // return color.darken(amount).toHex()
    return color
}


export default function RegionMapView({regionMap}) {
    const [tilesize, setTilesize] = useState(DEFAULT_TILE_SIZE)
    const [gridMode, setGridMode] = useState(false)
    const [wrapMode, setWrapMode] = useState(false)
    const [layer, setLayer] = useState(0)

    return <section className="RegionMapView">
        <Menu
            onLayerChange={event => setLayer(event.target.value)}
            onTilesizeChange={event => setTilesize(event.target.value)}
            onGridModeChange={() => setGridMode(!gridMode)}
            onWrapModeChange={() => setWrapMode(!wrapMode)}
            gridMode={gridMode}
            wrapMode={wrapMode}
            tilesize={tilesize}
            layer={layer}
        />
        <GridDisplay
            width={regionMap.width}
            height={regionMap.height}
            colorAt={point => getColor(regionMap, point)}
            tilesize={tilesize}
            gridMode={gridMode}
            wrapMode={wrapMode}
        />
    </section>
}


function Menu(props) {
    const onSubmit = event => event.preventDefault()

    return <Form className="Menu" onSubmit={onSubmit}>
        <SwitchField
            label="Draw grid"
            checked={props.gridMode}
            onChange={props.onGridModeChange}
        />
        <SwitchField
            label="Wrap grid"
            checked={props.wrapMode}
            onChange={props.onWrapModeChange}
        />
        <NumberField
            label="Tile size"
            value={props.tilesize}
            onChange={props.onTilesizeChange}
            step={1}
            min={1}
        />
        <NumberField
            label="Layer"
            value={props.layer}
            onChange={props.onLayerChange}
            step={1}
            min={1}
        />
    </Form>
}