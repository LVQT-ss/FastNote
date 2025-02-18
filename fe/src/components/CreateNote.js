// File: components/CreateNote.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateNote() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [allNotes, setAllNotes] = useState([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllNotes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/notes');
                setAllNotes(response.data);
            } catch (err) {
                console.error('Failed to fetch notes:', err);
            } finally {
                setNotesLoading(false);
            }
        };

        fetchAllNotes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Note content cannot be empty');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/notes', { content });
            const { code } = response.data;
            navigate(`/note/${code}`);
        } catch (err) {
            setError('Failed to create note. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNoteClick = (code) => {
        navigate(`/note/${code}`);
    };

    return (
        <div className="create-note-page">
            <div className="create-note-container">
                <h2>Create a New Note</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="content">Note Content:</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            placeholder="Enter your note content here..."
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-create">
                        {loading ? 'Creating...' : 'Create Note'}
                    </button>
                </form>
                <div className="access-link">
                    <p>Already have a note code? <a href="/access">Access your note</a></p>
                </div>
            </div>

            <div className="all-notes-container">
                <h2>All Notes</h2>
                {notesLoading ? (
                    <div className="loading">Loading notes...</div>
                ) : allNotes.length > 0 ? (
                    <div className="notes-grid">
                        {allNotes.map(note => (
                            <div key={note.code} className="note-card" onClick={() => handleNoteClick(note.code)}>
                                <div className="note-card-header">
                                    <h3>Note #{note.code}</h3>
                                    <small>{new Date(note.createdAt).toLocaleDateString()}</small>
                                </div>
                                <div className="note-card-content">
                                    <p>{note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-notes">No notes available yet.</p>
                )}
            </div>
        </div>
    );
}

export default CreateNote;