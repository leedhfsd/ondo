import OpenViduVideoComponent from "./ovVideo";

const UserVideoComponent = ({ streamManager, filterEnabled }) => {
  return (
    <div>
      {streamManager !== undefined ? (
        <div className="streamcomponent">
          <OpenViduVideoComponent streamManager={streamManager} filterEnabled={filterEnabled} />
        </div>
      ) : null}
    </div>
  );
};

export default UserVideoComponent;