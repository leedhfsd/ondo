import PropTypes from 'prop-types'

const Input = ({ label, placeholder, type = "text", name, value, onChange }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-left font-semibold">{label}</label>
    <input
      className="w-full p-2 border rounded"
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      disabled
    />
  </div>
);

export default Input

Input.propTypes = {
  // label: PropTypes.string.isRequired,
  // placeholder: PropTypes.string.isRequired,
  // type: PropTypes.string,
  // name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  // onChange: PropTypes.func.isRequired
}