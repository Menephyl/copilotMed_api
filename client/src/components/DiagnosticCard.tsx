import React from 'react';
import { Activity, Pill, FileText, AlertCircle } from 'lucide-react';
import { Diagnosis } from '../services/api';

interface DiagnosticCardProps {
    diagnosis: Diagnosis;
}

export const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ diagnosis }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Diagnóstico Principal */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-3">
                    <Activity className="text-blue-500 w-6 h-6" />
                    <h3 className="text-lg font-semibold text-slate-800">Diagnóstico Provável</h3>
                </div>
                <p className="text-xl text-slate-900 font-medium">{diagnosis.diagnostico_provavel}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Doenças Associadas */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-orange-500 w-5 h-5" />
                        <h3 className="font-semibold text-slate-800">Doenças Associadas</h3>
                    </div>
                    <ul className="space-y-2">
                        {diagnosis.doencas_associadas.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-600">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Medicamentos */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <Pill className="text-green-500 w-5 h-5" />
                        <h3 className="font-semibold text-slate-800">Medicamentos Sugeridos</h3>
                    </div>
                    <ul className="space-y-2">
                        {diagnosis.medicamentos_possiveis.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-600">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Exames */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-purple-500 w-5 h-5" />
                    <h3 className="font-semibold text-slate-800">Exames Solicitados</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {diagnosis.exames_sugeridos.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
