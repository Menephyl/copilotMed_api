"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithContext = exports.generateDiagnosis = exports.transcribeAudio = void 0;
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("../config/env");
const openai = new openai_1.default({
    apiKey: env_1.config.openaiApiKey,
});
const transcribeAudio = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transcription = yield openai.audio.transcriptions.create({
            file: fs_1.default.createReadStream(filePath),
            model: 'whisper-1',
            language: 'pt', // Portuguese
        });
        return transcription.text;
    }
    catch (error) {
        console.error('Error transcribing audio:', error);
        throw new Error('Failed to transcribe audio');
    }
});
exports.transcribeAudio = transcribeAudio;
const generateDiagnosis = (transcription, history) => __awaiter(void 0, void 0, void 0, function* () {
    const systemPrompt = `Você é um assistente médico sênior. Analise a transcrição da consulta abaixo e gere um relatório técnico. Seja direto, use terminologia médica correta e formate a resposta estritamente como JSON com a seguinte estrutura:
  {
    "diagnostico_provavel": "string",
    "doencas_associadas": ["string"],
    "exames_sugeridos": ["string"],
    "medicamentos_possiveis": ["string"]
  }`;
    const messages = [
        { role: 'system', content: systemPrompt },
    ];
    if (history && history.length > 0) {
        messages.push(...history);
    }
    messages.push({ role: 'user', content: transcription });
    try {
        const completion = yield openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages,
            response_format: { type: 'json_object' },
        });
        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No content returned from GPT');
        }
        return JSON.parse(content);
    }
    catch (error) {
        console.error('Error generating diagnosis:', error);
        throw new Error('Failed to generate diagnosis');
    }
});
exports.generateDiagnosis = generateDiagnosis;
// Simple in-memory context store
const chatContexts = new Map();
const chatWithContext = (consultationId, message, initialContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!chatContexts.has(consultationId)) {
        chatContexts.set(consultationId, [
            { role: 'system', content: 'Você é um assistente médico sênior. Responda a perguntas sobre o diagnóstico anterior.' },
        ]);
        if (initialContext) {
            (_a = chatContexts.get(consultationId)) === null || _a === void 0 ? void 0 : _a.push({ role: 'system', content: `Contexto do diagnóstico: ${initialContext}` });
        }
    }
    const context = chatContexts.get(consultationId);
    context.push({ role: 'user', content: message });
    try {
        const completion = yield openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: context,
        });
        const response = completion.choices[0].message.content || '';
        context.push({ role: 'assistant', content: response });
        return response;
    }
    catch (error) {
        console.error('Error in chat:', error);
        throw new Error('Chat failed');
    }
});
exports.chatWithContext = chatWithContext;
