
export default class WorldPainter {
    constructor (world, canvas, tilesize) {
        this.world = world
        this.tilesize = tilesize
        this.ctx = canvas.getContext("2d")
    }

    draw () {
        this.world.grid.forEach((tile, point) => {
            let color = tile.elevation.color
            if (this.world.geo.volcanoPoints.has(point)) {
                color = "red"
            } else if (this.world.geo.riverSourcePoints.has(point)){
                color = "blue"
            }
            this.drawPoint(point, color)
        })
    }

    drawPoint (point, color) {
        let x = point.x * this.tilesize,
            y = point.y * this.tilesize

        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, this.tilesize, this.tilesize)
    }

    drawBlackWhite () {
        this.world.grid.forEach((tile, point) => {
            let color = tile.elevation.isWater ? "#FFF" : "#000"
            this.drawPoint(point, color)
        })
    }

    drawHeat() {
        this.world.grid.forEach((tile, point) => {
            this.drawPoint(point, tile.heat.color)
        })
    }

    drawRain() {
        this.world.grid.forEach((tile, point) => {
            this.drawPoint(point, tile.rain.color)
        })
    }
}