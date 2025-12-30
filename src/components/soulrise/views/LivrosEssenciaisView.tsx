'use client';

import { useState } from 'react';
import { 
  Book, 
  ChevronRight, 
  X, 
  BookOpen, 
  User, 
  Lightbulb, 
  Lock,
  BookmarkPlus,
  BookmarkCheck,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Tipos
interface Livro {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  emoji: string;
  descricaoCurta: string;
  ideiaPrincipal: string;
  // Conteúdo Premium (bloqueado)
  resumoPratico: string;
  comoAplicar: string;
  exercicioPratico: string;
}

// Dados dos livros
const livrosEssenciais: Livro[] = [
  {
    id: 'mindset',
    titulo: 'Mindset',
    autor: 'Carol S. Dweck',
    categoria: '🧠 Mentalidade & Psicologia',
    emoji: '🧠',
    descricaoCurta: 'A psicóloga de Stanford revela como a mentalidade de crescimento pode transformar a tua vida.',
    ideiaPrincipal: 'Existem duas mentalidades: fixa (acreditas que as tuas capacidades são imutáveis) e de crescimento (acreditas que podes desenvolver as tuas capacidades). A mentalidade que escolhes determina o teu sucesso e felicidade.',
    // Premium
    resumoPratico: 'Carol Dweck demonstra através de décadas de pesquisa que pessoas com mentalidade de crescimento veem desafios como oportunidades, aprendem com críticas e persistem face a obstáculos. Já pessoas com mentalidade fixa evitam desafios, sentem-se ameaçadas pelo sucesso dos outros e desistem facilmente. A boa notícia? Podes mudar a tua mentalidade.',
    comoAplicar: '1. Identifica situações onde tens mentalidade fixa (ex: "não sou bom em matemática"). 2. Reformula para mentalidade de crescimento ("ainda não sou bom em matemática, mas posso melhorar"). 3. Celebra o esforço, não apenas resultados. 4. Vê falhas como feedback, não como definição de quem és.',
    exercicioPratico: 'Durante uma semana, sempre que te apanhares a pensar "não consigo fazer isto", adiciona a palavra "ainda" no final. "Não consigo fazer isto... ainda." Observa como esta pequena mudança afeta a tua motivação e persistência.'
  },
  {
    id: 'psicologia-dinheiro',
    titulo: 'A Psicologia do Dinheiro',
    autor: 'Morgan Housel',
    categoria: '📈 Finanças',
    emoji: '📈',
    descricaoCurta: 'Lições atemporais sobre riqueza, ganância e felicidade que vão além de números e fórmulas.',
    ideiaPrincipal: 'Sucesso financeiro não é sobre o que sabes, mas como te comportas. A tua relação com o dinheiro é moldada pelas tuas experiências únicas, e compreender isto é mais importante que qualquer estratégia de investimento.',
    // Premium
    resumoPratico: 'Morgan Housel explica que riqueza não é o que ganhas, mas o que não gastas. Pessoas ricas não são necessariamente aquelas com maiores rendimentos, mas aquelas que controlam os seus gastos e investem consistentemente. O livro desmonta mitos sobre dinheiro e mostra que comportamento vence inteligência.',
    comoAplicar: '1. Define "suficiente" - saber quando parar de perseguir mais. 2. Poupa não para algo específico, mas para ter opções no futuro. 3. Investe consistentemente, mesmo pequenas quantias. 4. Não compares a tua situação financeira com a dos outros - cada um tem a sua história. 5. Valoriza tempo e liberdade acima de símbolos de status.',
    exercicioPratico: 'Calcula quanto dinheiro precisas para te sentires "suficientemente seguro" (ex: 6 meses de despesas). Cria um plano simples para chegar lá: quanto podes poupar por mês? Automatiza essa poupança. Depois de atingires esse objetivo, decide o próximo nível de "suficiente".'
  },
  {
    id: 'habitos-atomicos',
    titulo: 'Hábitos Atómicos',
    autor: 'James Clear',
    categoria: '🔁 Hábitos & Produtividade',
    emoji: '🔁',
    descricaoCurta: 'Um guia prático para construir bons hábitos, quebrar maus hábitos e dominar pequenos comportamentos que levam a grandes resultados.',
    ideiaPrincipal: 'Mudanças pequenas e consistentes (hábitos atómicos) acumulam-se em resultados extraordinários. Melhorar 1% todos os dias resulta em ser 37 vezes melhor ao fim de um ano. Foca-te no sistema, não nos objetivos.',
    // Premium
    resumoPratico: 'James Clear apresenta um sistema de 4 leis para criar bons hábitos: 1) Torna-o óbvio (deixa pistas visuais), 2) Torna-o atraente (associa a algo que gostas), 3) Torna-o fácil (reduz fricção), 4) Torna-o satisfatório (recompensa-te imediatamente). Para quebrar maus hábitos, inverte as leis.',
    comoAplicar: '1. Identifica um hábito que queres criar. 2. Torna-o minúsculo (ex: 1 flexão, não 30). 3. Empilha-o num hábito existente (ex: "depois de escovar os dentes, faço 1 flexão"). 4. Rastreia o progresso visualmente (marca X no calendário). 5. Nunca falha dois dias seguidos. 6. Foca-te em aparecer, não em perfeição.',
    exercicioPratico: 'Escolhe UM hábito minúsculo que queres criar (ex: ler 1 página, meditar 1 minuto, beber 1 copo de água ao acordar). Faz-o todos os dias durante 30 dias, sem exceções. Não aumentes a dificuldade - o objetivo é consistência, não intensidade. Marca cada dia num calendário físico.'
  },
  {
    id: 'fazer-amigos',
    titulo: 'Como Fazer Amigos e Influenciar Pessoas',
    autor: 'Dale Carnegie',
    categoria: '❤️ Relacionamentos',
    emoji: '❤️',
    descricaoCurta: 'O clássico atemporal sobre como construir relações genuínas e influenciar pessoas de forma autêntica.',
    ideiaPrincipal: 'Podes fazer mais amigos em dois meses ao interessar-te genuinamente pelos outros do que em dois anos tentando fazer os outros interessarem-se por ti. Pessoas querem sentir-se importantes e apreciadas.',
    // Premium
    resumoPratico: 'Dale Carnegie ensina que a base de todas as relações é interesse genuíno. Princípios-chave: 1) Não critiques, condenes ou te queixes. 2) Dá apreciação honesta e sincera. 3) Desperta nos outros um desejo ardente. 4) Torna-te genuinamente interessado nas outras pessoas. 5) Sorri. 6) Lembra-te dos nomes. 7) Ouve ativamente. 8) Fala sobre os interesses da outra pessoa.',
    comoAplicar: '1. Em conversas, faz mais perguntas do que afirmações. 2. Lembra-te de detalhes que as pessoas partilham e pergunta sobre eles depois. 3. Dá elogios específicos e genuínos (não genéricos). 4. Admite erros rapidamente e com sinceridade. 5. Deixa a outra pessoa salvar a face. 6. Começa conversas difíceis com elogios sinceros.',
    exercicioPratico: 'Durante uma semana, em cada conversa que tiveres, faz pelo menos 3 perguntas genuínas sobre a outra pessoa antes de falar sobre ti. Ouve ativamente as respostas. No final da semana, reflete: como as pessoas reagiram? Como te sentiste? Que diferença notaste nas tuas relações?'
  },
  {
    id: 'poder-agora',
    titulo: 'O Poder do Agora',
    autor: 'Eckhart Tolle',
    categoria: '🙏 Espiritualidade',
    emoji: '🙏',
    descricaoCurta: 'Um guia para a iluminação espiritual através da presença consciente no momento presente.',
    ideiaPrincipal: 'O momento presente é tudo o que tens. O passado já não existe e o futuro ainda não chegou. Sofrimento vem de viver no passado (arrependimento) ou no futuro (ansiedade). Libertação vem de estar totalmente presente no agora.',
    // Premium
    resumoPratico: 'Eckhart Tolle explica que não és os teus pensamentos - és a consciência que observa os pensamentos. A mente é uma ferramenta útil, mas a maioria das pessoas está identificada com ela, criando sofrimento desnecessário. Ao aprenderes a estar presente, transcendes o ego e acedes a paz profunda. O livro oferece práticas para sair da mente e entrar no agora.',
    comoAplicar: '1. Pratica observar os teus pensamentos sem te identificares com eles ("estou a ter o pensamento de que...", não "eu sou..."). 2. Usa a respiração como âncora ao presente. 3. Faz pausas conscientes ao longo do dia - para e sente o teu corpo. 4. Aceita o momento presente como é, sem resistência. 5. Pergunta-te frequentemente: "Que problema tenho AGORA, neste momento?" (geralmente, nenhum).',
    exercicioPratico: 'Pratica "presença sensorial" durante 5 minutos por dia: senta-te confortavelmente, fecha os olhos e foca-te nas sensações do corpo. Sente o peso do corpo, a temperatura da pele, a respiração. Quando a mente vaguear (e vai vaguear), gentilmente traz a atenção de volta às sensações. Não julgues, apenas observa.'
  },
  {
    id: 'porque-dormimos',
    titulo: 'Porque Dormimos',
    autor: 'Matthew Walker',
    categoria: '🌿 Saúde & Energia',
    emoji: '🌿',
    descricaoCurta: 'A ciência revolucionária do sono e dos sonhos, explicando porque o sono é o teu superpoder mais subestimado.',
    ideiaPrincipal: 'Sono não é tempo perdido - é o pilar fundamental da saúde física, mental e emocional. Dormir menos de 7-8 horas por noite prejudica memória, criatividade, sistema imunitário, saúde mental e aumenta risco de doenças graves.',
    // Premium
    resumoPratico: 'Matthew Walker, neurocientista do sono, apresenta evidências esmagadoras: sono inadequado está ligado a Alzheimer, cancro, diabetes, obesidade, depressão e ansiedade. Mas também mostra que melhorar o sono melhora dramaticamente aprendizagem, criatividade, tomada de decisões e saúde geral. O livro desmonta o mito de que "dormir é para fracos" e mostra que dormir bem é a base de alta performance.',
    comoAplicar: '1. Prioriza 7-9 horas de sono (não negociável). 2. Mantém horários consistentes (mesmo aos fins de semana). 3. Escurece o quarto completamente. 4. Mantém temperatura fresca (18-19°C ideal). 5. Evita ecrãs 1h antes de dormir (luz azul suprime melatonina). 6. Evita cafeína após 14h. 7. Evita álcool (fragmenta o sono). 8. Cria ritual de descompressão antes de dormir.',
    exercicioPratico: 'Durante 2 semanas, compromete-te a dormir 8 horas por noite. Define alarme para ir para a cama (não apenas para acordar). Cria um ritual de 30 minutos antes de dormir: sem ecrãs, luz baixa, atividade relaxante (ler, meditar, alongar). Regista como te sentes: energia, humor, foco, criatividade. Compara com as semanas anteriores.'
  }
];

// Categorias únicas
const categorias = Array.from(new Set(livrosEssenciais.map(l => l.categoria)));

export default function LivrosEssenciaisView({ onBack }: { onBack: () => void }) {
  const [selectedLivro, setSelectedLivro] = useState<Livro | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [livrosParaLer, setLivrosParaLer] = useState<Set<string>>(new Set());
  const isPremium = false; // Aqui você conectaria com o sistema de assinatura real

  const toggleLivroParaLer = (livroId: string) => {
    setLivrosParaLer(prev => {
      const newSet = new Set(prev);
      if (newSet.has(livroId)) {
        newSet.delete(livroId);
      } else {
        newSet.add(livroId);
      }
      return newSet;
    });
  };

  const handlePremiumClick = () => {
    if (!isPremium) {
      setShowPaywall(true);
    }
  };

  // Modal de Paywall
  if (showPaywall) {
    return (
      <div className="max-w-3xl mx-auto pb-20 md:pb-8">
        <Button
          onClick={() => setShowPaywall(false)}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Voltar
        </Button>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Desbloqueia Conteúdo Premium
            </h1>
            <p className="text-lg md:text-xl text-purple-100">
              Acede a resumos práticos, guias de aplicação e exercícios de todos os livros essenciais
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-xl mb-4">O que inclui:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Resumos práticos de cada livro com as ideias-chave</span>
              </li>
              <li className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Guias de "Como aplicar na vida real" passo a passo</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Exercícios práticos baseados em cada livro</span>
              </li>
              <li className="flex items-start gap-3">
                <Book className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Acesso a todos os 6 livros essenciais e futuros</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-purple-50 font-bold text-lg px-8 py-6 rounded-xl shadow-xl"
            >
              Subscrever Premium
            </Button>
            <p className="text-sm text-purple-200 mt-4">
              Cancela quando quiseres. Sem compromissos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Visualização detalhada de um livro
  if (selectedLivro) {
    return (
      <div className="max-w-3xl mx-auto pb-20 md:pb-8">
        <Button
          onClick={() => setSelectedLivro(null)}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Voltar aos Livros
        </Button>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
          {/* Header do Livro */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-3xl">
                  {selectedLivro.emoji}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {selectedLivro.titulo}
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <User className="w-4 h-4" />
                    {selectedLivro.autor}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleLivroParaLer(selectedLivro.id)}
                className={`p-3 rounded-xl transition-all ${
                  livrosParaLer.has(selectedLivro.id)
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {livrosParaLer.has(selectedLivro.id) ? (
                  <BookmarkCheck className="w-6 h-6" />
                ) : (
                  <BookmarkPlus className="w-6 h-6" />
                )}
              </button>
            </div>
            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              {selectedLivro.categoria}
            </span>
          </div>

          {/* Conteúdo FREE */}
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                <Book className="w-5 h-5 text-purple-500" />
                Sobre o Livro
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedLivro.descricaoCurta}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                Ideia Principal
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedLivro.ideiaPrincipal}
              </p>
            </div>
          </div>

          {/* Conteúdo PREMIUM (Bloqueado) */}
          <div className="border-t-2 border-gray-200 pt-8">
            <div className="relative">
              {/* Overlay de bloqueio */}
              {!isPremium && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white z-10 flex items-end justify-center pb-8">
                  <button
                    onClick={handlePremiumClick}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-200 flex items-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    Desbloquear Conteúdo Premium
                  </button>
                </div>
              )}

              {/* Conteúdo Premium (blur quando bloqueado) */}
              <div className={!isPremium ? 'blur-sm pointer-events-none' : ''}>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                      Resumo Prático
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedLivro.resumoPratico}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                      <Lightbulb className="w-5 h-5 text-purple-600" />
                      Como Aplicar na Vida Real
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedLivro.comoAplicar}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      Exercício Prático
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedLivro.exercicioPratico}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Lista de livros por categoria
  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 text-gray-600 hover:text-gray-800"
      >
        ← Voltar ao Desenvolvimento
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          📚 Livros Essenciais
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Crescimento pessoal e profissional através da leitura prática
        </p>
      </div>

      {/* Info sobre conteúdo Free vs Premium */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-8 border-2 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0">
            <Book className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Como funciona</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold text-purple-700">Free:</span> Acesso a todos os livros, descrições e ideias principais.<br />
              <span className="font-semibold text-purple-700">Premium:</span> Resumos práticos, guias de aplicação e exercícios de cada livro.
            </p>
          </div>
        </div>
      </div>

      {/* Livros organizados por categoria */}
      <div className="space-y-8">
        {categorias.map((categoria) => {
          const livrosCategoria = livrosEssenciais.filter(l => l.categoria === categoria);
          
          return (
            <div key={categoria}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                {categoria}
              </h2>
              
              <div className="space-y-3">
                {livrosCategoria.map((livro) => (
                  <button
                    key={livro.id}
                    onClick={() => setSelectedLivro(livro)}
                    className="w-full bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {livro.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1">
                              {livro.titulo}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {livro.autor}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {livrosParaLer.has(livro.id) && (
                              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                                Quero ler
                              </span>
                            )}
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {livro.descricaoCurta}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contador de livros para ler */}
      {livrosParaLer.size > 0 && (
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white text-center">
          <p className="text-lg font-semibold">
            📖 {livrosParaLer.size} {livrosParaLer.size === 1 ? 'livro' : 'livros'} na tua lista "Quero ler"
          </p>
          <p className="text-sm text-purple-100 mt-2">
            Começa pelo primeiro e transforma conhecimento em ação
          </p>
        </div>
      )}
    </div>
  );
}
