import React, { useState, useEffect } from 'react';
import { Menu, Plus, Stethoscope } from 'lucide-react';
import { AudioRecorder } from './components/AudioRecorder';
import { DiagnosticCard } from './components/DiagnosticCard';
import { HistorySidebar } from './components/HistorySidebar';
import { Chat } from './components/Chat';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { transcribeAudio, generateDiagnosis, sendChatMessage, Diagnosis } from './services/api';

interface Consultation {
    id: string;
    date: string;
    text: string;
    diagnosis: Diagnosis;
}

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [history, setHistory] = useState<Consultation[]>([]);
    const [currentConsultation, setCurrentConsultation] = useState<Consultation | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcription, setTranscription] = useState('');

    const { isRecording, startRecording, stopRecording, audioBlob } = useAudioRecorder();

    // Load history from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('medical_copilot_history');
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, []);

    // Save history to LocalStorage
    useEffect(() => {
        localStorage.setItem('medical_copilot_history', JSON.stringify(history));
    }, [history]);

    // Handle audio processing when recording stops
    useEffect(() => {
        const processAudio = async () => {
            if (audioBlob) {
                setIsProcessing(true);
                try {
                    // 1. Transcribe
                    const text = await transcribeAudio(audioBlob);
                    setTranscription(text);

                    // 2. Diagnose
                    const diagnosis = await generateDiagnosis(text);

                    const newConsultation: Consultation = {
                        id: crypto.randomUUID(),
                        date: new Date().toISOString(),
                        text,
                        diagnosis,
                    };

                    setCurrentConsultation(newConsultation);
                    setHistory(prev => [newConsultation, ...prev]);
                } catch (error) {
                    console.error('Error processing consultation:', error);
                    alert('Erro ao processar consulta. Verifique o console.');
                } finally {
                    setIsProcessing(false);
                }
            }
        };

        if (audioBlob) {
            processAudio();
        }
    }, [audioBlob]);

    const handleNewConsultation = () => {
        setCurrentConsultation(null);
        setTranscription('');
        setIsSidebarOpen(false);
    };

    const handleSelectHistory = (id: string) => {
        const selected = history.find(h => h.id === id);
        if (selected) {
            setCurrentConsultation(selected);
            setTranscription(selected.text);
            setIsSidebarOpen(false);
        }
    };

    const handleChatMessage = async (message: string) => {
        if (!currentConsultation) return 'Erro: Nenhuma consulta ativa.';

        // Pass context from the diagnosis
        const context = JSON.stringify(currentConsultation.diagnosis);
        return await sendChatMessage(currentConsultation.id, message, context);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <HistorySidebar
                isOpen={isSidebarOpen}
                history={history.map(h => ({
                    id: h.id,
                    date: h.date,
                    preview: h.diagnosis.diagnostico_provavel
                }))}
                onSelect={handleSelectHistory}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-80' : ''}`}>
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-2 text-blue-600">
                                <Stethoscope className="w-6 h-6" />
                                <h1 className="font-bold text-xl tracking-tight">Médico Copilot</h1>
                            </div>
                        </div>

                        <button
                            onClick={handleNewConsultation}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm shadow-blue-200"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Nova Consulta</span>
                        </button>
                    </div>
                </header>

                <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                    {!currentConsultation ? (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Iniciar Nova Consulta</h2>
                                <p className="text-slate-500">Grave o áudio da consulta para gerar o relatório clínico.</p>
                            </div>

                            <AudioRecorder
                                isRecording={isRecording}
                                onStart={startRecording}
                                onStop={stopRecording}
                                isProcessing={isProcessing}
                            />

                            {transcription && isProcessing && (
                                <div className="mt-8 w-full max-w-lg bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Transcrição em tempo real</h3>
                                    <p className="text-slate-600">{transcription}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                            {/* Transcription Preview */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Transcrição da Consulta</h3>
                                <p className="text-slate-700 leading-relaxed">{currentConsultation.text}</p>
                            </div>

                            {/* Diagnosis Card */}
                            <DiagnosticCard diagnosis={currentConsultation.diagnosis} />

                            {/* Chat */}
                            <Chat
                                consultationId={currentConsultation.id}
                                onSendMessage={handleChatMessage}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
