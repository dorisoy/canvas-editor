import { IElement } from "../Element"

export interface ITd {
  id?: string;
  colspan: number;
  rowspan: number;
  value: IElement[];
}