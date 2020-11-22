import { Random } from '/lib/random'
import { Point } from '/lib/point'
import { clamp } from '/lib/number'



export class Schema {
}


// let's create our own type system, it's fun
class AbstractType {
    static create(TypeClass) {
        // Example: Type.number('label', 'foobar', {})
        return (label, value, props={}) => {
            const type = TypeClass.type
            return new TypeClass(type, label, value, props)
        }
    }

    constructor(type, label, value, fieldAttrs) {
        this.type = type
        this.name = normalizeLabel(label)
        this.label = label
        this.value = value
        this.fieldAttrs = fieldAttrs
        this.description = fieldAttrs.description ?? `${type}(${label})`
    }

    sanitize(value) {
        return value
    }
}


export class NumberType extends AbstractType {
    static type = 'number'

    sanitize(value=0) {
        const number = value ?? 0
        const min = this.fieldAttrs.min ?? -Infinity
        const max = this.fieldAttrs.max ?? Infinity
        return clamp(Number(number), min, max)
    }
}


export class TextType extends AbstractType {
    static type = 'text'

    sanitize(value) {
        return String(value).trim()
    }
}


export class SeedType extends TextType {
    static type = 'seed'

    sanitize(value) {
        const text = super.sanitize(value)
        const seed = text.length ? text : String(Number(new Date()))
        Random.seed = seed
        return seed
    }
}


export class ColorType extends AbstractType {
    static type = 'color'
}


export class PointType extends AbstractType {
    static type = 'point'

    sanitize({x, y}) {
        return new Point(Number(x), Number(y))
    }
}


export class BooleanType extends AbstractType {
    static type = 'boolean'

    sanitize(value) {
        return Boolean(value)
    }
}


export class Type {
    static point = AbstractType.create(PointType)
    static boolean = AbstractType.create(BooleanType)
    static text = AbstractType.create(TextType)
    static number = AbstractType.create(NumberType)
    static color = AbstractType.create(ColorType)
    static seed = AbstractType.create(SeedType)
}


function normalizeLabel(label) {
    const capitalWords = label.split(' ').map((word, index) => {
        const lowerCase = removeSymbols(word.toLowerCase())
        if (index > 0)
            return lowerCase[0].toUpperCase() + lowerCase.substring(1)
        return lowerCase
    })
    return capitalWords.join('')
}


function removeSymbols(text) {
    return text.replace(/[^a-zA-Z0-9]/g, '')
}
