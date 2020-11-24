import React, { useMemo, useState } from 'react'

import { Color } from '/lib/color'
import { Point } from '/lib/point'


export function NumberField({name, label, value, onChange, ...props}) {
    const handleChange = event => onChange(name, event.target.value)

    return <Field type='number' label={label} {...props}>
        <input
            name={name}
            type='number'
            value={value}
            onChange={handleChange}
            {...props}
        />
    </Field>
}


export function TextField({name, label, value, onChange, ...props}) {
    const handleChange = event => onChange(name, event.target.value)

    return <Field type='text' label={label}>
        <input
            name={name}
            type='text'
            value={value}
            onChange={handleChange}
            {...props}
        />
    </Field>
}


export function SeedField({name, label, value, onChange, ...props}) {
    const handleChange = event => onChange(name, event.target.value)

    return <Field type='text' label={label}>
        <input name={name} type='text' onChange={handleChange} {...props} />
    </Field>
}


export function SeedField2({name, label, value, ...props}) {
    const createSeed = text => {
        if (text === '') {
            return String(Number(new Date()))
        }
        return text
    }
    const [status, setStatus] = useState(createSeed(value))

    const handleChange = event => {
        const inputValue = event.target.value.trim()
        setStatus(createSeed(inputValue))
    }

    return <Field type='text' label={label}>
        <input type='text'
            defaultValue={value}
            onChange={handleChange} {...props} />
        <input name={name} type='hidden' value={status} />
    </Field>
}


export function SelectField({name, label, value, onChange, options, ...props}) {
    const handleChange = event => onChange(name, event.target.value)

    function buildSelectOptions(options) {
        const entries = Object.entries(options)
        return entries.map((option, index) => {
            const [value, label] = option
            return <option key={index} value={value}>{label}</option>
        })
    }

    return <Field type='select' label={label}>
        <select name={name} defaultValue={value} {...props} onChange={handleChange}>
            {useMemo(() => buildSelectOptions(options), [options])}
        </select>
    </Field>
}


export function BooleanField({name, label, value, onChange}) {
    const [status, setStatus] = useState(value)

    const onClick = () => {
        onChange(name, !status)
        setStatus(!status)
    }

    return <Field type='boolean' label={label} status={status}>
        <button onClick={onClick}>{status ? 'Yes' : 'No'}</button>
        <input type='checkbox' checked={status} onChange={()=>{}} />
    </Field>
}

export function BooleanField2({name, label, value, onChange}) {
    const [status, setStatus] = useState(value)

    const onClick = () => {
        setStatus(!status)
    }

    return <Field type='boolean' label={label} status={status}>
        <button onClick={onClick}>{status ? 'Yes' : 'No'}</button>
        <input name={name} type='hidden' value={status} />
    </Field>
}


export function ColorField({name, label, value, onChange, ...props}) {
    const [color, setColor] = useState(value)

    const handleChange = event => {
        const newColor = Color.fromHex(event.target.value)
        setColor(newColor)
        onChange(name, newColor)
    }

    return <Field type='color' label={label}>
        <span
            className="ColorView"
            style={{backgroundColor: color.toHex()}}>
        </span>
        <input
            name={name}
            type='text'
            defaultValue={color.toHex()}
            onChange={handleChange}
            {...props}
        />
    </Field>
}

export function ColorField2({name, label, value, ...props}) {
    const [color, setColor] = useState(value)

    const handleChange = event => {
        const newColor = Color.fromHex(event.target.value)
        setColor(newColor)
    }

    return <Field type='color' label={label}>
        <span
            className="ColorView"
            style={{backgroundColor: color.toHex()}}>
        </span>
        <input
            name={name}
            type='text'
            defaultValue={color.toHex()}
            onChange={handleChange}
            {...props}
        />
    </Field>
}


export function PointField({name, label, value, onChange, ...props}) {
    const handleXChange = e => handleChange(e.target.value, value.y)
    const handleYChange = e => handleChange(value.x, e.target.value)
    const handleChange = (x, y) => onChange(name, new Point(x, y))

    return <Field type='point' label={label}>
        <input
            name={'x'}
            type='number'
            value={value.x}
            onChange={handleXChange}
            {...props}
        />
        <input
            name={'y'}
            type='number'
            value={value.y}
            onChange={handleYChange}
            {...props}
        />
    </Field>
}


export function PointField2({name, label, value, ...props}) {
    const [point, setPoint] = useState(value)
    const handleXChange = e => handleChange(e.target.value, value.y)
    const handleYChange = e => handleChange(value.x, e.target.value)
    const handleChange = (x, y) => setPoint(new Point(x, y))

    return <Field type='point' label={label}>
        <input name={name} type='hidden' value={point.hash} />
        <input
            type='number'
            defaultValue={value.x}
            onChange={handleXChange}
            {...props}
        />
        <input
            type='number'
            defaultValue={value.y}
            onChange={handleYChange}
            {...props}
        />
    </Field>
}


// BASE FIELD COMPONENT ===============================================

function Field({label, type, status='', children, ...props}) {
    return <label className={`Field ${type} ${status}`} {...props}>
        <span className='FieldLabel'>{label}</span>
        <span className='FieldValue'>{children}</span>
    </label>
}


export const TYPE_FIELD_MAP = {
    boolean: BooleanField,
    number: NumberField,
    text: TextField,
    seed: SeedField,
    color: ColorField,
    point: PointField,
}