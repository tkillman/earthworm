import { MOVE_DIRECTION } from "./recoil/gameInfoState";
import GameControllView from "./views/GameControllView";
import GamePannelView, { IRefGamePannelView } from "./views/GamePannelView";
import { useRef } from "react";

function App() {
  const refGamePannelView = useRef<IRefGamePannelView | null>(null);

  const handleKeyBoard = (newDirection: MOVE_DIRECTION) => {
    refGamePannelView.current?.changeKeyBoard(newDirection);
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      <GamePannelView ref={refGamePannelView} />
      <GameControllView handleKeyBoard={handleKeyBoard} />
    </div>
  );
}

export default App;
