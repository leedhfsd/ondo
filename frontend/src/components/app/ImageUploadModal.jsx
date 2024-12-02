import { useState } from 'react';

const ImageUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // 실제 업로드 로직을 여기에 구현해야 합니다.
      // 예시로 파일 URL을 생성하여 전달합니다.
      const imageUrl = URL.createObjectURL(selectedFile);
      onUpload(imageUrl);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">이미지 업로드</h2>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="mb-4"
        />
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2"
          >
            취소
          </button>
          <button 
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={!selectedFile}
          >
            업로드
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;