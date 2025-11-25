import { Request, Response } from 'express';
import * as openaiService from '../services/openaiService';
import fs from 'fs';

export const transcribe = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No audio file provided' });
    }

    try {
        const text = await openaiService.transcribeAudio(req.file.path);
        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);
        res.json({ text });
    } catch (error) {
        // Ensure file is deleted even on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Transcription failed' });
    }
};

export const diagnose = async (req: Request, res: Response) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }

    try {
        const diagnosis = await openaiService.generateDiagnosis(text);
        res.json(diagnosis);
    } catch (error) {
        res.status(500).json({ error: 'Diagnosis generation failed' });
    }
};

export const chat = async (req: Request, res: Response) => {
    const { consultationId, message, context } = req.body;

    if (!consultationId || !message) {
        return res.status(400).json({ error: 'consultationId and message are required' });
    }

    try {
        const response = await openaiService.chatWithContext(consultationId, message, context);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Chat failed' });
    }
};
