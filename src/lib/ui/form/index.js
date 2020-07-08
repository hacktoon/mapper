import React, { useState } from 'react'

import { TYPE_FIELD_MAP } from './field'


export function Form({meta, onSubmit, onChange, ...props}) {
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

    const cls = `Form ${props.className}`
    return <form className={cls} onSubmit={handleSubmit}>
        {buildFields(meta, handleChange)}
        {props.children}
    </form>
}


function buildFields(meta, onChange) {
    return meta.schema.map(({type, props, ...rest}, id) => {
        const FieldComponent = TYPE_FIELD_MAP[type]
        return FieldComponent({id, onChange, ...props, ...rest})
    })
}
