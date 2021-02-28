import { Graph } from '/lib/base/graph'


const EMPTY_VALUE = null
const NO_BORDER = null


export class Regions {
    constructor(origins) {
        this.regions = origins.map((origin, id) => new Region(id, origin))
        this.origins = origins
        this.graph = new Graph()
    }

    forEach(callback) {
        this.regions.forEach(region => callback(region))
    }

    get length() {
        return this.origins.length
    }
}


class Region {
    constructor(id, origin) {
        this.id = id
        this.origin = origin
    }
}


export class RegionCell {
    constructor(value=EMPTY_VALUE, border=NO_BORDER) {
        this.value = value
        this.border = border
    }

    getValue() {
        return this.value
    }

    getBorder() {
        return this.border
    }

    isValue(value) {
        return this.value === value
    }

    isEmpty() {
        return this.value === EMPTY_VALUE
    }

    isBorder() {
        return this.border !== NO_BORDER
    }

    setValue(value) {
        return this.value = value
    }

    setBorder(border) {
        return this.border = border
    }
}