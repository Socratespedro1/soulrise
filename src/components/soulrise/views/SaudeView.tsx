'use client';

import { useState, useRef } from 'react';
import { Activity, Wind, Moon, Heart, X, Check, Play, Apple, Utensils, Droplet } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  steps?: string[];
  tips?: string[];
  warning?: string;
}

interface ModalContent {
  title: string;
  description: string;
  duration: string;
  steps?: string[];
  tips?: string[];
  objective: string;
  warning?: string;
}

type ModalType = 'corpo' | 'respiracao' | 'sono' | 'autocuidado' | 'alimentacao' | null;

export default function SaudeView() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  // Refs para scroll automático
  const movimentoRef = useRef<HTMLDivElement>(null);
  const respiracaoRef = useRef<HTMLDivElement>(null);
  const alimentacaoRef = useRef<HTMLDivElement>(null);
  const sonoRef = useRef<HTMLDivElement>(null);
  const jejumRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Conteúdos de Corpo & Movimento
  const corpoMovimento: ContentItem[] = [
    {
      id: 'alongamento',
      title: 'Alongamento Diário Simples',
      description: 'Movimentos suaves para despertar o corpo e aliviar tensões',
      duration: '5-7 minutos',
      steps: [
        'Comece de pé, respire fundo e estique os braços para cima',
        'Incline-se suavemente para os lados, mantendo 10 segundos de cada lado',
        'Rode os ombros para trás e para frente, 5 vezes cada',
        'Incline a cabeça para os lados, sentindo o alongamento do pescoço',
        'Sente-se e estique as pernas, tentando alcançar os pés',
        'Finalize com respirações profundas'
      ],
      tips: ['Não force os movimentos', 'Respeite os limites do seu corpo', 'Faça pela manhã ou após longas horas sentado']
    },
    {
      id: 'movimento-consciente',
      title: 'Movimento Consciente',
      description: 'Pequena prática de movimento com atenção plena',
      duration: '5-10 minutos',
      steps: [
        'Escolha um espaço tranquilo',
        'Comece com movimentos lentos e circulares dos braços',
        'Sinta cada músculo se movendo',
        'Caminhe devagar, prestando atenção a cada passo',
        'Faça movimentos que o seu corpo pede neste momento',
        'Termine com uma pausa de gratidão ao corpo'
      ],
      tips: ['Não há movimento certo ou errado', 'Ouça o que o corpo precisa', 'Pode ser feito em qualquer momento do dia']
    },
    {
      id: 'ativacao-corporal',
      title: 'Ativação Corporal Leve',
      description: 'Despertar o corpo com energia suave',
      duration: '5 minutos',
      steps: [
        'Comece com saltitos leves no lugar (30 segundos)',
        'Faça agachamentos suaves (10 repetições)',
        'Eleve os joelhos alternadamente (1 minuto)',
        'Abra e feche os braços em movimento de abraço (15 vezes)',
        'Respire profundamente e sinta a energia circulando'
      ],
      tips: ['Ideal para começar o dia', 'Pode ser feito em pausas do trabalho', 'Ajuda a combater o cansaço']
    },
    {
      id: 'consciencia-postural',
      title: 'Consciência Postural',
      description: 'Prática de atenção à postura ao longo do dia',
      duration: '2-3 minutos',
      steps: [
        'Pare o que está fazendo e observe sua postura atual',
        'Alinhe a coluna, como se um fio puxasse o topo da cabeça',
        'Relaxe os ombros, afastando-os das orelhas',
        'Apoie bem os pés no chão',
        'Respire e mantenha essa consciência por alguns minutos',
        'Repita várias vezes ao dia'
      ],
      tips: ['Configure lembretes no telemóvel', 'Especialmente importante se trabalha sentado', 'Previne dores e tensões']
    }
  ];

  // Conteúdos de Respiração & Relaxamento
  const respiracaoRelaxamento: ContentItem[] = [
    {
      id: 'respiracao-4-7-8',
      title: 'Respiração 4-7-8',
      description: 'Técnica simples para acalmar o sistema nervoso',
      duration: '3-5 minutos',
      steps: [
        'Sente-se confortavelmente com a coluna reta',
        'Inspire pelo nariz contando até 4',
        'Segure a respiração contando até 7',
        'Expire pela boca contando até 8',
        'Repita o ciclo 4 a 8 vezes',
        'Observe como se sente após a prática'
      ],
      tips: ['Ideal para momentos de stress', 'Pode ser feito em qualquer lugar', 'Ajuda a adormecer']
    },
    {
      id: 'respiracao-consciente',
      title: 'Respiração Consciente',
      description: 'Atenção plena na respiração natural',
      duration: '5 minutos',
      steps: [
        'Encontre uma posição confortável',
        'Feche os olhos suavemente',
        'Observe a respiração sem tentar mudá-la',
        'Sinta o ar entrando e saindo',
        'Se a mente divagar, volte gentilmente à respiração',
        'Termine com gratidão por este momento'
      ],
      tips: ['Prática fundamental de mindfulness', 'Reduz ansiedade', 'Pode ser feito várias vezes ao dia']
    },
    {
      id: 'relaxamento-progressivo',
      title: 'Relaxamento Progressivo',
      description: 'Soltar tensões do corpo progressivamente',
      duration: '10 minutos',
      steps: [
        'Deite-se ou sente-se confortavelmente',
        'Comece pelos pés: contraia e relaxe',
        'Suba pelas pernas, contraindo e relaxando cada parte',
        'Continue pelo abdómen, peito, braços',
        'Finalize com ombros, pescoço e rosto',
        'Permaneça alguns minutos em relaxamento total'
      ],
      tips: ['Excelente antes de dormir', 'Alivia tensão acumulada', 'Promove consciência corporal']
    },
    {
      id: 'pausa-presenca',
      title: 'Pausa de Presença',
      description: 'Micro-pausa para voltar ao momento presente',
      duration: '1-2 minutos',
      steps: [
        'Pare o que está fazendo',
        'Feche os olhos ou baixe o olhar',
        'Faça 3 respirações profundas e lentas',
        'Observe como está o seu corpo',
        'Observe como está a sua mente',
        'Volte às atividades com mais presença'
      ],
      tips: ['Faça várias vezes ao dia', 'Interrompe o piloto automático', 'Reduz stress acumulado']
    }
  ];

  // Conteúdos de Sono & Recuperação
  const sonoRecuperacao: ContentItem[] = [
    {
      id: 'ritual-noturno',
      title: 'Ritual Noturno Simples',
      description: 'Preparar corpo e mente para um sono reparador',
      duration: '15-20 minutos',
      steps: [
        '1 hora antes: desligue ecrãs e luzes fortes',
        'Tome um banho morno relaxante',
        'Vista roupa confortável',
        'Prepare o quarto: temperatura fresca, escuro, silencioso',
        'Faça alongamentos suaves ou respiração',
        'Leia algo leve ou ouça música calma',
        'Deite-se sempre à mesma hora'
      ],
      tips: ['Consistência é fundamental', 'Evite cafeína após as 16h', 'Crie um ambiente propício ao sono']
    },
    {
      id: 'preparacao-dormir',
      title: 'Preparação para Dormir',
      description: 'Técnicas para facilitar o adormecer',
      duration: '10 minutos',
      steps: [
        'Deite-se confortavelmente',
        'Faça um scan corporal: relaxe cada parte do corpo',
        'Pratique respiração 4-7-8 (4 ciclos)',
        'Visualize um lugar tranquilo e seguro',
        'Se a mente agitar, volte à respiração',
        'Permita-se adormecer naturalmente'
      ],
      tips: ['Não force o sono', 'Se não adormecer em 20 min, levante-se e faça algo calmo', 'Evite ver as horas']
    },
    {
      id: 'higiene-sono',
      title: 'Higiene do Sono',
      description: 'Hábitos saudáveis para melhor descanso',
      duration: 'Ao longo do dia',
      steps: [
        'Mantenha horários regulares de dormir e acordar',
        'Exponha-se à luz natural durante o dia',
        'Evite sestas longas (máx. 20-30 min)',
        'Pratique atividade física, mas não perto da hora de dormir',
        'Evite refeições pesadas à noite',
        'Use a cama apenas para dormir',
        'Mantenha o quarto fresco, escuro e silencioso'
      ],
      tips: ['Pequenas mudanças fazem grande diferença', 'Seja paciente com o processo', 'Consistência é mais importante que perfeição']
    },
    {
      id: 'desligar-mente',
      title: 'Desligar Mente e Corpo',
      description: 'Técnica para acalmar pensamentos antes de dormir',
      duration: '5-10 minutos',
      steps: [
        'Escreva preocupações ou tarefas para o dia seguinte',
        'Feche o caderno simbolicamente',
        'Faça respirações profundas',
        'Repita mentalmente: "Agora é hora de descansar"',
        'Visualize-se soltando cada pensamento',
        'Permita-se estar presente apenas no momento'
      ],
      tips: ['Ajuda a "desligar" a mente ativa', 'Reduz ansiedade noturna', 'Melhora qualidade do sono']
    }
  ];

  // Conteúdos de Autocuidado Diário
  const autocuidadoDiario: ContentItem[] = [
    {
      id: 'check-in-corporal',
      title: 'Check-in Corporal',
      description: 'Momento de conexão com o corpo',
      duration: '3-5 minutos',
      steps: [
        'Pare e feche os olhos',
        'Escaneie o corpo da cabeça aos pés',
        'Observe áreas de tensão ou desconforto',
        'Observe áreas de conforto e bem-estar',
        'Pergunte ao corpo: "O que precisas agora?"',
        'Honre a resposta com uma pequena ação'
      ],
      tips: ['Faça 2-3 vezes ao dia', 'Desenvolve consciência corporal', 'Previne acúmulo de tensão']
    },
    {
      id: 'escuta-corpo',
      title: 'Escuta do Corpo',
      description: 'Prática de atenção às necessidades corporais',
      duration: 'Ao longo do dia',
      steps: [
        'Observe sinais de fome e sede',
        'Atenda às necessidades quando surgirem',
        'Note quando precisa de movimento ou descanso',
        'Respeite os limites do corpo',
        'Celebre o que o corpo consegue fazer',
        'Agradeça ao corpo pelo que ele faz por si'
      ],
      tips: ['Corpo fala através de sensações', 'Aprenda a linguagem do seu corpo', 'Respeito é forma de amor próprio']
    },
    {
      id: 'gestos-cuidado',
      title: 'Pequenos Gestos de Cuidado',
      description: 'Ações simples de autocuidado diário',
      duration: 'Vários momentos',
      steps: [
        'Beba água regularmente ao longo do dia',
        'Faça pausas de 5 minutos a cada hora',
        'Alongue-se quando sentir tensão',
        'Coma com atenção e sem pressa',
        'Cuide da higiene pessoal com presença',
        'Vista roupas que o fazem sentir bem',
        'Crie pequenos rituais de prazer (chá, música, etc.)'
      ],
      tips: ['Pequenos gestos têm grande impacto', 'Autocuidado não é luxo, é necessidade', 'Comece com um gesto por dia']
    },
    {
      id: 'ritmos-saudaveis',
      title: 'Ritmos Saudáveis',
      description: 'Criar rotinas que respeitam o corpo',
      duration: 'Estrutura diária',
      steps: [
        'Acorde e durma em horários regulares',
        'Faça refeições em horários consistentes',
        'Alterne períodos de atividade e descanso',
        'Respeite o ritmo natural de energia do corpo',
        'Crie transições suaves entre atividades',
        'Permita flexibilidade quando necessário'
      ],
      tips: ['Corpo adora previsibilidade', 'Ritmos regulares melhoram saúde', 'Equilíbrio entre estrutura e flexibilidade']
    }
  ];

  // Conteúdos de Alimentação Consciente
  const alimentacaoConsciente: ContentItem[] = [
    {
      id: 'comer-atencao',
      title: 'Comer com Atenção Plena',
      description: 'Prática de presença durante as refeições',
      duration: 'Durante as refeições',
      steps: [
        'Sente-se à mesa, sem distrações (TV, telemóvel)',
        'Observe a comida: cores, texturas, aromas',
        'Faça uma pausa de gratidão antes de começar',
        'Mastigue devagar, saboreando cada garfada',
        'Coloque os talheres na mesa entre cada garfada',
        'Observe quando começa a sentir-se satisfeito',
        'Pare quando estiver confortavelmente cheio, não empanturrado'
      ],
      tips: ['Comer devagar melhora digestão', 'Ajuda a reconhecer sinais de saciedade', 'Transforma refeição em momento de autocuidado']
    },
    {
      id: 'hidratacao-consciente',
      title: 'Hidratação Consciente',
      description: 'Criar hábito saudável de beber água',
      duration: 'Ao longo do dia',
      steps: [
        'Comece o dia com um copo de água',
        'Tenha sempre água por perto',
        'Beba pequenos goles ao longo do dia',
        'Observe sinais de sede (boca seca, cansaço)',
        'Beba água antes, durante e após atividades físicas',
        'Crie lembretes se necessário',
        'Observe como se sente mais hidratado'
      ],
      tips: ['Água é essencial para todas as funções do corpo', 'Sede já é sinal de desidratação', 'Chás e infusões também contam']
    },
    {
      id: 'escolhas-simples',
      title: 'Escolhas Simples e Naturais',
      description: 'Preferir alimentos mais próximos da natureza',
      duration: 'No dia a dia',
      steps: [
        'Escolha alimentos que reconhece (frutas, vegetais, grãos)',
        'Prefira comida caseira quando possível',
        'Leia rótulos: menos ingredientes = melhor',
        'Adicione cor ao prato (vegetais variados)',
        'Inclua proteínas, gorduras saudáveis e fibras',
        'Não precisa ser perfeito, apenas mais consciente',
        'Celebre pequenas escolhas saudáveis'
      ],
      tips: ['Pequenas mudanças são sustentáveis', 'Não há alimentos proibidos, apenas equilíbrio', 'Ouça o que o corpo pede']
    },
    {
      id: 'alimentacao-energia',
      title: 'Alimentação e Energia',
      description: 'Relação entre o que come e como se sente',
      duration: 'Observação diária',
      steps: [
        'Observe como se sente após diferentes refeições',
        'Note quais alimentos dão energia sustentada',
        'Identifique o que causa cansaço ou desconforto',
        'Ajuste escolhas baseado nas suas observações',
        'Respeite que cada corpo é único',
        'Crie o seu próprio mapa de bem-estar alimentar'
      ],
      tips: ['Não há dieta universal perfeita', 'Seu corpo é o melhor guia', 'Alimentação afeta humor, sono e energia']
    },
    {
      id: 'jejum-consciente',
      title: 'Jejum Consciente',
      description: 'Prática opcional de consciência e disciplina',
      duration: 'Opcional e individual',
      steps: [
        'Entenda que jejum é uma OPÇÃO, não obrigação',
        'Consulte profissional de saúde antes de começar',
        'Se optar por experimentar, comece gradualmente',
        'Ouça atentamente os sinais do seu corpo',
        'Mantenha hidratação adequada',
        'Interrompa imediatamente se sentir mal-estar',
        'Respeite que pode não ser para si, e está tudo bem'
      ],
      tips: [
        'Jejum varia muito de pessoa para pessoa',
        'Depende de corpo, saúde, rotina e fase da vida',
        'Não é indicado para grávidas, crianças, idosos frágeis',
        'Pessoas com histórico de distúrbios alimentares devem evitar',
        'Possíveis benefícios: clareza mental, disciplina, consciência corporal',
        'Alternativas: reduzir excessos, janelas de alimentação conscientes, jejum digital'
      ],
      warning: '⚠️ IMPORTANTE: O jejum não é indicado para todas as pessoas. Pessoas com condições de saúde específicas, histórico de distúrbios alimentares, grávidas, crianças e idosos frágeis devem evitar. Se sentir tonturas, fraqueza excessiva, náuseas ou qualquer mal-estar, interrompa imediatamente. Esta prática deve ser sempre acompanhada por profissional de saúde qualificado. Escute seu corpo e use o bom senso.'
    }
  ];

  const sections = [
    {
      id: 'corpo',
      title: 'Corpo & Movimento',
      icon: Activity,
      color: 'from-blue-400 to-cyan-400',
      description: 'Cuidar do corpo sem pressão nem treino intenso',
      contents: corpoMovimento,
      modalType: 'corpo' as ModalType,
      objective: 'Cuidar do corpo através de movimentos simples e conscientes, sem pressão de performance. O objetivo é criar uma relação saudável com o movimento, respeitando os limites e necessidades do corpo.',
      ref: movimentoRef
    },
    {
      id: 'respiracao',
      title: 'Respiração & Relaxamento',
      icon: Wind,
      color: 'from-green-400 to-emerald-400',
      description: 'Regular o sistema nervoso e acalmar a mente',
      contents: respiracaoRelaxamento,
      modalType: 'respiracao' as ModalType,
      objective: 'Regular o sistema nervoso através da respiração consciente e técnicas de relaxamento. Estas práticas ajudam a reduzir stress, ansiedade e promovem um estado de calma interior.',
      ref: respiracaoRef
    },
    {
      id: 'sono',
      title: 'Sono & Recuperação',
      icon: Moon,
      color: 'from-indigo-400 to-purple-400',
      description: 'Melhorar descanso e recuperação diária',
      contents: sonoRecuperacao,
      modalType: 'sono' as ModalType,
      objective: 'Melhorar a qualidade do sono e da recuperação através de rituais noturnos e hábitos saudáveis. Um bom descanso é fundamental para saúde física, mental e emocional.',
      ref: sonoRef
    },
    {
      id: 'autocuidado',
      title: 'Autocuidado Diário',
      icon: Heart,
      color: 'from-pink-400 to-rose-400',
      description: 'Criar consciência e respeito pelo próprio corpo',
      contents: autocuidadoDiario,
      modalType: 'autocuidado' as ModalType,
      objective: 'Desenvolver consciência corporal e criar hábitos de autocuidado sustentáveis. Pequenos gestos diários de atenção ao corpo criam uma base sólida de bem-estar.',
      ref: null
    },
    {
      id: 'alimentacao',
      title: 'Alimentação Consciente',
      icon: Apple,
      color: 'from-orange-400 to-amber-400',
      description: 'Criar relação saudável com a alimentação',
      contents: alimentacaoConsciente,
      modalType: 'alimentacao' as ModalType,
      objective: 'Desenvolver uma relação consciente e equilibrada com a alimentação, integrando corpo, mente e espírito. Foco em consciência, bem-estar e escolhas sustentáveis, sem dietas rígidas ou pressão.',
      ref: alimentacaoRef
    }
  ];

  const handleOpenContent = (content: ContentItem, modalType: ModalType) => {
    setSelectedContent(content);
    setActiveModal(modalType);
  };

  const handleMarkAsDone = (itemId: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      newSet.add(itemId);
      return newSet;
    });
    setActiveModal(null);
    setSelectedContent(null);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedContent(null);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Saúde & Bem-Estar 🌿
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Cuidados simples, diários e sustentáveis para o seu corpo e mente. 
          Sem linguagem médica complexa, sem pressão — apenas práticas acessíveis 
          que promovem bem-estar real e consistente.
        </p>
      </div>

      {/* ACESSOS RÁPIDOS - NAVEGAÇÃO INTERNA */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 md:p-6 mb-6 border-2 border-green-200">
        <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Acesso Rápido
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
          <button
            onClick={() => scrollToSection(movimentoRef)}
            className="bg-white hover:bg-green-50 rounded-xl p-3 border border-green-200 hover:border-green-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <Activity className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Movimento</span>
          </button>
          <button
            onClick={() => scrollToSection(respiracaoRef)}
            className="bg-white hover:bg-green-50 rounded-xl p-3 border border-green-200 hover:border-green-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <Wind className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Respiração</span>
          </button>
          <button
            onClick={() => scrollToSection(alimentacaoRef)}
            className="bg-white hover:bg-green-50 rounded-xl p-3 border border-green-200 hover:border-green-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <Utensils className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Alimentação</span>
          </button>
          <button
            onClick={() => scrollToSection(sonoRef)}
            className="bg-white hover:bg-green-50 rounded-xl p-3 border border-green-200 hover:border-green-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <Moon className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Sono</span>
          </button>
          <button
            onClick={() => scrollToSection(jejumRef)}
            className="bg-white hover:bg-green-50 rounded-xl p-3 border border-green-200 hover:border-green-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <Droplet className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Jejum</span>
          </button>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="space-y-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div 
              key={section.id} 
              ref={section.ref}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              {/* Section Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {section.title}
                  </h2>
                  <p className="text-gray-600">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Content Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.contents.map((content) => {
                  const isCompleted = completedItems.has(content.id);
                  // Adiciona ref especial para o item de jejum
                  const itemRef = content.id === 'jejum-consciente' ? jejumRef : null;
                  return (
                    <button
                      key={content.id}
                      ref={itemRef}
                      onClick={() => handleOpenContent(content, section.modalType)}
                      className={`bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border-2 border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md text-left relative group ${
                        isCompleted ? 'opacity-75' : ''
                      }`}
                    >
                      {isCompleted && (
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <Play className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">
                            {content.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {content.duration}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {content.description}
                      </p>
                      <p className="text-purple-600 text-xs mt-3 font-medium">
                        Clique para iniciar →
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Conteúdo */}
      {activeModal && selectedContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Header do Modal */}
            <div className={`sticky top-0 bg-gradient-to-r ${sections.find(s => s.modalType === activeModal)?.color} text-white p-6 rounded-t-3xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedContent.title}</h2>
                  <p className="text-white/90 text-sm">{selectedContent.duration}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">
              {/* Descrição */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5">
                <p className="text-gray-700 leading-relaxed">
                  {selectedContent.description}
                </p>
              </div>

              {/* Aviso Importante (apenas para Jejum Consciente) */}
              {selectedContent.warning && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                  <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                    ⚠️ Aviso Importante
                  </h3>
                  <p className="text-red-800 text-sm leading-relaxed">
                    {selectedContent.warning}
                  </p>
                </div>
              )}

              {/* Objetivo da Seção */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Objetivo
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {sections.find(s => s.modalType === activeModal)?.objective}
                </p>
              </div>

              {/* Passos */}
              {selectedContent.steps && selectedContent.steps.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-blue-500" />
                    {selectedContent.id === 'jejum-consciente' ? 'Orientações' : 'Como fazer'}
                  </h3>
                  <div className="space-y-3">
                    {selectedContent.steps.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-gray-600 leading-relaxed flex-1 pt-1">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dicas */}
              {selectedContent.tips && selectedContent.tips.length > 0 && (
                <div className="bg-amber-50 rounded-2xl p-5">
                  <h3 className="font-semibold text-amber-900 mb-3">
                    💡 {selectedContent.id === 'jejum-consciente' ? 'Informações importantes' : 'Dicas importantes'}
                  </h3>
                  <ul className="space-y-2">
                    {selectedContent.tips.map((tip, index) => (
                      <li key={index} className="text-amber-800 text-sm leading-relaxed flex gap-2">
                        <span className="text-amber-500 flex-shrink-0">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mensagem de Encorajamento */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-5 text-center">
                <p className="text-gray-700 leading-relaxed italic">
                  {selectedContent.id === 'jejum-consciente' 
                    ? 'Lembre-se: o jejum é uma prática OPCIONAL e deve ser feita com consciência, bom senso e acompanhamento profissional. Respeite sempre os limites do seu corpo e a sua individualidade. 🌸'
                    : 'Lembre-se: não há pressão nem performance. Este é um momento de cuidado e respeito pelo seu corpo. Faça no seu ritmo, com gentileza. 🌸'
                  }
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => handleMarkAsDone(selectedContent.id)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Marcar como feito
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
