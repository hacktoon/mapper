import React from 'react'

import { NumberField, SelectField, OutputField } from '/ui/lib/field'
import { Column, Form } from '/ui/lib'


export function ViewConfig(props) {
    return <Column className="ViewConfig">
        <Form layout="ColumnLayout">
            <OutputField label="Name" value={props.world.name} />
            <OutputField label="Seed" value={props.world.seed} />
            <NumberField id="tilesize"
                label="Tile size"
                value={props.tilesize}
                onChange={props.onTilesizeChange}
                step={1}
                min={1}
            />
            <SelectField label="Layer" options={{
                heightmap: "Heightmap",
                relief: "Relief",
                heat: "Heat",
                moisture: "Moisture",
                water: "Water",
                biome: "Biome",
                landmass: "Landmass",
            }} />
        </Form>
    </Column>
}