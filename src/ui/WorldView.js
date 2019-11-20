import React, { useState, useLayoutEffect, useRef } from 'react'

import { WorldPainter } from '../world/builder'


function ViewInput(props) {
    return <label htmlFor="viewInput">View
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
}


export default function WorldView(props) {
    const containerRef = useRef(null)
    const canvasRef = useRef(null)

    const [tilesize, setTilesize] = useState(2)

    let worldPainter = new WorldPainter()

    useLayoutEffect(() => {
        let canvas = canvasRef.current
        let ctx = canvas.getContext('2d')
        canvas.width = containerRef.current.offsetWidth
        canvas.height = containerRef.current.offsetHeight
        worldPainter.draw(ctx, props.world, tilesize)
    })

    const onTilesizeChange = event => {
        setTilesize(event.target.value)
    }

    return <section id="world-view">
        <section className="options">
            <p>Seed: {world.seed}</p>
            <label id="tilesizeField" htmlFor="tilesizeInput">Tile size
                <input id="tilesizeInput"
                    onChange={onTilesizeChange}
                    type="number" min="1" step="1" value={tilesize} />
            </label>
            <ViewInput />
        </section>
        <section className="screen" ref={containerRef}>
            <canvas ref={canvasRef}></canvas>
        </section>
    </section>
}