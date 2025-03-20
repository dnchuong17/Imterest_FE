import React, { useContext, useState } from 'react';
import '../style/gallery.css';
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../api/apiClient";
import {useNavigate} from "react-router-dom";

const PostImage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();


    const [form, setForm] = useState({
        title: '',
        image: null,
        imageUrl: '',
    });

    const [dragOver, setDragOver] = useState(false);
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const selectedFile = files[0];
            const imageUrl = URL.createObjectURL(selectedFile);
            setForm({ ...form, image: selectedFile, imageUrl });
        } else {
            setForm({ ...form, [name]: value });
        }
    };


    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);

        const droppedFile = e.dataTransfer.files[0];
        const imageUrl = URL.createObjectURL(droppedFile);
        setForm({ ...form, image: droppedFile, imageUrl });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.image) {
            alert('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('image', form.image);
        formData.append('creatorId', user.userId);

        try {
            await apiClient.post('/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Image uploaded successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image.');
        }
    };


    const handleRemoveImage = () => {
        setForm({
            ...form,
            image: null,
            imageUrl: ''
        });
    };

    return (
        <div className="container">
            <div className="left-side">
                <h2>Upload Your Image</h2>
                <form onSubmit={handleSubmit}>
                    {!form.image ? (
                        <div
                            className={`drop-area ${dragOver ? 'drag-over' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('image-upload-input').click()}
                        >
                            <p>Drag and drop an image here, or click to select one</p>
                        </div>
                    ) : (
                        <div className="image-preview">
                            <img src={form.imageUrl} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                            <button type="button" onClick={handleRemoveImage}>
                                Remove Image
                            </button>
                        </div>
                    )}

                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="image-upload-input"
                    />
                </form>
            </div>

            <div className="right-side">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Image Title"
                        required
                    />

                    <button type="submit">Post Image</button>
                </form>
            </div>
        </div>
    );
};

export default PostImage;
