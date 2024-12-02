import { styled } from "styled-components";
import { useState, useEffect } from "react";
import Forest from "./components/forest";
import Box from "./components/Box";
import BlackView from "./components/blackView";

const View = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  & > * {
    overflow: hidden;
  }
  overflow: hidden;
`;

const Story = () => {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);
    console.log(clickCount);
  };

  return (
    <View>
      {clickCount < 3 && (
        <Forest clickCount={clickCount} handleClick={handleClick} />
      )}
      {1 < clickCount && clickCount < 5 && (
        <BlackView clickCount={clickCount} handleClick={handleClick} />
      )}
      {3 < clickCount && clickCount < 16 && (
        <Box clickCount={clickCount} handleClick={handleClick} />
      )}
    </View>
  );
};

export default Story;
