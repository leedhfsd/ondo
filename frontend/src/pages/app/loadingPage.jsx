import { styled, keyframes } from "styled-components";

const View = styled.div`
  height: 100%;
  width: 100%;
`;
const LodingIcon = styled.div``;
const LoadingPage = () => {
  return (
    <View>
      <LodingIcon></LodingIcon>
      <p>Loading...</p>
    </View>
  );
};

export default LoadingPage;
