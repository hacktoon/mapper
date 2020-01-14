import React from 'react'


// HELPER FUNCTIONS ==============================================

export function cls(...classNames) {
    return classNames.filter(name => {
        return Boolean(name) && String(name).trim()
    }).join(' ')
}

export function Component(props) {
    const {className, ...textProps} = props
    return <div className={cls(className, 'Component')} {...textProps}>
        {props.children}
    </div>
}

// GENERIC WIDGETS ===============================================

export function Text(props) {
    const {className, ...textProps} = props
    return <p className={cls(className, 'Text')} {...textProps}>
        {props.children}
    </p>
}

// GENERIC FORM WIDGETS ===============================================

export function Form(props) {
    const {className, ...formProps} = props
    return <section className={cls(className, 'Form')} {...formProps}>
        {props.children}
    </section>
}

export function Button(props) {
    return <button className="Button" onClick={props.onClick}>
        {props.text}
    </button>
}


// LAYOUT WIDGETS ===============================================

export function Grid(props) {
    const {className, ...gridProps} = props
    return <section className={cls(className, 'Grid')} {...gridProps}>
        {props.children}
    </section>
}

export function Row(props) {
    const {className, ...rowProps} = props
    return <section className={cls(className, 'Row')} {...rowProps}>
        {props.children}
    </section>
}

export function Column(props) {
    const {className, ...colProps} = props
    return <section className={cls(className, 'Column')} {...colProps}>
        {props.children}
    </section>
}
