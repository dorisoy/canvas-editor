import { IEditorOption } from "../../../interface/Editor"
import { Draw } from "../Draw"

export class Highlight {

  private ctx: CanvasRenderingContext2D
  private options: Required<IEditorOption>

  constructor(draw: Draw) {
    this.ctx = draw.getCtx()
    this.options = draw.getOptions()
  }

  public render(color: string, x: number, y: number, width: number, height: number) {
    const { highlightAlpha } = this.options
    this.ctx.save()
    this.ctx.globalAlpha = highlightAlpha
    this.ctx.fillStyle = color
    this.ctx.fillRect(x, y, width, height)
    this.ctx.restore()
  }

}