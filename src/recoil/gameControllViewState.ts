import { atom } from "recoil";

export interface GameControllViewState {
  isStart: boolean;
}

export const defaultGameControllViewStateValue: GameControllViewState = {
  isStart: false,
};

export const gameControllViewState = atom<GameControllViewState>({
  key: "gameControllViewState",
  default: defaultGameControllViewStateValue,
});
