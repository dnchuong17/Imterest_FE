import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { AuthContext } from '../contexts/AuthContext';
import '../style/imageDetail.css';
import 'font-awesome/css/font-awesome.min.css';


const ImageDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const fetchImageDetail = async () => {
        try {
            const res = await apiClient.get(`/images/${id}`);
            setImage(res.data.data);
        } catch (error) {
            console.error('Failed to fetch image detail:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await apiClient.get(`/comments/${id}`);
            const data = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
            setComments(data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const checkSaved = async () => {
        try {
            const res = await apiClient.get(`/savedImage/${id}?userId=${user.userId}`);
            setIsSaved(!!res.data);
        } catch (error) {
            console.error('Failed to check saved image:', error);
        }
    };

    const handleSaveImage = async () => {
        try {
            await apiClient.post(`/savedImage`, { imageId: id, userId: user.userId });
            setIsSaved(true);
        } catch (error) {
            console.error('Failed to save image:', error);
        }
    };

    const handleComment = async (e) => {
        if (e.key === 'Enter' && newComment.trim()) {
            e.preventDefault();
            try {
                await apiClient.post(`/comments/${id}`, { text: newComment, userId: user.userId });
                setNewComment('');
                fetchComments();
            } catch (error) {
                console.error('Failed to post comment:', error);
            }
        }
    };

    useEffect(() => {
        fetchImageDetail();
        fetchComments();
        checkSaved();
    }, [id]);

    return (
        <div className="image-detail-container">
            {image ? (
                <div className="image-content">
                    {/* Image Container */}
                    <div className="image-container">
                        <img src={image.url} alt={image.title} />
                    </div>

                    {/* Comment Container */}
                    <div className="comment-container">
                        <h2>{image.title}</h2>
                        <p>By: {image.creator?.name || 'Unknown'}</p>

                        <div className="button-container">
                            <button
                                className="button save-button"
                                onClick={handleSaveImage}
                                disabled={isSaved}
                            >
                                {isSaved ? 'Saved' : 'Save'}
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div className="comments-section">
                            <h3>Comments</h3>
                            {comments.length === 0 ? <p>No comments yet.</p> : (
                                comments.map((cmt) => (
                                    <div key={cmt.id} className="comment">
                                        <strong>{cmt.user?.name || 'Unknown'}:</strong> {cmt.text}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Comment input */}
                        <div className="comment-box">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPressCapture={handleComment}
                                placeholder="Add a comment..."
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading image detail...</p>
            )}
        </div>
    );
};

export default ImageDetail;
