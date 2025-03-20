import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';
import '../style/components.css';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [createdImages, setCreatedImages] = useState([]);
    const [savedImages, setSavedImages] = useState([]);

    const fetchProfile = async () => {
        try {
            const res = await apiClient.get(`/users/${user.userId}`);
            setProfile(res.data.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchCreatedImages = async () => {
        try {
            const res = await apiClient.get(`/images/user/${user.userId}`);
            const data = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
            setCreatedImages(data);
        } catch (error) {
            console.error('Error fetching created images:', error);
        }
    };

    const fetchSavedImages = async () => {
        try {
            const res = await apiClient.get(`/savedImage/user/${user.userId}`);
            const data = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
            const detailedImages = await Promise.all(
                data.map(async (item) => {
                    const imageRes = await apiClient.get(`/images/${item.imageId}`);
                    return imageRes.data.data;
                })
            );
            setSavedImages(detailedImages);
        } catch (error) {
            console.error('Error fetching saved images:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchCreatedImages();
        fetchSavedImages();
    }, []);

    const deleteImage = async (imageId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this image?');

        if (confirmDelete) {
            try {
                await apiClient.delete(`/images/${imageId}`);
                setCreatedImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
                alert('Image deleted successfully');
            } catch (error) {
                alert('Failed to delete image');
                console.error('Error deleting image:', error);
            }
        }
    };


    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px', textAlign: 'center' }}>
            {profile ? (
                <>
                    <div style={{
                        width: '100px', height: '100px',
                        borderRadius: '50%', backgroundColor: '#888a8c',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '36px', fontWeight: 'bold', color: 'white',
                        margin: '0 auto 15px'
                    }}>
                        {profile.name.charAt(0).toUpperCase()}
                    </div>

                    <h2 style={{ marginBottom: '10px' }}>{profile.name}</h2>
                    <p style={{ color: '#555' }}>{profile.email}</p>

                    <div style={{ marginTop: '30px' }}>
                        <h3>Images You Created</h3>
                        <div className="gallery-grid">
                            {createdImages.length > 0 ? (
                                createdImages.map((img) => (
                                    <div key={img.id} className="image-card">
                                        <Link to={`/image/${img.id}`}>
                                            <img src={img.url} alt={img.title} />
                                        </Link>
                                        <div className="image-overlay">
                                            <h3>{img.title}</h3>
                                            <button
                                                onClick={() => deleteImage(img.id)}
                                                className="delete-btn">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No images created yet.</p>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <h3>Images You Saved</h3>
                        <div className="gallery-grid">
                            {savedImages.length > 0 ? (
                                savedImages.map((img) => (
                                    <div key={img.id} className="image-card">
                                        <Link to={`/image/${img.id}`}>
                                            <img src={img.url} alt={img.title} />
                                        </Link>
                                        <div className="image-overlay">
                                            <h3>{img.title}</h3>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No images saved yet.</p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;
