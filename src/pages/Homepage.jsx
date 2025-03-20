import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';
import '../style/gallery.css';

const HomePage = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await apiClient.get('/images');
                setImages(res.data?.data || []);
            } catch (error) {
                console.error('Error fetching images:', error);
                setImages([]);
            }
        };

        fetchImages();
    }, []);


    return (
        <div>
            <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Explore</h1>
            <div className="gallery-grid">
                {images.map((img) => (
                    <div key={img.id} className="image-card">
                        <Link to={`/image/${img.id}`}>
                            <img src={img.url} alt={img.title} />
                        </Link>
                        <div className="image-overlay">
                            <h3>{img.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
