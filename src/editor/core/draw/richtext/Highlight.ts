import { IEditorOption } from "../../../interface/Editor"
import { Draw } from "../Draw"

export class Highlight {

  private draw: Draw
  private ctx: CanvasRenderingContext2D
  private options: Required<IEditorOption>

  constructor(draw: Draw) {
    this.draw = draw
    this.ctx = draw.getCtx()
    this.options = draw.getOptions()
  }

  public render(color: string, x: number, y: number, width: number, height: number) {
    this.ctx = this.draw.getCtx()
    const { highlightAlpha } = this.options
    this.ctx.save()
    this.ctx.globalAlpha = highlightAlpha
    this.ctx.fillStyle = color
    this.ctx.fillRect(x, y, width, height)
    this.ctx.restore()
  }

}