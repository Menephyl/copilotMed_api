import React from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface AudioRecorderProps {
    isRecording: boolean;
    onStart: () => void;
    onStop: () => void;
    isProcessing: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
    isRecording,
    onStart,
    onStop,
    isProcessing,
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="relative">
                {isRecording && (
                    <span className="absolute -top-4 -right-4 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
                <button
                    onClick={isRecording ? onStop : onStart}
                    disabled={isProcessing}
                    className={`
            w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
            ${isRecording
                            ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'} 
            shadow-xl text-white disabled:opacity-50 disabled:cursor-not-allowed
          `}
                >
                    {isProcessing ? (
                        <Loader2 className="w-10 h-10 animate-spin" />
                    ) : isRecording ? (
                        <Square className="w-10 h-10 fill-current" />
                    ) : (
                        <Mic className="w-10 h-10" />
                    )}
                </button>
            </div>
            <p className="mt-6 text-slate-500 font-medium">
                {isProcessing
                    ? 'Processando áudio...'
                    : isRecording
                        ? 'Gravando consulta...'
                        : 'Toque para iniciar'}
            </p>
        </div>
    );
};
