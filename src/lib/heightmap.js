import _ from 'lodash'

import { Grid } from './grid'
import { Point } from './point'
import { Random } from './base'
import { ColorGradient } from './color'
import { ValueDistributionMap } from './indexing'

const EMPTY = 0

window.ColorGradient = ColorGradient


class BaseHeightMap {
    constructor(size, roughness, callback) {
        this.grid = new Grid(size, size, EMPTY)
        this.roughness = roughness
        this.callback = callback
        this.size = size

        this._buildGrid(size, roughness)
    }

    _buildGrid(size, roughness) {
        this.setInitialPoints()

        for (let midSize = size - 1; midSize / 2 >= 1; midSize /= 2) {
            let half = midSize / 2
            let scale = Math.floor(roughness * midSize)

            for (let y = half; y < size - 1; y += midSize) {
                for (let x = half; x < size - 1; x += midSize) {
                    let variance = Random.int(-scale, scale)
                    this.square(new Point(x, y), half, variance)
                }
            }

            for (let y = 0; y <= size - 1; y += half) {
                for (let x = (y + half) % midSize; x <= size - 1; x += midSize) {
                    let variance = Random.int(-scale, scale)
                    this.diamond(new Point(x, y), half, variance)
                }
            }
        }
    }

    setInitialPoints() {
        let maxIndex = this.size - 1
        this.set(new Point(0, 0), EMPTY)
        this.set(new Point(maxIndex, 0), EMPTY)
        this.set(new Point(0, maxIndex), EMPTY)
        this.set(new Point(maxIndex, maxIndex), EMPTY)
    }

    diamond(point, midSize, offset) {
        let x = point.x,
            y = point.y,
            average = this._averagePoints([
                new Point(x, y - midSize),      // top
                new Point(x + midSize, y),      // right
                new Point(x, y + midSize),      // bottom
                new Point(x - midSize, y)       // left
            ])
        this.set(point, average + offset)
    }

    square(point, midSize, offset) {
        let x = point.x,
            y = point.y,
            average = this._averagePoints([
                new Point(x - midSize, y - midSize),   // upper left
                new Point(x + midSize, y - midSize),   // upper right
                new Point(x + midSize, y + midSize),   // lower right
                new Point(x - midSize, y + midSize)    // lower left
            ])
        this.set(point, average + offset)
    }

    _averagePoints(points) {
        let values = points.map(pt => this.grid.get(pt)).filter(p=> p != undefined)
        return Math.floor(_.sum(values) / values.length)
    }

    get(point) {
        const height = this.grid.get(point)
        return _.clamp(height, 0, this.size - 1)
    }

    getValue(point) {
        const height = this.get(point)
        return this.map.get(height)
    }

    iter(callback) {
        this.grid.forEach(callback)
    }

    set(point, height) {
        let {x, y} = point

        this.grid.set(point, height)
        this.callback(height, point)
    }
}


//export class MaskHeightMap extends BaseHeightMap {}

//export class IterativeHeightMap extends BaseHeightMap {}

export class HeightMap extends BaseHeightMap {
    constructor(size, roughness, callback = _.noop) {
        super(size, roughness, callback)
        let values = ColorGradient('003', 'FFF', 10)
        this.map = new ValueDistributionMap(size, values)
    }

    getColor(point) {
        return this.get(point)
    }
}


export const MidpointDisplacement = (source, target, roughness, callback=_.noop) => {
    const deltaX = Math.abs(source.x - target.x)
    const deltaY = Math.abs(source.y - target.y)
    const fixedAxis = deltaX > deltaY ? 'x' : 'y'
    const displacedAxis = deltaX > deltaY ? 'y' : 'x'
    const size = Math.abs(target[fixedAxis] - source[fixedAxis])
    let displacement = roughness * (size / 2)
    let points = []

    const buildPoint = (p1, p2) => {
        if (Math.abs(p2[fixedAxis] - p1[fixedAxis]) <= 1)
            return
        const displacedValue = (p1[displacedAxis] + p2[displacedAxis]) / 2
        const variance = Random.int(-displacement, displacement)
        const point = new Point()

        point[fixedAxis] = Math.floor((p1[fixedAxis] + p2[fixedAxis]) / 2)
        point[displacedAxis] = Math.round(displacedValue + variance)
        return point
    }

    const midpoints = (p1, p2, size) => {
        let points = []
        let point = buildPoint(p1, p2)
        if (!point)
            return points
        displacement = roughness * size
        points = points.concat(midpoints(p1, point, size / 2))
        addPoint(point)
        points = points.concat(midpoints(point, p2, size / 2))
        return points
    }

    const addPoint = (point) => {
        points.push(point)
        callback(point)
    }

    addPoint(source)
    points = points.concat(midpoints(source, target, size / 2))
    addPoint(target)

    return points
}



class HeightColorMap {
    constructor(size, rates, colorGradient) {
        this.map = this._buildMap(table)
    }

    _buildMap() {

    }

    getColor(height) {

        return this.map[height]
    }
}
