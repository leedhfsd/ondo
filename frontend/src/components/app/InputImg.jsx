import { useState } from 'react';
import ImageUploadModal from './ImageUploadModal';

const InputImg = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleImageUpload = (url) => {
    setImageUrl(url);
    closeModal();
  };

  return (
    <div className="mb-6 flex justify-center">
      <div 
        className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center relative cursor-pointer"
        onClick={openModal}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        )}
        <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <ImageUploadModal isOpen={isModalOpen} onClose={closeModal} onUpload={handleImageUpload} />
    </div>
  );
};

export default InputImg;