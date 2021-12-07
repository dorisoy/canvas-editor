import { IElement } from "../../../.."
import { IEditorOption } from "../../../../interface/Editor"
import { Draw } from "../../Draw"

export class TableParticle {

  private ctx: CanvasRenderingContext2D
  private options: Required<IEditorOption>
  private startX: number
  private startY: number
  private tableWidth: number
  private tableHeight: number

  constructor(draw: Draw) {
    this.ctx = draw.getCtx()
    this.options = draw.getOptions()
    this.startX = 0
    this.startY = 0
    this.tableWidth = 0
    this.tableHeight = 0
  }

  private _drawBorder() {
    this.ctx.beginPath()
    this.ctx.moveTo(this.startX, this.startY)
    this.ctx.lineTo(this.startX + this.tableWidth, this.startY)
    this.ctx.lineTo(this.startX + this.tableWidth, this.startY + this.tableHeight)
    this.ctx.lineTo(this.startX, this.startY + this.tableHeight)
    this.ctx.closePath()
    this.ctx.stroke()
  }

  // @ts-ignore
  private _drawRange(x: number, y: number, width: number, height: number) {
    const { rangeAlpha, rangeColor } = this.options
    this.ctx.save()
    this.ctx.globalAlpha = rangeAlpha
    this.ctx.fillStyle = rangeColor
    this.ctx.fillRect(x, y, width, height)
    this.ctx.restore()
  }

