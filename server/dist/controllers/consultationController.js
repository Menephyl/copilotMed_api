"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.chat = exports.diagnose = exports.transcribe = void 0;
const openaiService = __importStar(require("../services/openaiService"));
const fs_1 = __importDefault(require("fs"));
const transcribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ error: 'No audio file provided' });
    }
    try {
        const text = yield openaiService.transcribeAudio(req.file.path);
        // Clean up the uploaded file
        fs_1.default.unlinkSync(req.file.path);
        res.json({ text });
    }
    catch (error) {
        // Ensure file is deleted even on error
        if (req.file && fs_1.default.existsSync(req.file.path)) {
            fs_1.default.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Transcription failed' });
    }
});
exports.transcribe = transcribe;
const diagnose = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, history } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }
    try {
        const diagnosis = yield openaiService.generateDiagnosis(text, history);
        res.json(diagnosis);
    }
    catch (error) {
        res.status(500).json({ error: 'Diagnosis generation failed' });
    }
});
exports.diagnose = diagnose;
const chat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { consultationId, message, context } = req.body;
    if (!consultationId || !message) {
        return res.status(400).json({ error: 'consultationId and message are required' });
    }
    try {
        const response = yield openaiService.chatWithContext(consultationId, message, context);
        res.json({ response });
    }
    catch (error) {
        res.status(500).json({ error: 'Chat failed' });
    }
});
exports.chat = chat;
