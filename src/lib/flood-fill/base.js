export class BaseFloodFill {
    constructor(origin, params) {
        this.origin = origin
        this.seeds = [origin]
        this.setValue = params.setValue
        this.isEmpty = params.isEmpty

        this.setValue(this.origin)
    }

    grow() {
        let seeds = []
        this.seeds.forEach(point => {
            point.adjacents().forEach(candidate => {
                if (! this.isEmpty(candidate)) return
                this.setValue(candidate)
                seeds.push(candidate)
            })
        })
        this.seeds = seeds
        return seeds
    }
}