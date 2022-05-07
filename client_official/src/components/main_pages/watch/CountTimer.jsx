import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";

import Countdown from "react-countdown";

const CountTimer = ({ genreName, movieId }) => {
  const state = useContext(GlobalState);

  const finishCountdown = state.usersAPI.finishCountdown;

  // Renderer callback with condition
  const renderer = () => {
    return null;
  };
  return (
    <Countdown
      date={Date.now() + 10000}
      intervalDelay={0}
      precision={3}
      onComplete={() => finishCountdown(genreName, movieId)}
      renderer={renderer}
    />
  );
};

export default CountTimer;
