import { IEditorOption } from "../../../interface/Editor"
import { Draw } from "../Draw"

export class Underline {

  private draw: Draw
  private ctx: CanvasRenderingContext2D
  private options: Required<IEditorOption>

  constructor(draw: Draw) {
    this.draw = draw
    this.ctx = draw.getCtx()
    this.options = draw.getOptions()
  }

  public render(x: number, y: number, width: number) {
    this.ctx = this.draw.getCtx()
    const { underlineColor } = this.options
    this.ctx.save()
    this.ctx.strokeStyle = underlineColor
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x + width, y)
    this.ctx.stroke()
    this.ctx.restore()
  }

}