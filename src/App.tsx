import { MOVE_DIRECTION } from "./recoil/gamePannelViewState";
import GameControllView from "./views/GameControllView";
import GamePannelView, { IRefGamePannelView } from "./views/GamePannelView";
import { useEffect, useRef } from "react";

function App() {
  console.log("App");
  const refGamePannelView = useRef<IRefGamePannelView | null>(null);

  useEffect(() => {
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
        handleKeyBoard(newDirection);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyBoard = (newDirection: MOVE_DIRECTION) => {
    refGamePannelView.current?.changeKeyBoard(newDirection);
  };

  const handleInit = () => {
    refGamePannelView.current?.handleInit();
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      <GamePannelView ref={refGamePannelView} />
      <GameControllView
        handleKeyBoard={handleKeyBoard}
        handleInit={handleInit}
      />
    </div>
  );
}

export default App;
