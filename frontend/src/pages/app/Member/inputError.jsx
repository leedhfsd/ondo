export default function Error({ message }) {
  return (
    <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
      {message}
    </div>
  );
}
