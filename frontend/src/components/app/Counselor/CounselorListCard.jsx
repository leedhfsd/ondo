import './CounselorListCard.css';
import vector from './../../../assets/images/Vector.png';
import { Link } from 'react-router-dom';
import useCounselorStore from '../../../store/app/CounselorStore';

const mainProfileUrl = "https://d1kbrt3q8264bl.cloudfront.net/profile.png";

const CounselorListCard = ({name, gender, field, intro, reservationDate, reservId, profileUrl}) => {
  const { calculateDday, displayGender } = useCounselorStore();
  
  const dday = reservationDate ? calculateDday(reservationDate) : null;

  return (
    <div className="CounselorListCard">
      {reservationDate && (<p id='CS-Date'>{new Date(reservationDate).toLocaleDateString()}</p>)}
      
      <div className='ConSelorCardIn'>
        <div>
          <img 
            src={profileUrl || mainProfileUrl} 
            alt={`${name} 상담사 프로필`} 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = mainProfileUrl;
            }}
          />
        </div>
        <div className='CounselorInfo'>
          <p id='MP-CounselorName'>{name} 상담사({displayGender(gender)})</p>
          <p id='MP-Counselorfield'>{field}</p>
          <p id='MP-Counselorintro'>{intro}</p>
        </div>
        {!dday && !reservId && (<div><img src={vector} alt="Vector" /></div>)}
      </div>

      {reservId && (
        <Link to={`/member/counseling/${reservId}/detail`}>
          <div style={{textAlign: 'right', fontSize: '80%', color: 'black', textDecoration: 'underline'}}>
            더보기
          </div>
        </Link>
      )}
      
      {dday && (
        <div className='CSCardFooter'>
          <div>
            <div className="carousel_pagination">
              <div className="carousel_circle"></div>
              <div className="carousel_circle"></div>
              <div className="carousel_circle"></div>
              <div className="carousel_circle"></div>
            </div>
          </div>
          <div>
            <button id='DdayBtn'>
              <div>
                {dday}
              </div>
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default CounselorListCard;