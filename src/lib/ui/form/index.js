import React, { useState } from 'react'

import { TYPE_FIELD_MAP } from './field'


export function Form({meta, values, onSubmit, onChange, ...props}) {
    const [data, setData] = useState(meta.defaultConfig)

    const handleSubmit = event => {
        event.preventDefault()
        onSubmit && onSubmit(data)
        // TODO: get errors here from onSubmit
    }

    const handleChange = (name, value) => {
        const newData = {...data, [name]: value}
        setData(newData)
        onChange && onChange(newData)
        // TODO: get errors here from onChange
    }

    const className = `Form ${props.className}`

    return <form className={className} onSubmit={handleSubmit}>
        {buildFields(meta, values, handleChange)}
        {props.children}
    </form>
}


function buildFields(meta, values, onChange) {
    return meta.types.map((typeClass, id) => {
        const {type, name, props, ...rest} = typeClass
        // const values =
        console.log(name, rest.value, values[name])
        const FieldComponent = TYPE_FIELD_MAP[type]
        return FieldComponent({id, name, onChange, ...props, ...rest})
    })
}
