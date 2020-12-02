import React, { useState, useRef } from 'react'

import { useResize } from '/lib/ui'
import { Point } from '/lib/point'
import { Canvas, CursorCanvas } from '/lib/ui/canvas'
import { MouseTrack } from '/lib/ui/mouse'

import { Scene } from '/model/lib/scene'


export function MapView({diagram, ...props}) {
    const viewport = useRef(null)
    const [width, height] = useResize(viewport)

    return <section className="MapView" ref={viewport}>
        {viewport.current && (
            <MapScene diagram={diagram} width={width} height={height} />
        )}
    </section>
}


function MapScene({diagram, width, height}) {
    const [offset, setOffset] = useState(new Point())
    const [baseOffset, setBaseOffset] = useState(new Point())
    const [zoom, setZoom] = useState(0)

    const scene = new Scene(diagram, width, height)

    const handleDrag = point => setOffset(point.plus(baseOffset))
    const handleDragEnd = point => setBaseOffset(point.plus(baseOffset))
    const handleClick = point => console.info(point.plus(offset))
    const handleWheel = amount => {
        setZoom(zoom + amount)
    }
    const handleInit = canvas => scene.render(canvas, offset, zoom)

    return <>
        <MapMouseTrack
            scene={scene}
            onDrag={handleDrag}
            onClick={handleClick}
            onDragEnd={handleDragEnd}
            onWheel={handleWheel}
        />
        <Canvas
            width={scene.width}
            height={scene.height}
            onInit={handleInit}
        />
    </>
}


function MapMouseTrack({scene, ...props}) {
    /*
     Translates MouseTrack events in pixel points to
     tile objects using a view frame object
    */

    const [cursor, setCursor] = useState(null)
    const [focus, setFocus] = useState(new Point())

    const handleDrag = (startPoint, endPoint) => {
        const startTilePoint = scene.frame.tilePoint(startPoint)
        const endTilePoint = scene.frame.tilePoint(endPoint)
        const newFocus = startTilePoint.minus(endTilePoint)
        if (newFocus.differs(focus)) {
            setFocus(newFocus)
            props.onDrag(newFocus)
        }
    }

    const handleDragEnd = (startPoint, endPoint) => {
        const startTilePoint = scene.frame.tilePoint(startPoint)
        const endTilePoint = scene.frame.tilePoint(endPoint)
        props.onDragEnd(startTilePoint.minus(endTilePoint))
    }

    const handleMove = mousePoint => {
        const scenePoint = scene.frame.tilePoint(mousePoint)
        const point = scenePoint.plus(scene.focus)
        if (! cursor || point.differs(cursor)) {
            setCursor(point)
        }
    }

    const handleClick = mousePoint => {
        const scenePoint = scene.frame.tilePoint(mousePoint)
        const point = scenePoint.plus(scene.focus)
        props.onClick(point)
    }

    const handleMouseOut = () => setCursor(null)

    const handleCanvasInit = canvas => {
        if (cursor) {
            scene.renderCursor(canvas, cursor)
        }
    }

    return <>
        <MouseTrack
            onClick={handleClick}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onMove={handleMove}
            onMouseOut={handleMouseOut}
            onWheel={props.onWheel}
        />
        <CursorCanvas
            width={scene.width}
            height={scene.height}
            onInit={handleCanvasInit}
        />
    </>
}
