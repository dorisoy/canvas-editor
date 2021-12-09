import { IElement } from "..";
import { IElementPosition } from "./Element";
import { ITd } from "./table/Td";

export interface ICurrentPosition {
  index: number;
  isImage?: boolean;
  isTable?: boolean;
  isDirectHit?: boolean;
  trIndex?: number;
  tdIndex?: number;
  tdValueIndex?: number;
}

export interface IGetPositionByXYPayload {
  x: number;
  y: number;
  isTable?: boolean;
  td?: ITd;
  tablePosition?: IElementPosition;
  elementList?: IElement[];
  positionList?: IElementPosition[];
}