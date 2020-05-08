import { Random } from '/lib/random'


export function organicFill(rules) {
    const {index, points, chance, times} = rules
    const partialGrow = _seeds => {
        const randomSeeds = _seeds.filter(() => Random.chance(rules.chance))
        return normalFill(randomSeeds)
    }
    let newSeeds = normalFill(seeds)
    while(newSeeds.length && times--) {
        newSeeds.push(...partialGrow(newSeeds))
    }
    return newSeeds
}


export function normalFill(rules) {
    const {index, points} = rules
    let newSeeds = []
    const fill = point => {
        if (! rules.isFillable(point)) return
        rules.onFill(point)
        return true
    }
    points.forEach(seed => {
        const adjacents = seed.adjacents(point => fill(point))
        newSeeds.push(...adjacents)
    })
    return newSeeds
}


export class OrganicFloodFill {
    constructor(onFill, isFillable) {
        this.isFillable = isFillable
        this.onFill = onFill
    }

    grow(seeds) {
        let newSeeds = []
        const fill = point => {
            if (! this.isFillable(point)) return
            this.onFill(point)
            return true
        }
        seeds.forEach(seed => {
            const adjacents = seed.adjacents(point => fill(point))
            newSeeds = newSeeds.concat(adjacents)
        })
        return newSeeds
    }

    growRandom(seeds, chance=0, times=1) {
        const partialGrow = _seeds => this.grow(_seeds.filter(() => Random.chance(chance)))
        let newSeeds = this.grow(seeds)
        while(newSeeds.length && times--) {
            newSeeds = newSeeds.concat(partialGrow(newSeeds))
        }
        return newSeeds
    }
}


export class FloodFill {
    constructor(grid, startPoint, onFill, isFillable) {
        this.grid = grid
        this.seeds = []
        this.isFillable = isFillable
        this.startPoint = startPoint
        this.onFill = onFill
        this.step = 0

        this.fillPoint(startPoint)
    }

    get isComplete() {
        return this.seeds.length === 0
    }

    fill() {
        while (!this.isComplete) {
            this.stepFill()
        }
    }

    stepFill(times = 1) {
        if (this.isComplete)
            return
        let currentSeeds = this.seeds
        this.seeds = []
        currentSeeds.forEach(point => {
            this.fillNeighborPoints(point)
        })
        this.step++
        if (times > 1) {
            this.stepFill(times - 1)
        }
    }

    fillNeighborPoints(referencePoint) {
        referencePoint.OldAdjacentPoints(neighbor => {
            let point = this.grid.wrap(neighbor)
            if (this.isFillable(point, referencePoint, this.step))
                this.fillPoint(point)
        })
    }

    fillPoint(point) {
        this.seeds.push(point)
        this.onFill(point, this.step)
    }
}


export class ScanlineFill {
    constructor(grid, startPoint, onFill, isFillable) {
        this.startPoint = startPoint
        this.grid = grid
        this.rangeQueue = []
        this.onFill = onFill
        this.isFillable = isFillable

        this.createRange(startPoint)
    }

    createRange(point) {
        this.rangeQueue.push({
            point: this.findRangeStart(point),
            canCheckAbove: true,
            canCheckBelow: true
        })
    }

    findRangeStart(originPoint) {
        let currentPoint = originPoint
        let nextPoint = this.grid.wrap(currentPoint.atWest())
        while (this.isFillable(nextPoint) && nextPoint.x != originPoint.x) {
            currentPoint = nextPoint
            nextPoint = this.grid.wrap(nextPoint.atWest())
        }
        return currentPoint
    }

    fill() {
        while (!this.isComplete) {
            this.stepFill()
        }
    }

    get isComplete() {
        return this.rangeQueue.length === 0
    }

    stepFill() {
        let ranges = this.rangeQueue

        this.rangeQueue = []
        while (ranges.length) {
            this.fillRange(ranges.pop())
        }
    }

    fillRange(range) {
        let point = range.point

        while (this.isFillable(point)) {
            this.onFill(point)
            this.detectRangeAbove(point.atNorth(), range)
            this.detectRangeBelow(point.atSouth(), range)
            point = this.grid.wrap(point.atEast())
        }
    }

    detectRangeAbove(referencePoint, referenceRange) {
        let pointAbove = this.grid.wrap(referencePoint)
        if (this.isFillable(pointAbove)) {
            if (referenceRange.canCheckAbove) {
                this.createRange(pointAbove)
                referenceRange.canCheckAbove = false
            }
        } else {
            referenceRange.canCheckAbove = true
        }
    }

    detectRangeBelow(referencePoint, referenceRange) {
        let pointBelow = this.grid.wrap(referencePoint)
        if (this.isFillable(pointBelow)) {
            if (referenceRange.canCheckBelow) {
                this.createRange(pointBelow)
                referenceRange.canCheckBelow = false
            }
        } else {
            referenceRange.canCheckBelow = true
        }
    }
}


export class ScanlineFill8 extends ScanlineFill {
    fillRange(range) {
        let point = range.point

        while (this.isFillable(point)) {
            this.onFill(point)
            this.detectRangeAbove(point.atNorthwest(), range)
            this.detectRangeAbove(point.atNorth(), range)
            this.detectRangeAbove(point.atNortheast(), range)
            this.detectRangeBelow(point.atSouthwest(), range)
            this.detectRangeBelow(point.atSouth(), range)
            this.detectRangeBelow(point.atSoutheast(), range)
            point = this.grid.wrap(point.atEast())
        }
    }
}
