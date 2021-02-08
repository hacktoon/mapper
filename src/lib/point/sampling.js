import { repeat } from '/lib/function'
import { clamp } from '/lib/number'
import { Point } from '.'
import { PointSet } from './set'
import { Rect } from '/lib/number'


export class RandomPointSampling {
    static create(count, width, height) {
        const parsedMaxCount = clamp(count, 1, width * height)
        return repeat(parsedMaxCount, () => Point.random(width, height))
    }
}


export class EvenPointSampling {
    static create(radius, width, height) {
        const points = []
        const rect = new Rect(width, height)
        const pointSet = PointSet.fromRect(rect)

        while(pointSet.size > 0) {
            const center = pointSet.random()
            iterPointsInCircle(pointSet, center, radius, rect)
            points.push(center)
        }
        return points
    }
}


function iterPointsInCircle(pointSet, center, radius, rect) {
    const {x, y} = center
    for(let i=x-radius; i<x+radius; i++) {
        for(let j=y-radius; j<y+radius; j++) {
            const point = rect.wrap(new Point(i, j))
            if (point.distance(center) <= radius) {
                pointSet.delete(point)
            }
        }
    }
}