import "./Footer.css";
import { Route, Router, Link, useNavigate } from "react-router-dom";

import calendar from "./../../assets/images/calendar-add.png";
import edit from "./../../assets/images/edit-2.png";
import home from "./../../assets/images/home2.png";
import mission from "./../../assets/images/award.png";
import profile from "./../../assets/images/profile.png";


const Footer = () => {
  return (
    <footer>
      <Link to={"/member/counseling/main"} style={{ display: "inline-block" }}>
        <img src={calendar} />
      </Link>
      <Link to={"/member/board"} style={{ display: "inline-block" }}>
        <img src={edit} />
      </Link>
      <Link to={"/member/home"} style={{ display: "inline-block" }}>
        <div className="footerHome">
          <img src={home} />
        </div>
      </Link>
      <Link to={"/member/mission/list"} style={{ display: "inline-block" }}>
        <img src={mission} />
      </Link>
      <Link to={"/member/profile"} style={{ display: "inline-block" }}>
        <img src={profile} />
      </Link>
    </footer>      

  );
};

export default Footer;
