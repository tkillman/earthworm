import { useRecoilValue } from "recoil";
import { gamePannelViewState } from "../recoil/gamePannelViewState";

const ScoreView = () => {
  const { score } = useRecoilValue(gamePannelViewState);
  return <div>현재 점수 : {score}</div>;
};

export default ScoreView;
