
const ProfileCard = ({ name, nickname, email }) => {
    return (
      <div className="w-80 border-2 border-black rounded-2xl overflow-hidden font-sans">
        
        <div className="flex p-4 bg-white">
          <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
          <div>
            <h2 className="text-lg font-bold">{name} ({nickname})</h2>
            <p className="text-sm mt-1">{email}</p>
          </div>
        </div>
        {/* 더보기 누르는 경우도 */}
        {/* <div className="bg-white p-3 border-t border-black text-right">
            <a href="">더보기</a>
        </div> */}
      </div>
    );
  };
  
  export default ProfileCard;
  
