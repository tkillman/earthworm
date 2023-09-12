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

export interface GameInfoState {
  gameMillSecNum: number;
  isStart: boolean;
  isGameOver: boolean;
  totalPannel: [number, number];
  currentShape: Array<[number, number]>;
  fruitPannel: [number, number];
  direction: MOVE_DIRECTION;
  score: number;
}

export const defaultGameInfoState: GameInfoState = {
  gameMillSecNum: 280,
  isStart: false,
  isGameOver: false,
  totalPannel: [15, 15],
  currentShape: [[5, 5]],
  fruitPannel: [8, 8],
  direction: MOVE_DIRECTION.RIGHT,
  score: 0,
};

export const gameInfoState = atom<GameInfoState>({
  key: "gameInfoState",
  default: defaultGameInfoState,
});
