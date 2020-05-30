import React, { useState } from 'react'

import { Color } from '/lib/color'
import { createRegionMap } from '/model/regionmap'
import MapAppMenu from './menu'
import RegionMapView from './view'


export default function RegionMapApp() {
    const [regionMap, setRegionMap] = useState(prev => prev || createRegionMap())
    const onConfigChange = config => setRegionMap(createRegionMap(config))

    const colorMap = Object.fromEntries(
        regionMap.regions.map(region => [
            region.id, new Color()
        ])
    )

    return <section className='MapApp'>
        <MapAppMenu onChange={onConfigChange} />
        <RegionMapView regionMap={regionMap} colorMap={colorMap} />
    </section>
}