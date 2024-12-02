import PropTypes from 'prop-types';
import "./Board.css";
import { useNavigate } from "react-router-dom";
import calendar from "./../../../assets/images/calendar.png";

const Board = ({ article }) => {
  const nav = useNavigate();

  const onClickBoard = () => {
    nav(`/member/board/${article._id}`);
  };

  // 사용자가 보기 편하게 날짜 변환
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Seoul'
    });
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <div
      onClick={onClickBoard}
      className="BoardCard"
      style={{ cursor: "pointer" }}
    >
      <div className="BoardTitle">
        <div id="BD-Title">
          <p>{article.title || '제목 없음'}</p>
        </div>
        <div className="BoardCreate">
          <div style={{width:"18px",height:"18px",marginRight:"5px"}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
            </svg>
          </div>
          <p className="inline-text">{formatDate(article.created_at).slice(0, -1)}</p>
        </div>
      </div>

      <div className="BoardContent">
        <p>{truncateContent(article.content || '내용 없음')}</p>
      </div>
    </div>
  );
};

Board.propTypes = {
  article: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    created_at: PropTypes.string
  }).isRequired
};

export default Board;