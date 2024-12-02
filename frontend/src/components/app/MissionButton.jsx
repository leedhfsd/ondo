import React, { useState } from "react";
import "./MissionButton.css";

function MissionButton({ mission, onComplete, isCompleted, missionType }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const getButtonStyle = () => {
    const baseStyle =
      "mission-button rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_#3D3D3D] cursor-pointer";
    if (missionType === "daily") {
      return `${baseStyle} ${isCompleted ? "bg-[#FFFAD2]" : "bg-white"}`;
    }
    return `${baseStyle} ${isCompleted ? "bg-[#E0E5FF]" : "bg-white"}`;
  };

  const handleClick = () => {
    if (!isCompleted) {
      onComplete(mission);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);   // 0.5초 후 애니메이션 상태 초기화
    }
  };

  const animationClass = missionType === "daily" ? "daily-animate" : "special-animate";

  return (
    <button
      className={`${getButtonStyle()} p-4 w-full text-left ${
        isAnimating ? animationClass : ""
      }`}
      onClick={handleClick}
      disabled={isCompleted}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-2xl font-bold">{mission.exp}P</span>
        <span className="text-sm">
          {missionType === "daily" ? "데일리 미션" : "특별 미션"}
        </span>
      </div>
      <h3 className="text-lg font-bold mb-1">{mission.title}</h3>
      <p className="text-sm text-gray-600">{mission.content}</p>
    </button>
  );
}

export default MissionButton;