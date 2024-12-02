const NoteInput = ({ note, setNote }) => (
    <div className="mt-4">
      <textarea
        className="w-full border rounded-lg p-2"
        placeholder="원하는 상담내용을 간단히 적어보세요 ..."
        rows="3"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      ></textarea>
    </div>
  );

export default NoteInput