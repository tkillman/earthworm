import { atom } from "recoil";
import snakeHead from "../assets/snakeHead.png";

export const enum LocalStoragyKey {
  "maxScore" = "maxScore",
}

export const enum MOVE_DIRECTION {
  "UP" = "UP",
  "DOWN" = "DOWN",
  "LEFT" = "LEFT",
  "RIGHT" = "RIGHT",
}

export type TypeXy = [number, number];

export interface IImgInfo {
  tailImg: string;
  rotateDegree: number;
}

export type Shape = { xy: TypeXy; imgImfo?: IImgInfo };
export type TypeCurrentShapeArr = Array<Shape>;

export interface GamePannelViewState {
  gameMillSecNum: number;
  isGameOver: boolean;
  totalPannel: TypeXy;
  currentShape: TypeCurrentShapeArr;
  fruitPannel: TypeXy;
  score: number;
}

export const defaultGamePannelViewStateValue: GamePannelViewState = {
  gameMillSecNum: 280,
  isGameOver: false,
  totalPannel: [15, 15],
  currentShape: [
    { xy: [5, 5], imgImfo: { tailImg: snakeHead, rotateDegree: 270 } },
  ],
  fruitPannel: [8, 8],
  score: 0,
};

export const gamePannelViewState = atom<GamePannelViewState>({
  key: "gamePannelViewState",
  default: defaultGamePannelViewStateValue,
});
