import { useState, useEffect } from "react";
import "./Thermometer.css"; // CSS 파일을 따로 만들어서 import 합니다.

const Thermometer = ({ character }) => {
  const units = {
    Celcius: "°C",
    Fahrenheit: "°F",
  };

  const [config, setConfig] = useState({
    unit: "Celcius",
    exp: 0,
    level: 1,
    maxExp: 100,
  });

  const setConfigInfo = () => {
    const calMaxExp = 100;
    setConfig({
      unit: "Celcius",
      exp: character.exp,
      level: character.level,
      maxExp: calMaxExp,
    });
  };

  const setTemperature = () => {
    const tempElement = document.getElementById("temperature");
    const { exp, maxExp, unit } = config;
    const temp = maxExp > 0 ? (exp / maxExp) * 100 : 0;
    // const temp = 80;
    tempElement.style.height = temp + "%";
    tempElement.dataset.value = temp + units[unit];
  };

  useEffect(() => {
    setConfigInfo();
  }, [character]);

  useEffect(() => {
    setTemperature();
  }, [config.exp, config.level, config.maxExp]);

  return (
    <div id="wrapper">
      <div id="termometer">
        <div id="temperature" style={{ height: 0 }} data-value="0°C"></div>
        <div id="graduations"></div>
      </div>

      <div id="playground"></div>
    </div>
  );
};

export default Thermometer;
