import { PacmanLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h3 style={styles.text}>잠시만 기다려주세요.</h3>
        <PacmanLoader />
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  container: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    display: "inline-block", // 내부 컨텐츠의 크기에 맞춤
  },
  // text: {
  //   marginBottom: "20px",
  // },
};

export default LoadingSpinner;