  public computeRowColInfo(element: IElement) {
    const { colgroup, trList } = element
    if (!colgroup || !trList) return
    let x = 0
    let y = 0
    for (let t = 0; t < trList.length; t++) {
      const tr = trList[t]
      // 表格最后一行
      const isLastTr = trList.length - 1 === t
      // 当前行最小高度
      let rowMinHeight = 0
      for (let d = 0; d < tr.tdList.length; d++) {
        const td = tr.tdList[d]
        // 计算之前行x轴偏移量
        let offsetXIndex = 0
        if (trList.length > 1 && t !== 0) {
          for (let pT = 0; pT < t; pT++) {
            const pTr = trList[pT]
            // 相同x轴是否存在跨行
            for (let pD = 0; pD < pTr.tdList.length; pD++) {
              const pTd = pTr.tdList[pD]
              const pTdX = pTd.x!
              const pTdY = pTd.y!
              const pTdWidth = pTd.width!
              const pTdHeight = pTd.height!
              // 小于
              if (pTdX < x) continue
              if (pTdX > x) break
              if (pTd.x === x && pTdY + pTdHeight > y) {
                x += pTdWidth
                offsetXIndex += 1
              }
            }
          }
        }
        // 计算格列数
        let colIndex = 0
        const preTd = tr.tdList[d - 1]
        if (preTd) {
          colIndex = preTd.colIndex! + (offsetXIndex || 1)
          if (preTd.colspan > 1) {
            colIndex += preTd.colspan - 1
          }
        } else {
          colIndex += offsetXIndex
        }
        // 计算格宽高
        let width = 0
        for (let col = 0; col < td.colspan; col++) {
          width += colgroup[col + colIndex].width
        }
        let height = 0
        for (let row = 0; row < td.rowspan; row++) {
          height += trList[row + t].height
        }
        // y偏移量
        if (rowMinHeight === 0 || rowMinHeight > height) {
          rowMinHeight = height
        }
        // 当前行最后一个td
        const isLastRowTd = tr.tdList.length - 1 === d
        // 当前列最后一个td
        let isLastColTd = isLastTr
        if (!isLastColTd) {
          if (td.rowspan > 1) {
            const nextTrLength = trList.length - 1 - t
            isLastColTd = td.rowspan - 1 === nextTrLength
          }
        }
        // 当前表格最后一个td
        const isLastTd = isLastTr && isLastRowTd
        td.isLastRowTd = isLastRowTd
        td.isLastColTd = isLastColTd
        td.isLastTd = isLastTd
        // 修改当前格clientBox
        td.x = x
        td.y = y
        td.width = width
        td.height = height
        td.rowIndex = t
        td.colIndex = colIndex
        // 当前列x轴累加
        x += width
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D, element: IElement, startX: number, startY: number) {
    const { colgroup, trList } = element
    if (!colgroup || !trList) return
    this.ctx = ctx
    this.startX = startX
    this.startY = startY
    let x = startX
    let y = startY
    this.tableWidth = colgroup.reduce((pre, cur) => pre + cur.width, 0)
    this.tableHeight = trList.reduce((pre, cur) => pre + cur.height, 0)
    ctx.save()
    // 渲染边框
    this._drawBorder()
    // 渲染表格
    for (let t = 0; t < trList.length; t++) {
      const tr = trList[t]
      // 表格最后一行
      const isLastTr = trList.length - 1 === t
      // 当前行最小高度
      let rowMinHeight = 0
      for (let d = 0; d < tr.tdList.length; d++) {
        const td = tr.tdList[d]

        // 计算之前行x轴偏移量
        let offsetXIndex = 0
        if (trList.length > 1 && t !== 0) {
          for (let pT = 0; pT < t; pT++) {
            const pTr = trList[pT]
            // 相同x轴是否存在跨行
            for (let pD = 0; pD < pTr.tdList.length; pD++) {
              const pTd = pTr.tdList[pD]
              const pTdX = pTd.x!
              const pTdY = pTd.y!
              const pTdWidth = pTd.width!
              const pTdHeight = pTd.height!
              // 小于
              if (pTdX < x) continue
              if (pTdX > x) break
              if (pTd.x === x && pTdY + pTdHeight > y) {
                x += pTdWidth
                offsetXIndex += 1
              }
            }
          }
        }
        // 计算格列数
        let colIndex = 0
        const preTd = tr.tdList[d - 1]
        if (preTd) {
          colIndex = preTd.colIndex! + (offsetXIndex || 1)
          if (preTd.colspan > 1) {
            colIndex += preTd.colspan - 1
          }
        } else {
          colIndex += offsetXIndex
        }
        // 计算格宽高
        let width = 0
        for (let col = 0; col < td.colspan; col++) {
          width += colgroup[col + colIndex].width
        }
        let height = 0
        for (let row = 0; row < td.rowspan; row++) {
          height += trList[row + t].height
        }
        // y偏移量
        if (rowMinHeight === 0 || rowMinHeight > height) {
          rowMinHeight = height
        }

        // 当前行最后一个td
        const isLastRowTd = tr.tdList.length - 1 === d
        // 当前列最后一个td
        let isLastColTd = isLastTr
        if (!isLastColTd) {
          if (td.rowspan > 1) {
            const nextTrLength = trList.length - 1 - t
            isLastColTd = td.rowspan - 1 === nextTrLength
          }
        }
        // 当前表格最后一个td
        const isLastTd = isLastTr && isLastRowTd

        // 修改当前格clientBox
        td.x = x
        td.y = y
        td.width = width
        td.height = height
        td.colIndex = colIndex

        // 绘制选区
        // this._drawRange()

        // 绘制线条
        x += width
        ctx.beginPath()
        // 一行中的最后td
        if (isLastRowTd && !isLastTd) {
          // 判断是否跨行到底
          if (y + height < startY + this.tableHeight) {
            ctx.moveTo(x, y + height)
            ctx.lineTo(x - width, y + height)
          }
          x = startX
          y += rowMinHeight
        } else if (isLastColTd && !isLastTd) {
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + height)
        } else if (!isLastRowTd && !isLastColTd && !isLastTd) {
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + height)
          ctx.lineTo(x - width, y + height)
        } else if (isLastTd) {
          if (x + width === startX + this.tableWidth) {
            ctx.moveTo(x, y)
            ctx.lineTo(x, y + height)
          }
        }
        ctx.stroke()
      }
    }
    ctx.restore()
  }

}