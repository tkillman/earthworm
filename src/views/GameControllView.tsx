import { useRecoilState } from "recoil";
import arrowUp from "/src/assets/arrow-up.png";
import arrowDown from "/src/assets/arrow-down.png";
import arrowLeft from "/src/assets/arrow-left.png";
import arrowRight from "/src/assets/arrow-right.png";
import {
  defaultGameControllViewStateValue,
  gameControllViewState,
} from "../recoil/gameControllViewState";
import { LocalStoragyKey, MOVE_DIRECTION } from "../recoil/gamePannelViewState";
import ScoreView from "./ScoreView";

const KEY_BOARD_WIDTH = 50;

interface IProps {
  handleKeyBoard?: (newDirection: MOVE_DIRECTION) => void;
  handleInit?: VoidFunction;
}

const GameControllView: React.FC<IProps> = (props) => {
  const [{ isStart }, setGameControllViewState] = useRecoilState(
    gameControllViewState
  );

  const onClickInit = () => {
    setGameControllViewState(defaultGameControllViewStateValue);
    props.handleInit?.();
  };

  const onClickButtonStart = () => {
    setGameControllViewState((prev) => ({
      ...prev,
      isStart: !prev.isStart,
    }));
  };

  const onClickKeyBoard = (newDirection: MOVE_DIRECTION) => () => {
    props?.handleKeyBoard?.(newDirection);
  };

  return (
    <div className="flex">
      <div className="flex flex-col gap-1">
        <div>
          <button
            type="button"
            onClick={onClickInit}
            className="btn bg-blue-500"
          >
            초기화
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={onClickButtonStart}
            className={`btn w-[140px] ${
              isStart ? "bg-blue-500" : "bg-red-500"
            }`}
          >
            Game {isStart ? "Stop" : "Start"}
          </button>
        </div>
        <div>
          최고점수 : {localStorage.getItem(LocalStoragyKey.maxScore) ?? 0}
        </div>
        <ScoreView />
      </div>
      <div className="flex flex-col justify-around items-center min-w-[240px] gap-3">
        <div className="flex">
          <img
            src={arrowUp}
            alt="up"
            width={KEY_BOARD_WIDTH}
            onClick={onClickKeyBoard(MOVE_DIRECTION.UP)}
          ></img>
        </div>
        <div className="flex gap-20">
          <img
            src={arrowLeft}
            alt="left"
            width={KEY_BOARD_WIDTH}
            onClick={onClickKeyBoard(MOVE_DIRECTION.LEFT)}
          ></img>
          <img
            src={arrowRight}
            alt="right"
            width={KEY_BOARD_WIDTH}
            onClick={onClickKeyBoard(MOVE_DIRECTION.RIGHT)}
          ></img>
        </div>
        <div>
          <img
            src={arrowDown}
            alt="down"
            width={KEY_BOARD_WIDTH}
            onClick={onClickKeyBoard(MOVE_DIRECTION.DOWN)}
          ></img>
        </div>
      </div>
    </div>
  );
};

export default GameControllView;
