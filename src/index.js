import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import { SelectField } from '/lib/ui/form/field'
import { Title } from '/lib/ui'

import { MapApp } from '/ui/map'
import NoiseMap from '/model/noisemap'
import WorldMap from '/model/worldmap'
import RegionMap from '/model/regionmap'


import "/ui/css/base.css"
import "/ui/css/index.css"


const APPS = {
    NoiseMap: { id: 'NoiseMap', component: () => <MapApp Map={NoiseMap} /> },
    WorldMap: { id: 'WorldMap', component: () => <MapApp Map={WorldMap} /> },
    RegionMap: { id: 'RegionMap', component:  () => <MapApp Map={RegionMap} /> },
}
const DEFAULT_APP = APPS.NoiseMap


function AppHeader({app, setApp}) {
    return <section className="AppHeader">
        <Title className="AppTitle">NAMI</Title>
        <MainMenu app={app} setApp={setApp} />
    </section>
}


function MainMenu({app, setApp}) {
    const appOptions = Object.fromEntries(
        Object.entries(APPS).map(entry => {
            const [id, app] = entry
            return [id, app.id]
        })
    )
    const onChange = (_, value) => setApp(APPS[value])

    return <section className="MainMenu">
        <SelectField
            label="App"
            value={app.id}
            options={appOptions}
            onChange={onChange}
        />
    </section>
}


function RootComponent() {
    const [app, setApp] = useState(DEFAULT_APP)
    return <section className="App">
        <AppHeader app={app} setApp={setApp} />
        <app.component />
    </section>
}


ReactDOM.render(<RootComponent />, document.getElementById('main'));