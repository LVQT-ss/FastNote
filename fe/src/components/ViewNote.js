// File: components/ViewNote.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewNote() {
    const { code } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [updateStatus, setUpdateStatus] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/notes/${code}`);
                setNote(response.data);
                setEditedContent(response.data.content);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError('Note not found. Please check your code and try again.');
                } else {
                    setError('Failed to load note. Please try again later.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (code && /^\d{4}$/.test(code)) {
            fetchNote();
        } else {
            setError('Invalid note code');
            setLoading(false);
        }
    }, [code]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        setUpdateStatus('Saving...');
        try {
            await axios.put(`http://localhost:5000/api/notes/${code}`, {
                content: editedContent
            });
            setNote({ ...note, content: editedContent });
            setIsEditing(false);
            setUpdateStatus('Note saved successfully!');
            setTimeout(() => setUpdateStatus(''), 3000);
        } catch (err) {
            setUpdateStatus('Failed to save note. Please try again.');
            console.error(err);
        }
    };

    const handleCancel = () => {
        setEditedContent(note.content);
        setIsEditing(false);
    };

    const handleBack = () => {
        navigate('/');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">{error}</div>
                <button onClick={handleBack} className="btn-back">Go Back</button>
            </div>
        );
    }

    return (
        <div className="view-note-container">
            <h2>Note #{code}</h2>

            {isEditing ? (
                <div className="edit-note-container">
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={10}
                        className="edit-textarea"
                    />
                    <div className="edit-actions">
                        <button onClick={handleSave} className="btn-save">Save Changes</button>
                        <button onClick={handleCancel} className="btn-cancel">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="note-content">
                    <p>{note?.content}</p>
                </div>
            )}

            {updateStatus && <div className="update-status">{updateStatus}</div>}

            <div className="created-at">
                <small>Created: {new Date(note?.createdAt).toLocaleString()}</small>
                {note?.updatedAt && note.updatedAt !== note.createdAt &&
                    <small> | Updated: {new Date(note?.updatedAt).toLocaleString()}</small>
                }
            </div>

            <div className="note-actions">
                {!isEditing && <button onClick={handleEdit} className="btn-edit">Edit Note</button>}
                <button onClick={handleBack} className="btn-back">Back to Home</button>
            </div>
        </div>
    );
}

export default ViewNote;