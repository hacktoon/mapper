import React from 'react'


export function SeedInput(props) {
    let timer = null

    const onChange = event => {
        let value = event.target.value.trim()
        clearTimeout(timer)
        timer = setTimeout(() => {
            props.onChange(value)
        }, 450)
    }

    return <section className="header-menu-item">
        <label htmlFor="seedInput">Seed</label>
        <input id="seedInput" type="text" onChange={onChange} />
    </section>
}

export function GenerateButton(props) {
    return <section className="header-menu-item">
        <button id="generateButton" onClick={props.onClick}>Generate</button>
    </section>
}

export function ViewInput(props) {
    return <>
        <label htmlFor="viewInput">View
            <select id="viewInput">
                <option value="heightmap">Heightmap</option>
                <option value="relief">Relief</option>
                <option value="heat">Heat</option>
                <option value="moisture">Moisture</option>
                <option value="water">Water</option>
                <option value="biome">Biome</option>
                <option value="landmass">Landmass</option>
            </select>
        </label>
    </>
}