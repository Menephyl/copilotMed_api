import React from 'react';
import { History, ChevronRight, Calendar } from 'lucide-react';

interface HistoryItem {
    id: string;
    date: string;
    preview: string;
}

interface HistorySidebarProps {
    isOpen: boolean;
    history: HistoryItem[];
    onSelect: (id: string) => void;
    onClose: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
    isOpen,
    history,
    onSelect,
    onClose,
}) => {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
        fixed top-0 left-0 h-full w-80 bg-white border-r border-slate-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800">
                        <History className="w-5 h-5" />
                        <h2 className="font-bold text-lg">Histórico</h2>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-2 hover:bg-slate-100 rounded-full">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100%-80px)] p-4 space-y-3">
                    {history.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">Nenhuma consulta anterior</p>
                    ) : (
                        history.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onSelect(item.id)}
                                className="w-full text-left p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                            >
                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.date).toLocaleDateString('pt-BR')}
                                </div>
                                <p className="text-sm text-slate-700 font-medium line-clamp-2 group-hover:text-blue-600">
                                    {item.preview}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </aside>
        </>
    );
};
