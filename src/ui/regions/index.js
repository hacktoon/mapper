import React, { useState } from 'react'

import { RegionsConfig, Regions } from '/model/region'
import ConfigMenu from './menu'
import RegionsView from './view'

import "./index.css"


export default function RegionsApp() {
    let [regions, setRegions] = useState(new Regions(new RegionsConfig()))

    const onConfigChange = config => setRegions(new Regions(config))

    return <section className='RegionsApp'>
        <ConfigMenu onChange={onConfigChange} />
        <RegionsView regions={regions} />
    </section>
}