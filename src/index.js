import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import WorldMapApp  from '/ui/worldmap'
import RegionMapApp from '/ui/regionmap'
import NoiseMapApp from '/ui/noisemap'

import { Text } from '/lib/ui'
import { SelectField } from '/lib/ui/field'

import "./base.css"
import "./index.css"


const APPS = {
    worldMap: { id: 'worldMap', name: 'World Map', component: <WorldMapApp /> },
    regionMap: { id: 'regionMap', name: 'Region Map', component: <RegionMapApp /> },
    noiseMap: { id: 'noiseMap', name: 'Noise Map', component: <NoiseMapApp /> },
}
const DEFAULT_APP = APPS.regionMap


function AppHeader({app, setApp}) {
    return <section className="AppHeader">
        <Text className="AppTitle">NAMI</Text>
        <MainMenu app={app} setApp={setApp} />
    </section>
}

function MainMenu({app, setApp}) {
    return <section className="MainMenu">
        <AppSelect apps={APPS} current={app} setApp={setApp} />
    </section>
}

function AppSelect({ apps, current, setApp }) {
    const onChange = event => {
        const id = event.target.value
        setApp(apps[id])
    }

    const appOptions = Object.fromEntries(
        Object.entries(apps).map(entry => {
            const [id, app] = entry
            return [id, app.name]
        }))

    return <SelectField
        label="App"
        value={current.id}
        options={appOptions}
        onChange={onChange}
    />
}

function RootComponent() {
    const [app, setApp] = useState(DEFAULT_APP)

    return <section className="App">
        <AppHeader app={app} setApp={setApp} />
        {app.component}
    </section>
}


ReactDOM.render(<RootComponent />, document.getElementById('main'));