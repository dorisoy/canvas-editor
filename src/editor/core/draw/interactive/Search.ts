import { IEditorOption } from "../../../interface/Editor"
import { Position } from "../../position/Position"
import { Draw } from "../Draw"

export class Search {

  private ctx: CanvasRenderingContext2D
  private options: Required<IEditorOption>
  private draw: Draw
  private position: Position

  constructor(draw: Draw) {
    this.ctx = draw.getCtx()
    this.options = draw.getOptions()
    this.draw = draw
    this.position = draw.getPosition()
  }

  public render() {
    this.ctx = this.draw.getCtx()
    const searchMatch = this.draw.getSearchMatch()
    if (!searchMatch || !searchMatch.length) return
    const searchMatchList = searchMatch.flat()
    const positionList = this.position.getPositionList()
    this.ctx.save()
    this.ctx.globalAlpha = this.options.searchMatchAlpha
    this.ctx.fillStyle = this.options.searchMatchColor
    searchMatchList.forEach(s => {
      const position = positionList[s]
      const { leftTop, leftBottom, rightTop } = position.coordinate
      const x = leftTop[0]
      const y = leftTop[1]
      const width = rightTop[0] - leftTop[0]
      const height = leftBottom[1] - leftTop[1]
      this.ctx.fillRect(x, y, width, height)
    })
    this.ctx.restore()
  }

}