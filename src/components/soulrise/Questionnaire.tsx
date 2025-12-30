'use client';

import { useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import Logo from './Logo';

interface QuestionnaireProps {
  onComplete: (goals: string[]) => void;
}

type GoalOption = {
  id: string;
  label: string;
  category: 'desenvolvimento' | 'espiritualidade';
};

const goalOptions: GoalOption[] = [
  { id: 'equilibrio', label: 'Equilíbrio mental e emocional', category: 'desenvolvimento' },
  { id: 'disciplina', label: 'Disciplina e consistência diária', category: 'desenvolvimento' },
  { id: 'conexao', label: 'Conexão espiritual e fé', category: 'espiritualidade' },
  { id: 'proposito', label: 'Propósito e alinhamento interior', category: 'espiritualidade' },
];

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleGoalToggle = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      if (selectedGoals.length < 2) {
        setSelectedGoals([...selectedGoals, goalId]);
      }
    }
  };

  const handleComplete = () => {
    if (selectedGoals.length > 0) {
      onComplete(selectedGoals);
    }
  };

  const desenvolvimentoGoals = goalOptions.filter(g => g.category === 'desenvolvimento');
  const espiritualidadeGoals = goalOptions.filter(g => g.category === 'espiritualidade');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Logo className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Quais são os teus principais objetivos?
          </h1>
          <p className="text-gray-600 text-lg">
            Seleciona até 2 opções para personalizar a tua experiência
          </p>
        </div>

        {/* Goals Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          {/* Desenvolvimento Pessoal */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              Desenvolvimento Pessoal
            </h3>
            <div className="space-y-3">
              {desenvolvimentoGoals.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                const selectionOrder = selectedGoals.indexOf(goal.id) + 1;
                
                return (
                  <button
                    key={goal.id}
                    onClick={() => handleGoalToggle(goal.id)}
                    disabled={!isSelected && selectedGoals.length >= 2}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : selectedGoals.length >= 2
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{goal.label}</span>
                      {isSelected && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            {selectionOrder === 1 ? 'Prioridade' : '2ª escolha'}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Espiritualidade */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500"></div>
              Espiritualidade
            </h3>
            <div className="space-y-3">
              {espiritualidadeGoals.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                const selectionOrder = selectedGoals.indexOf(goal.id) + 1;
                
                return (
                  <button
                    key={goal.id}
                    onClick={() => handleGoalToggle(goal.id)}
                    disabled={!isSelected && selectedGoals.length >= 2}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50 shadow-md'
                        : selectedGoals.length >= 2
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{goal.label}</span>
                      {isSelected && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
                            {selectionOrder === 1 ? 'Prioridade' : '2ª escolha'}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selection Counter */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {selectedGoals.length === 0 && 'Seleciona pelo menos 1 objetivo'}
              {selectedGoals.length === 1 && 'Podes selecionar mais 1 objetivo (opcional)'}
              {selectedGoals.length === 2 && 'Máximo de objetivos selecionados'}
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleComplete}
          disabled={selectedGoals.length === 0}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
