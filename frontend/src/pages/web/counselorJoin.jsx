import React, { useState } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

function CounselorJoin() {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    gender: 'MALE',
    name: '',
    field: '',
    selfIntroduction: '',
    schedule_id: 1001,
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('joinRequestDto', new Blob([JSON.stringify(formData)], { type: 'application/json' }));

    // profileImage가 선택되지 않은 경우 빈 파일 추가
    if (profileImage) {
      data.append('profileImage', profileImage);
    } else {
      const emptyFile = new Blob([''], { type: 'image/jpeg' });
      data.append('profileImage', emptyFile, 'empty.jpg');
    }

    try {
      const response = await axios.post(`${baseUrl}/counselor/join`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('회원가입 성공:', response.data);
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>ID: </label>
        <input type="text" name="id" value={formData.id} onChange={handleChange} required />
      </div>
      <div>
        <label>Password: </label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <div>
        <label>Gender: </label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </div>
      <div>
        <label>Name: </label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Field: </label>
        <input type="text" name="field" value={formData.field} onChange={handleChange} required />
      </div>
      <div>
        <label>Self Introduction: </label>
        <textarea name="selfIntroduction" value={formData.selfIntroduction} onChange={handleChange} required />
      </div>
      <div>
        <label>Profile Image: </label>
        <input type="file" onChange={handleFileChange} accept="image/*" />
      </div>
      <button type="submit">Join</button>
    </form>
  );
}

export default CounselorJoin;
