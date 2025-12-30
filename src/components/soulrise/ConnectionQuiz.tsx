'use client';

import { useState } from 'react';
import { ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

interface ConnectionQuizProps {
  onComplete: (answers: QuizAnswers, plan: PersonalizedPlan) => void;
  goals: string[];
}

export interface QuizAnswers {
  gender: string;
  motivation: string;
  emotionalState: string;
  routine: string;
  timeAvailable: string;
  spirituality: string;
  lacking: string;
  commitment: string;
}

export interface PersonalizedPlan {
  dailyIntention: string;
  mainAction: string;
  complementaryAction: string;
  ritual: string;
  affirmation: string;
  weeklyFocus: string;
}

const questions = [
  {
    id: 'gender',
    question: 'Qual é o teu género?',
    options: ['Homem', 'Mulher']
  },
  {
    id: 'motivation',
    question: 'O que mais te trouxe à SoulRise neste momento?',
    options: [
      'Equilíbrio mental e emocional',
      'Disciplina e consistência diária',
      'Conexão espiritual e fé',
      'Propósito e alinhamento interior'
    ]
  },
  {
    id: 'emotionalState',
    question: 'Como te tens sentido emocionalmente nos últimos dias?',
    options: ['Calmo(a)', 'Cansado(a)', 'Confuso(a)', 'Ansioso(a)', 'Motivado(a)']
  },
  {
    id: 'routine',
    question: 'Como está a tua rotina atualmente?',
    options: [
      'Tenho uma rotina estável',
      'Tenho alguma rotina, mas falho',
      'Vivo muito no improviso',
      'Não tenho rotina nenhuma'
    ]
  },
  {
    id: 'timeAvailable',
    question: 'Quanto tempo consegues dedicar por dia ao teu desenvolvimento?',
    options: ['5 minutos', '10 minutos', '15 minutos', '20 minutos ou mais']
  },
  {
    id: 'spirituality',
    question: 'Como descreves a tua relação com a espiritualidade hoje?',
    options: [
      'Muito presente',
      'Presente, mas irregular',
      'Quero aproximar-me mais',
      'Quase inexistente'
    ]
  },
  {
    id: 'lacking',
    question: 'O que sentes que mais te falta neste momento?',
    options: ['Clareza', 'Consistência', 'Paz interior', 'Fé', 'Energia']
  },
  {
    id: 'commitment',
    question: 'Estás aberto(a) a seguir um plano diário personalizado?',
    options: ['Sim, totalmente', 'Sim, mas de forma leve', 'Ainda estou a explorar']
  }
];

// Função para gerar plano baseado nas respostas (sem API externa)
function generatePlanFromAnswers(answers: QuizAnswers, goals: string[]): PersonalizedPlan {
  const { motivation, emotionalState, routine, timeAvailable, spirituality, lacking, commitment } = answers;

  // Lógica personalizada baseada nas respostas
  let dailyIntention = 'Cultivar equilíbrio e crescimento pessoal';
  let mainAction = 'Dedicar tempo à reflexão e planeamento do dia';
  let complementaryAction = 'Praticar gratidão identificando 3 coisas positivas';
  let ritual = 'Começar o dia com respiração consciente (5 respirações profundas)';
  let affirmation = 'Estou no caminho certo. Confio no meu processo.';
  let weeklyFocus = 'Desenvolver consistência através de pequenas ações diárias';

  // Personalização baseada em motivação
  if (motivation === 'Equilíbrio mental e emocional') {
    dailyIntention = 'Encontrar paz e equilíbrio interior';
    mainAction = 'Praticar 10 minutos de meditação ou mindfulness';
    affirmation = 'Escolho a paz. Sou capaz de encontrar equilíbrio.';
  } else if (motivation === 'Disciplina e consistência diária') {
    dailyIntention = 'Construir disciplina através de pequenos hábitos';
    mainAction = 'Completar uma rotina matinal de 15 minutos';
    weeklyFocus = 'Criar e manter uma rotina diária consistente';
  } else if (motivation === 'Conexão espiritual e fé') {
    dailyIntention = 'Fortalecer a conexão com o divino';
    mainAction = 'Dedicar tempo à oração ou leitura espiritual';
    ritual = 'Começar o dia com uma oração de gratidão';
    affirmation = 'Confio na jornada. Estou conectado(a) com algo maior.';
  } else if (motivation === 'Propósito e alinhamento interior') {
    dailyIntention = 'Alinhar ações com propósito de vida';
    mainAction = 'Refletir sobre valores e objetivos pessoais';
    weeklyFocus = 'Identificar e agir de acordo com o teu propósito';
  }

  // Personalização baseada em estado emocional
  if (emotionalState === 'Ansioso(a)') {
    complementaryAction = 'Praticar técnicas de respiração quando sentir ansiedade';
    ritual = 'Respiração 4-7-8: inspirar 4s, segurar 7s, expirar 8s';
  } else if (emotionalState === 'Cansado(a)') {
    complementaryAction = 'Garantir 7-8 horas de sono e pausas durante o dia';
    ritual = 'Criar um ritual de sono relaxante (sem ecrãs 30min antes)';
  } else if (emotionalState === 'Confuso(a)') {
    mainAction = 'Escrever num diário para clarificar pensamentos';
    complementaryAction = 'Fazer uma lista de prioridades semanais';
  }

  // Personalização baseada em rotina
  if (routine === 'Não tenho rotina nenhuma' || routine === 'Vivo muito no improviso') {
    weeklyFocus = 'Estabelecer uma rotina matinal simples e consistente';
    mainAction = 'Começar com apenas 1 hábito matinal (ex: fazer a cama)';
  }

  // Personalização baseada em tempo disponível
  if (timeAvailable === '5 minutos') {
    mainAction = 'Praticar 5 minutos de respiração consciente ou gratidão';
    ritual = 'Micro-ritual de 2 minutos ao acordar';
  } else if (timeAvailable === '20 minutos ou mais') {
    mainAction = 'Criar uma rotina completa: meditação, journaling e planeamento';
  }

  // Personalização baseada em espiritualidade
  if (spirituality === 'Quase inexistente') {
    ritual = 'Começar com 2 minutos de silêncio e respiração';
    affirmation = 'Estou aberto(a) a explorar a minha espiritualidade.';
  } else if (spirituality === 'Muito presente') {
    ritual = 'Aprofundar práticas espirituais existentes com intenção';
    affirmation = 'A minha fé guia-me. Confio no plano divino.';
  }

  // Personalização baseada no que falta
  if (lacking === 'Clareza') {
    mainAction = 'Dedicar 10 minutos ao journaling para clarificar objetivos';
    weeklyFocus = 'Ganhar clareza através da reflexão escrita diária';
  } else if (lacking === 'Paz interior') {
    mainAction = 'Praticar meditação ou oração para cultivar paz';
    affirmation = 'Escolho a paz. Liberto o que não posso controlar.';
  } else if (lacking === 'Energia') {
    complementaryAction = 'Fazer exercício leve ou caminhada de 10 minutos';
    ritual = 'Alongamentos matinais para despertar o corpo';
  } else if (lacking === 'Fé') {
    ritual = 'Ler um versículo ou texto inspirador ao acordar';
    affirmation = 'Confio no processo. Tudo acontece no tempo certo.';
  }

  return {
    dailyIntention,
    mainAction,
    complementaryAction,
    ritual,
    affirmation,
    weeklyFocus
  };
}

export default function ConnectionQuiz({ onComplete, goals }: ConnectionQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<PersonalizedPlan | null>(null);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = async (answer: string) => {
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Last question - generate plan locally
      setIsGenerating(true);
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const plan = generatePlanFromAnswers(newAnswers as QuizAnswers, goals);
      setGeneratedPlan(plan);
      setShowPlan(true);
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleContinueToSignup = () => {
    if (generatedPlan) {
      onComplete(answers as QuizAnswers, generatedPlan);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-purple-500 animate-pulse" />
              <div className="absolute inset-0 bg-purple-400 blur-xl opacity-50 animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            A criar o teu plano personalizado...
          </h2>
          <p className="text-gray-600 mb-6">
            A analisar as tuas respostas e objetivos
          </p>
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (showPlan && generatedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-4">
              <Logo className="h-16 w-auto" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              O Teu Plano Personalizado
            </h1>
            <p className="text-gray-600 text-lg">
              Criado especialmente para ti
            </p>
          </div>

          {/* Plan Display */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 space-y-6">
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-sm font-semibold text-purple-600 uppercase mb-1">
                Intenção do Dia
              </h3>
              <p className="text-gray-800 font-medium">{generatedPlan.dailyIntention}</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-sm font-semibold text-blue-600 uppercase mb-1">
                Ação Principal
              </h3>
              <p className="text-gray-800">{generatedPlan.mainAction}</p>
            </div>

            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="text-sm font-semibold text-pink-600 uppercase mb-1">
                Ação Complementar
              </h3>
              <p className="text-gray-800">{generatedPlan.complementaryAction}</p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-sm font-semibold text-orange-600 uppercase mb-1">
                Ritual
              </h3>
              <p className="text-gray-800">{generatedPlan.ritual}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-purple-700 uppercase mb-2">
                Afirmação
              </h3>
              <p className="text-gray-800 italic font-medium">
                "{generatedPlan.affirmation}"
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-sm font-semibold text-green-600 uppercase mb-1">
                Foco Semanal
              </h3>
              <p className="text-gray-800">{generatedPlan.weeklyFocus}</p>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinueToSignup}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            Criar Conta e Guardar Plano
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Cria a tua conta para guardar este plano personalizado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Pergunta {currentQuestion + 1} de {questions.length}
            </span>
            <span className="text-sm font-medium text-purple-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800 group-hover:text-purple-700">
                    {option}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {currentQuestion > 0 && (
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            ← Voltar
          </button>
        )}
      </div>
    </div>
  );
}
