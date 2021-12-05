import { IElement } from "../Element"

export interface ITd {
  id?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  colspan: number;
  rowspan: number;
  value: IElement[];
}