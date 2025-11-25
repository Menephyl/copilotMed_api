import OpenAI from 'openai';
import fs from 'fs';
import { config } from '../config/env';

const openai = new OpenAI({
    apiKey: config.openaiApiKey,
});

export const transcribeAudio = async (filePath: string): Promise<string> => {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-1',
            language: 'pt', // Portuguese
        });
        return transcription.text;
    } catch (error) {
        console.error('Error transcribing audio:', error);
        throw new Error('Failed to transcribe audio');
    }
};

export const generateDiagnosis = async (transcription: string): Promise<any> => {
    const systemPrompt = `Você é um assistente médico sênior. Analise a transcrição da consulta abaixo e gere um relatório técnico. Seja direto, use terminologia médica correta e formate a resposta estritamente como JSON com a seguinte estrutura:
  {
    "diagnostico_provavel": "string",
    "doencas_associadas": ["string"],
    "exames_sugeridos": ["string"],
    "medicamentos_possiveis": ["string"]
  }`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: transcription },
            ],
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No content returned from GPT');
        }
        return JSON.parse(content);
    } catch (error) {
        console.error('Error generating diagnosis:', error);
        throw new Error('Failed to generate diagnosis');
    }
};

// Simple in-memory context store
const chatContexts = new Map<string, OpenAI.Chat.Completions.ChatCompletionMessageParam[]>();

export const chatWithContext = async (consultationId: string, message: string, initialContext?: string): Promise<string> => {
    if (!chatContexts.has(consultationId)) {
        chatContexts.set(consultationId, [
            { role: 'system', content: 'Você é um assistente médico sênior. Responda a perguntas sobre o diagnóstico anterior.' },
        ]);
        if (initialContext) {
            chatContexts.get(consultationId)?.push({ role: 'system', content: `Contexto do diagnóstico: ${initialContext}` });
        }
    }

    const context = chatContexts.get(consultationId)!;
    context.push({ role: 'user', content: message });

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: context,
        });

        const response = completion.choices[0].message.content || '';
        context.push({ role: 'assistant', content: response });
        return response;
    } catch (error) {
        console.error('Error in chat:', error);
        throw new Error('Chat failed');
    }
};
