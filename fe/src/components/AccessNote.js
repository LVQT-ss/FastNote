// File: components/AccessNote.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AccessNote() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate that code is 4 digits
        if (!/^\d{4}$/.test(code)) {
            setError('Please enter a valid 4-digit code');
            return;
        }

        // Navigate to the note page
        navigate(`/note/${code}`);
    };

    return (
        <div className="access-note-container">
            <h2>Access Your Note</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="code">Enter your 4-digit code:</label>
                    <input
                        type="text"
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="e.g., 1234"
                        maxLength={4}
                        pattern="\d{4}"
                    />
                </div>
                <button type="submit" className="btn-access">Access Note</button>
            </form>
            <div className="create-link">
                <p>Need to create a new note? <a href="/">Create a note</a></p>
            </div>
        </div>
    );
}

export default AccessNote;