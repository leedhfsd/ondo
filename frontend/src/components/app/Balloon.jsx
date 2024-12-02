import './Ballon.css'

const Balloon = ({ text }) => {
  return (
    <div className="balloon-container">
      <p className="balloon-text">{text}</p>
    </div>
  )
}

export default Balloon;