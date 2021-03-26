import { Random } from '/lib/base/random'


export class BaseMap {
    constructor(params) {
        this.width = params.get('width')
        this.height = params.get('height')
        this.seed = this.#buildSeed(params.get('seed'))
    }

    get area() {
        return this.width * this.height
    }

    #buildSeed(text='') {
        const seed = text.length ? text : String(Number(new Date()))
        Random.seed = seed
        return seed
    }
}


export class BaseMapDiagram {
    constructor(mapModel) {
        this.mapModel = mapModel
        this.width = mapModel.width
        this.height = mapModel.height
    }
}