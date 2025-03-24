import React, { useState } from 'react';
import api from '../api/api';

const ProfileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) return alert('Please select a file');

        const userId = localStorage.getItem('userId');
        if (!userId) return alert('User not found');

        const formData = new FormData();
        formData.append('profilePic', file);

        try {
            const token = localStorage.getItem('token');
            await api.post(`/upload/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Upload successful');
            setFile(null);
            setPreview(null);
        } catch (error) {
            alert('Upload failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Upload Profile Picture</h2>

                <div className="mb-4 flex flex-col items-center">
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-24 h-24 rounded-full border-2 border-gray-300 mb-3" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-3">
                            No Image
                        </div>
                    )}

                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="hidden" 
                        id="fileInput"
                    />
                    <label 
                        htmlFor="fileInput" 
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Choose File
                    </label>
                </div>

                <button 
                    onClick={handleUpload} 
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                    disabled={!file}
                >
                    Upload
                </button>
            </div>
        </div>
    );
};

export default ProfileUpload;
