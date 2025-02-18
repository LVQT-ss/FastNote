// File: components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/notes');
            setNotes(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load notes. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNoteClick = (code) => {
        navigate(`/note/${code}`);
    };

    const handleCreateNew = () => {
        navigate('/');
    };

    const sortNotes = (notesList) => {
        const sorted = [...notesList];

        switch (sortOption) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'lastUpdated':
                return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            case 'codeAsc':
                return sorted.sort((a, b) => a.code.localeCompare(b.code));
            case 'codeDesc':
                return sorted.sort((a, b) => b.code.localeCompare(a.code));
            default:
                return sorted;
        }
    };

    const filterNotes = (notesList) => {
        if (!searchTerm.trim()) return notesList;

        return notesList.filter(note =>
            note.code.includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const promptDeleteNote = (code, e) => {
        e.stopPropagation();
        setConfirmDelete(code);
    };

    const cancelDelete = (e) => {
        e.stopPropagation();
        setConfirmDelete(null);
    };

    const handleDeleteNote = async (code, e) => {
        e.stopPropagation();
        try {
            await axios.delete(`http://localhost:5000/api/notes/${code}`);
            setNotes(notes.filter(note => note.code !== code));
            setConfirmDelete(null);
        } catch (err) {
            setError('Failed to delete note. Please try again.');
            console.error(err);
        }
    };

    const getFilteredAndSortedNotes = () => {
        return sortNotes(filterNotes(notes));
    };

    const getTruncatedContent = (content, maxLength = 100) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Notes Dashboard</h2>
                <button onClick={handleCreateNew} className="btn-create-new">Create New Note</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="dashboard-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by code or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="sort-container">
                    <label htmlFor="sort">Sort by: </label>
                    <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="sort-select"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="lastUpdated">Last Updated</option>
                        <option value="codeAsc">Code (Ascending)</option>
                        <option value="codeDesc">Code (Descending)</option>
                    </select>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="stat-box">
                    <h3>Total Notes</h3>
                    <p>{notes.length}</p>
                </div>
                <div className="stat-box">
                    <h3>Recently Updated</h3>
                    <p>{notes.filter(note =>
                        new Date(note.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                    ).length}</p>
                </div>
            </div>

            {getFilteredAndSortedNotes().length === 0 ? (
                <div className="no-notes-message">
                    {searchTerm ? 'No notes match your search.' : 'No notes available yet.'}
                </div>
            ) : (
                <div className="notes-table-container">
                    <table className="notes-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Content</th>
                                <th>Created</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredAndSortedNotes().map(note => (
                                <tr key={note.code} onClick={() => handleNoteClick(note.code)}>
                                    <td>{note.code}</td>
                                    <td className="note-content-cell">{getTruncatedContent(note.content)}</td>
                                    <td>{new Date(note.createdAt).toLocaleString()}</td>
                                    <td>{new Date(note.updatedAt).toLocaleString()}</td>
                                    <td className="actions-cell">
                                        {confirmDelete === note.code ? (
                                            <div className="confirm-delete">
                                                <span>Are you sure?</span>
                                                <button
                                                    onClick={(e) => handleDeleteNote(note.code, e)}
                                                    className="btn-confirm-delete"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={cancelDelete}
                                                    className="btn-cancel-delete"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => promptDeleteNote(note.code, e)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Dashboard;