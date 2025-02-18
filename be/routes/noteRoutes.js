// File: routes/noteRoutes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
// Generate a unique random 4-digit code
async function generateUniqueCode() {
    let isUnique = false;
    let code;
    while (!isUnique) {
        // Generate a random 4-digit number
        code = Math.floor(1000 + Math.random() * 9000).toString();
        // Check if the code already exists
        const existingNote = await Note.findOne({ code });
        if (!existingNote) {
            isUnique = true;
        }
    }
    return code;
}
// Get all notes
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find({}, 'code content createdAt updatedAt')
            .sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Create a new note
router.post('/', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        const code = await generateUniqueCode();
        const newNote = new Note({
            code,
            content
        });
        await newNote.save();
        res.status(201).json({
            message: 'Note created successfully',
            code: newNote.code
        });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get a note by code
router.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        if (!code || !/^\d{4}$/.test(code)) {
            return res.status(400).json({ message: 'Invalid code format' });
        }
        const note = await Note.findOne({ code });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        console.error('Error retrieving note:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update a note by code
router.put('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const { content } = req.body;
        if (!code || !/^\d{4}$/.test(code)) {
            return res.status(400).json({ message: 'Invalid code format' });
        }
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        const updatedNote = await Note.findOneAndUpdate(
            { code },
            {
                content,
                updatedAt: Date.now()
            },
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({
            message: 'Note updated successfully',
            note: updatedNote
        });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;