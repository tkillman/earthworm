import { useRecoilState } from "recoil";
import {
  LocalStoragyKey,
  MOVE_DIRECTION,
  defaultGamePannelViewStateValue,
  gamePannelViewState,
} from "../recoil/gamePannelViewState";
import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import {
  defaultGameControllViewStateValue,
  gameControllViewState,
} from "../recoil/gameControllViewState";
import snakeHead from "../assets/snakeHead.png";
import snakeTail from "../assets/snakeTail.png";
import snakeTurn from "../assets/snakeTurn.png";
import apple from "../assets/apple.png";

interface IProps {}

export interface IRefGamePannelView {
  changeKeyBoard: (newDirection: MOVE_DIRECTION) => void;
  handleInit: VoidFunction;
}

const defaultDirection = MOVE_DIRECTION.RIGHT;

const GamePannelView: React.ForwardRefRenderFunction<
  IRefGamePannelView,
  IProps
> = (_, ref) => {
  const direction = useRef<MOVE_DIRECTION>(defaultDirection);

  const IsMoveCurrentShapeActive = useRef<boolean>(false);

  const [
    {
      gameMillSecNum,
      isGameOver,
      totalPannel,
      currentShape,
      fruitPannel,
      score,
      headDegree,
    },
    setGamePannelViewStateValue,
  ] = useRecoilState(gamePannelViewState);

  const [{ isStart }, setGameControllViewStateValue] = useRecoilState(
    gameControllViewState
  );

  const refTimer = useRef<number | undefined>(undefined);

  const getBgStyle = (indexX: number, indexY: number): React.CSSProperties => {
    const isCurrent = currentShape
      .map((r) => JSON.stringify(r.xy))
      .includes(JSON.stringify([indexX, indexY]));

    const isFruit = fruitPannel[0] === indexX && fruitPannel[1] === indexY;

    const isHead =
      currentShape[0].xy[0] === indexX && currentShape[0].xy[1] === indexY;

    if (isCurrent && isHead) {
      return {
        //backgroundColor: "red",
        backgroundImage: `url(${snakeHead})`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        transform: `rotate(${String(headDegree)}deg)`,
      };
    }

    if (isCurrent && !isHead) {
      const targetImg = currentShape.find(
        (r) => r.xy[0] === indexX && r.xy[1] === indexY
      )?.tailImg;
      if (targetImg) {
        return {
          //backgroundColor: "red",
          backgroundImage: `url(${targetImg})`,
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        };
      }
    }

    if (isFruit) {
      return {
        backgroundImage: `url(${apple})`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
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
    while (!isCheck && count <= 5) {
      const randomNum = Math.floor(Math.random() * maxNum);
      if (!notAllowedNumArr.includes(randomNum)) {
        isCheck = true;
        rtnNum = randomNum;
      }
      count++;
    }

    return rtnNum;
  };

  const createNewFruitPannel = useCallback(
    (existXArr: number[], existYArr: number[]): [number, number] => {
      const newX = getNewNum(totalPannel[0], existXArr);
      const newY = getNewNum(totalPannel[1], existYArr);

      return [newX, newY];
    },
    [totalPannel]
  );

  const moveHead = useCallback(
    (paramHeadShape: [number, number], newDirection: MOVE_DIRECTION) => {
      let rtnNewHeadShape = paramHeadShape;
      if (newDirection === MOVE_DIRECTION.RIGHT) {
        rtnNewHeadShape = [paramHeadShape[0] + 1, paramHeadShape[1]];
      }
      if (newDirection === MOVE_DIRECTION.LEFT) {
        rtnNewHeadShape = [paramHeadShape[0] - 1, paramHeadShape[1]];
      }

      if (newDirection === MOVE_DIRECTION.UP) {
        rtnNewHeadShape = [paramHeadShape[0], paramHeadShape[1] - 1];
      }

      if (newDirection === MOVE_DIRECTION.DOWN) {
        rtnNewHeadShape = [paramHeadShape[0], paramHeadShape[1] + 1];
      }
      return rtnNewHeadShape;
    },
    []
  );

  const getHeadDegreeByDirection = (newDirection: MOVE_DIRECTION) => {
    let rtnHeadDegree = 0;

    if (newDirection === MOVE_DIRECTION.DOWN) {
      return rtnHeadDegree;
    }

    if (newDirection === MOVE_DIRECTION.LEFT) {
      return (rtnHeadDegree = 90);
    }

    if (newDirection === MOVE_DIRECTION.UP) {
      return (rtnHeadDegree = 180);
    }

    if (newDirection === MOVE_DIRECTION.RIGHT) {
      return (rtnHeadDegree = 270);
    }

    return rtnHeadDegree;
  };

  const moveCurrentShape = useCallback(
    (newDirection: MOVE_DIRECTION) => {
      if (IsMoveCurrentShapeActive.current) {
        return;
      }

      IsMoveCurrentShapeActive.current = true;

      setGamePannelViewStateValue((prev) => {
        let nextCurrentShape = prev.currentShape;

        if (prev.currentShape.length === 1) {
          nextCurrentShape = [
            {
              xy: moveHead(prev.currentShape[0].xy, newDirection),
              tailImg: snakeTail,
            },
          ];
        } else {
          const newHeadShape = moveHead(prev.currentShape[0].xy, newDirection);
          const newTailShape = prev.currentShape.slice(
            0,
            prev.currentShape.length - 1
          );

          nextCurrentShape = [
            { xy: newHeadShape, tailImg: snakeTail },
            ...newTailShape,
          ];
        }

        const isGameOver = calcIsGameOVer(
          prev.totalPannel,
          nextCurrentShape.map((r) => r.xy)
        );
        const isAteFruit = calcIsAteFruit(
          prev.fruitPannel,
          nextCurrentShape.map((r) => r.xy)
        );

        if (isAteFruit) {
          nextCurrentShape = [{ xy: prev.fruitPannel }, ...prev.currentShape];
        }

        const newFruitPannel = isAteFruit
          ? createNewFruitPannel(
              [prev.fruitPannel[0], ...nextCurrentShape.map((r) => r.xy[0])],
              [prev.fruitPannel[1], ...nextCurrentShape.map((r) => r.xy[1])]
            )
          : prev.fruitPannel;

        return {
          ...prev,
          currentShape: nextCurrentShape,
          isGameOver,
          fruitPannel: newFruitPannel,
          gameMillSecNum: isAteFruit
            ? prev.gameMillSecNum - 5
            : prev.gameMillSecNum,
          score: isAteFruit ? prev.score + 1 : prev.score,
          headDegree: getHeadDegreeByDirection(newDirection),
        };
      });

      IsMoveCurrentShapeActive.current = false;
    },
    [moveHead, setGamePannelViewStateValue, createNewFruitPannel]
  );

  const stopGame = () => {
    if (refTimer.current) clearInterval(refTimer.current);
  };

  useEffect(() => {
    if (isStart) {
      refTimer.current = setInterval(() => {
        moveCurrentShape(direction.current);
      }, gameMillSecNum);
    }

    return () => {
      stopGame();
    };
  }, [isStart, gameMillSecNum, moveCurrentShape]);

  const handleInit = useCallback(() => {
    direction.current = defaultDirection;
    IsMoveCurrentShapeActive.current = false;
    setGamePannelViewStateValue(defaultGamePannelViewStateValue);
  }, [setGamePannelViewStateValue]);

  useEffect(() => {
    if (!isGameOver) {
      return;
    }

    stopGame();
    window.alert("game over");
    handleInit();
    setGameControllViewStateValue(defaultGameControllViewStateValue);
    const maxScore = Number(
      localStorage.getItem(LocalStoragyKey.maxScore) ?? 0
    );

    if (score > maxScore) {
      localStorage.setItem(LocalStoragyKey.maxScore, String(score));
    }
  }, [isGameOver, score, handleInit, setGameControllViewStateValue]);

  const changeKeyBoard = (newDirection: MOVE_DIRECTION) => {
    // if (!isStart) {
    //   return;
    // }

    if (
      (newDirection === MOVE_DIRECTION.UP &&
        direction.current === MOVE_DIRECTION.DOWN) ||
      (newDirection === MOVE_DIRECTION.DOWN &&
        direction.current === MOVE_DIRECTION.UP) ||
      (newDirection === MOVE_DIRECTION.LEFT &&
        direction.current === MOVE_DIRECTION.RIGHT) ||
      (newDirection === MOVE_DIRECTION.RIGHT &&
        direction.current === MOVE_DIRECTION.LEFT)
    ) {
      //거꾸로 가는 로직 방지
      return;
    }

    moveCurrentShape(newDirection);
    //changeHeadCss(newDirection);
    direction.current = newDirection;
  };

  useImperativeHandle(ref, () => ({
    changeKeyBoard,
    handleInit,
  }));

  return (
    <div className="flex flex-col">
      {JSON.stringify(currentShape)}
      {Array(totalPannel[1])
        .fill(null)
        .map((_, indexY) => {
          return (
            <div className="flex" key={indexY}>
              {Array(totalPannel[0])
                .fill(null)
                .map((_, indexX) => {
                  return (
                    <div
                      key={indexX}
                      data-x={indexX}
                      data-y={indexY}
                      className={`w-[30px] h-[30px]  border border-solid border-black box-border`}
                      style={getBgStyle(indexX, indexY)}
                    ></div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
};

const RefGamePannelView = forwardRef<IRefGamePannelView, IProps>(
  GamePannelView
);

export default RefGamePannelView;
