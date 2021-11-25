import { Draw } from "../Draw"

export class Background {

  private draw: Draw
  private ctx: CanvasRenderingContext2D

  constructor(draw: Draw) {
    this.draw = draw
    this.ctx = draw.getCtx()
  }

  public render(canvasRect: DOMRect) {
    this.ctx = this.draw.getCtx()
    const { width, height } = canvasRect
    this.ctx.save()
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, width, height)
    this.ctx.restore()
  }

}