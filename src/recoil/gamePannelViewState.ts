import { atom } from "recoil";

export const enum LocalStoragyKey {
  "maxScore" = "maxScore",
}

export const enum MOVE_DIRECTION {
  "UP" = "UP",
  "DOWN" = "DOWN",
  "LEFT" = "LEFT",
  "RIGHT" = "RIGHT",
}

export interface GamePannelViewState {
  gameMillSecNum: number;
  isGameOver: boolean;
  totalPannel: [number, number];
  currentShape: Array<{ xy: [number, number]; tailImg?: string }>;
  fruitPannel: [number, number];
  score: number;
  headDegree: number; // 머리 rotate 정보
}

export const defaultGamePannelViewStateValue: GamePannelViewState = {
  gameMillSecNum: 280,
  isGameOver: false,
  totalPannel: [15, 15],
  currentShape: [{ xy: [5, 5] }],
  fruitPannel: [8, 8],
  score: 0,
  headDegree: 270,
};

export const gamePannelViewState = atom<GamePannelViewState>({
  key: "gamePannelViewState",
  default: defaultGamePannelViewStateValue,
});
