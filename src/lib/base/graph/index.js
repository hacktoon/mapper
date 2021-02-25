
export class Graph {
    constructor() {
        this.table = {}
    }

    hasNode(value) {
        return Boolean(this.table[value])
    }

    addNode(value) {
        if (! this.table[value]) {
            this.table[value] = new Set()
        }
    }

    addEdge(source, target) {
        this.addNode(source)
        this.addNode(target)
        this.table[source].add(target)
        this.table[target].add(source)
    }

    hasEdge(source, target) {
        const hasTarget = this.table[source].has(target)
        const hasSource = this.table[target].has(source)
        return hasSource && hasTarget
    }
}