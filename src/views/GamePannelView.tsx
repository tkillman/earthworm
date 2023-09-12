import { useRecoilState } from "recoil";
import {
  LocalStoragyKey,
  MOVE_DIRECTION,
  defaultGameInfoState,
  gameInfoState,
} from "../recoil/gameInfoState";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface IProps {}

export interface IRefGamePannelView {
  changeKeyBoard: (newDirection: MOVE_DIRECTION) => void;
}

const GamePannelView: React.ForwardRefRenderFunction<
  IRefGamePannelView,
  IProps
> = (_, ref) => {
  console.log("GamePannelView");
  const [
    {
      gameMillSecNum,
      isStart,
      isGameOver,
      totalPannel,
      currentShape,
      fruitPannel,
      direction,
      score,
    },
    setGameInfoStateValue,
  ] = useRecoilState(gameInfoState);

  const refTimer = useRef<number | undefined>(undefined);

  const maxScore = Number(localStorage.getItem(LocalStoragyKey.maxScore) ?? 0);

  const getBgColor = (
    isCurrent: boolean,
    isNext: boolean
  ): React.CSSProperties => {
    if (isCurrent) {
      return {
        backgroundColor: "orange",
      };
    }

    if (isNext) {
      return {
        backgroundColor: "blue",
      };
    }

    return {
      backgroundColor: "gray",
    };
  };

  const calcIsGameOVer = (
    paramTotalPannel: [number, number],
    nextCurrentShape: [number, number][]
  ) => {
    const headCurrentShape = nextCurrentShape[0];

    // 게임 영역을 벗어난 경우
    if (
      paramTotalPannel[0] <= headCurrentShape[0] ||
      paramTotalPannel[1] <= headCurrentShape[1] ||
      headCurrentShape[0] < 0 ||
      headCurrentShape[1] < 0
    ) {
      return true;
    }

    // 자기 몸에 겹친 경우
    const nextCurrentShapeSetObj = new Set(
      nextCurrentShape.map((r) => JSON.stringify(r))
    );

    const isCrash = nextCurrentShapeSetObj.size < nextCurrentShape.length;

    if (isCrash) {
      return true;
    }
    return false;
  };

  const calcIsAteFruit = (
    paramFruitPannel: [number, number],
    nextCurrentShape: [number, number][]
  ) => {
    const headCurrentShape = nextCurrentShape[0];

    if (
      paramFruitPannel[0] === headCurrentShape[0] &&
      paramFruitPannel[1] === headCurrentShape[1]
    ) {
      return true;
    }
    return false;
  };

  const getNewNum = (maxNum: number, notAllowedNumArr: number[]): number => {
    let count = 0;
    let rtnNum = 5;
    let isCheck = false;
    while (!isCheck || count > 5) {
      const randomNum = Math.floor(Math.random() * maxNum);
      if (!notAllowedNumArr.includes(randomNum)) {
        isCheck = true;
        rtnNum = randomNum;
      }
      count++;
    }

    return rtnNum;
  };

  const createNewFruitPannel = (
    existXArr: number[],
    existYArr: number[]
  ): [number, number] => {
    const newX = getNewNum(totalPannel[0], existXArr);
    const newY = getNewNum(totalPannel[1], existYArr);

    return [newX, newY];
  };

  const moveHead = (paramHeadShape: [number, number]) => {
    let rtnNewHeadShape = paramHeadShape;
    if (direction === MOVE_DIRECTION.RIGHT) {
      rtnNewHeadShape = [paramHeadShape[0] + 1, paramHeadShape[1]];
    }
    if (direction === MOVE_DIRECTION.LEFT) {
      rtnNewHeadShape = [paramHeadShape[0] - 1, paramHeadShape[1]];
    }

    if (direction === MOVE_DIRECTION.UP) {
      rtnNewHeadShape = [paramHeadShape[0], paramHeadShape[1] - 1];
    }

    if (direction === MOVE_DIRECTION.DOWN) {
      rtnNewHeadShape = [paramHeadShape[0], paramHeadShape[1] + 1];
    }
    return rtnNewHeadShape;
  };

  const moveCurrentShape = () => {
    setGameInfoStateValue((prev) => {
      let nextCurrentShape = prev.currentShape;

      if (prev.currentShape.length === 1) {
        nextCurrentShape = [moveHead(prev.currentShape[0])];
      } else {
        const newHeadShape = moveHead(prev.currentShape[0]);
        const newTailShape = prev.currentShape.slice(
          0,
          prev.currentShape.length - 1
        );

        nextCurrentShape = [newHeadShape, ...newTailShape];
      }

      const isGameOver = calcIsGameOVer(prev.totalPannel, nextCurrentShape);
      const isAteFruit = calcIsAteFruit(prev.fruitPannel, nextCurrentShape);

      if (isAteFruit) {
        nextCurrentShape = [prev.fruitPannel, ...prev.currentShape];
      }

      const newFruitPannel = isAteFruit
        ? createNewFruitPannel(
            [prev.fruitPannel[0], ...nextCurrentShape.map((r) => r[0])],
            [prev.fruitPannel[1], ...nextCurrentShape.map((r) => r[1])]
          )
        : prev.fruitPannel;

      return {
        ...prev,
        currentShape: nextCurrentShape,
        isGameOver,
        fruitPannel: newFruitPannel,
        gameMillSecNum: isAteFruit
          ? prev.gameMillSecNum - 20
          : prev.gameMillSecNum,
        score: isAteFruit ? prev.score + 1 : prev.score,
      };
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    let newDirection: MOVE_DIRECTION | undefined;
    if (event.code === "ArrowUp") {
      // 왼쪽 오른쪽으로 가고 있을 때만 up 버튼
      newDirection = MOVE_DIRECTION.UP;
    }

    if (event.code === "ArrowDown") {
      newDirection = MOVE_DIRECTION.DOWN;
    }

    if (event.code === "ArrowLeft") {
      // 위 아래로 가고 있을 때만 left 버튼
      newDirection = MOVE_DIRECTION.LEFT;
    }

    if (event.code === "ArrowRight") {
      newDirection = MOVE_DIRECTION.RIGHT;
    }

    if (newDirection) {
      changeKeyBoard(newDirection);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const stopGame = () => {
    if (refTimer.current) clearInterval(refTimer.current);
  };

  useEffect(() => {
    if (isStart) {
      refTimer.current = setInterval(() => {
        moveCurrentShape();
      }, gameMillSecNum);
    }

    return () => {
      stopGame();
    };
  }, [isStart, gameMillSecNum, direction]);

  useEffect(() => {
    if (isGameOver) {
      stopGame();
      window.alert("game over");
      setGameInfoStateValue(defaultGameInfoState);

      if (score > maxScore) {
        localStorage.setItem(LocalStoragyKey.maxScore, String(score));
      }
    }
  }, [isGameOver]);

  const changeKeyBoard = (newDirection: MOVE_DIRECTION) => {
    setGameInfoStateValue((prev) => {
      let checkedNewDirection: MOVE_DIRECTION = prev.direction;
      console.log(
        "키보드 변경 실행",
        "현재값 : ",
        checkedNewDirection,
        "변경값 :",
        newDirection
      );
      if (
        newDirection === MOVE_DIRECTION.UP &&
        [MOVE_DIRECTION.LEFT, MOVE_DIRECTION.RIGHT].includes(prev.direction)
      ) {
        // 왼쪽 오른쪽으로 가고 있을 때만 up 버튼
        checkedNewDirection = MOVE_DIRECTION.UP;
      }

      if (
        newDirection === MOVE_DIRECTION.DOWN &&
        [MOVE_DIRECTION.LEFT, MOVE_DIRECTION.RIGHT].includes(prev.direction)
      ) {
        checkedNewDirection = MOVE_DIRECTION.DOWN;
      }

      if (
        newDirection === MOVE_DIRECTION.LEFT &&
        [MOVE_DIRECTION.UP, MOVE_DIRECTION.DOWN].includes(prev.direction)
      ) {
        checkedNewDirection = MOVE_DIRECTION.LEFT;
      }

      if (
        newDirection === MOVE_DIRECTION.RIGHT &&
        [MOVE_DIRECTION.UP, MOVE_DIRECTION.DOWN].includes(prev.direction)
      ) {
        checkedNewDirection = MOVE_DIRECTION.RIGHT;
      }

      return {
        ...prev,
        direction: checkedNewDirection,
      };
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      changeKeyBoard,
    }),
    []
  );

  return (
    <div className="flex flex-col">
      {Array(totalPannel[1])
        .fill(null)
        .map((_, indexY) => {
          return (
            <div className="flex" key={indexY}>
              {Array(totalPannel[0])
                .fill(null)
                .map((_, indexX) => {
                  const isCurrent = currentShape
                    .map((r) => JSON.stringify(r))
                    .includes(JSON.stringify([indexX, indexY]));

                  const isNext =
                    fruitPannel[0] === indexX && fruitPannel[1] === indexY;

                  return (
                    <div
                      key={indexX}
                      data-x={indexX}
                      data-y={indexY}
                      className={`w-[30px] h-[30px]  border border-solid border-black box-border`}
                      style={getBgColor(isCurrent, isNext)}
                    ></div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
};

export default forwardRef(GamePannelView);
