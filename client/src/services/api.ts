import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await api.post('/transcribe', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.text;
};

export interface Diagnosis {
    diagnostico_provavel: string;
    doencas_associadas: string[];
    exames_sugeridos: string[];
    medicamentos_possiveis: string[];
}

export const generateDiagnosis = async (text: string): Promise<Diagnosis> => {
    const response = await api.post('/diagnose', { text });
    return response.data;
};

export const sendChatMessage = async (consultationId: string, message: string, context?: string): Promise<string> => {
    const response = await api.post('/chat', { consultationId, message, context });
    return response.data.response;
};
