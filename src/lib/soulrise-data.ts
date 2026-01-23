// Dados e lógica de geração de planos da SoulRise

export type Goal = 'equilibrio-mental' | 'disciplina-consistencia' | 'conexao-espiritual' | 'proposito-alinhamento';

export interface DailyPlan {
  intencao: string;
  acaoDiaria: string;
  acaoComplementar: string;
  ritual: string;
  afirmacao: string;
  miniDesafio: string;
}

export const goalLabels: Record<Goal, string> = {
  'equilibrio-mental': 'Equilíbrio mental e emocional',
  'disciplina-consistencia': 'Disciplina e consistência diária',
  'conexao-espiritual': 'Conexão espiritual e fé',
  'proposito-alinhamento': 'Propósito e alinhamento interior'
};

// Gerador de planos personalizados baseado nos objetivos selecionados
// O primeiro objetivo tem prioridade na personalização
export function generateDailyPlan(goals: string[] | Goal): DailyPlan {
  // Normaliza o input para sempre trabalhar com array
  const goalsArray = Array.isArray(goals) ? goals : [goals];
  const primaryGoal = goalsArray[0] as Goal;
  const secondaryGoal = goalsArray[1] as Goal | undefined;

  const plans: Record<Goal, DailyPlan> = {
    'equilibrio-mental': {
      intencao: 'Cultivar serenidade e equilíbrio interior',
      acaoDiaria: 'Praticar 10 minutos de respiração consciente',
      acaoComplementar: 'Escrever 3 coisas pelas quais és grato',
      ritual: 'Momento de silêncio ao acordar',
      afirmacao: 'Eu escolho a paz em cada momento',
      miniDesafio: 'Desligar notificações por 1 hora'
    },
    'disciplina-consistencia': {
      intencao: 'Fortalecer a consistência e o foco',
      acaoDiaria: 'Completar a tarefa mais importante antes do meio-dia',
      acaoComplementar: 'Planear o dia seguinte antes de dormir',
      ritual: 'Acordar à mesma hora todos os dias',
      afirmacao: 'Eu sou disciplinado e focado nos meus objetivos',
      miniDesafio: 'Fazer a cama logo ao acordar'
    },
    'conexao-espiritual': {
      intencao: 'Aprofundar a conexão espiritual',
      acaoDiaria: 'Ler e refletir sobre um versículo bíblico',
      acaoComplementar: 'Praticar 15 minutos de oração ou meditação',
      ritual: 'Momento de gratidão espiritual',
      afirmacao: 'Eu confio no propósito divino da minha jornada',
      miniDesafio: 'Partilhar uma mensagem inspiradora'
    },
    'proposito-alinhamento': {
      intencao: 'Descobrir e viver o meu propósito',
      acaoDiaria: 'Refletir sobre os meus valores e missão de vida',
      acaoComplementar: 'Fazer uma ação alinhada com o meu propósito',
      ritual: 'Momento de conexão interior ao acordar',
      afirmacao: 'Eu estou alinhado com o meu propósito divino',
      miniDesafio: 'Identificar uma paixão e dedicar 30 minutos a ela'
    }
  };

  // Retorna o plano baseado no objetivo principal
  // Se houver objetivo secundário, pode ser usado para personalização futura
  const plan = { ...plans[primaryGoal] };
  
  // Adiciona informação sobre objetivo secundário se existir
  if (secondaryGoal && plans[secondaryGoal]) {
    const secondaryPlan = plans[secondaryGoal];
    // Combina ação complementar do objetivo secundário
    plan.acaoComplementar = `${plan.acaoComplementar} + ${secondaryPlan.acaoComplementar.toLowerCase()}`;
  }

  return plan;
}

// Mensagens do dia para Desenvolvimento Pessoal
export const mensagensDoDia = [
  'A disciplina é a ponte entre objetivos e conquistas.',
  'Pequenos passos diários criam grandes transformações.',
  'O teu maior poder está na consistência.',
  'Cada dia é uma nova oportunidade de crescimento.',
  'A mudança começa quando decides agir.'
];

// Afirmações para Desenvolvimento Pessoal
export const afirmacoes = [
  'Eu sou capaz de alcançar os meus objetivos.',
  'Eu escolho crescer a cada dia.',
  'Eu tenho o poder de criar a vida que desejo.',
  'Eu sou disciplinado e focado.',
  'Eu mereço sucesso e felicidade.'
];

// Versículos do dia
export const versiculosDoDia = [
  { texto: 'Tudo posso naquele que me fortalece.', referencia: 'Filipenses 4:13' },
  { texto: 'Confia no Senhor de todo o teu coração.', referencia: 'Provérbios 3:5' },
  { texto: 'O Senhor é a minha luz e a minha salvação.', referencia: 'Salmos 27:1' },
  { texto: 'Aquietai-vos e sabei que eu sou Deus.', referencia: 'Salmos 46:10' },
  { texto: 'Porque para Deus nada é impossível.', referencia: 'Lucas 1:37' }
];

// Reflexões espirituais
export const reflexoesEspirituais = [
  'A fé move montanhas quando a confiança é plena.',
  'Na quietude, encontramos a voz divina.',
  'Cada desafio é uma oportunidade de crescimento espiritual.',
  'A gratidão abre portas para bênçãos infinitas.',
  'O amor é a essência da conexão espiritual.'
];

// Guias de Desenvolvimento Pessoal
export const guiasDesenvolvimento = [
  {
    id: 'disciplina',
    titulo: 'Disciplina',
    descricao: 'Construir hábitos consistentes',
    conteudo: 'A disciplina não é punição, é liberdade. Quando criamos rotinas sólidas, libertamos a mente para focar no que realmente importa. Começa pequeno: escolhe um hábito e pratica-o durante 21 dias consecutivos.'
  },
  {
    id: 'proposito',
    titulo: 'Propósito',
    descricao: 'Descobrir o teu caminho',
    conteudo: 'O propósito não é algo que se encontra, é algo que se constrói através das tuas ações diárias. Pergunta-te: O que me faz sentir vivo? Como posso servir os outros? As respostas guiarão o teu caminho.'
  },
  {
    id: 'autoconhecimento',
    titulo: 'Autoconhecimento',
    descricao: 'Conhecer-te profundamente',
    conteudo: 'O autoconhecimento é a base de toda transformação. Dedica tempo para refletir sobre os teus valores, medos e sonhos. Journaling diário é uma ferramenta poderosa para esta jornada interior.'
  }
];

// Guias Espirituais
export const guiasEspirituais = [
  {
    id: 'oracao',
    titulo: 'Oração',
    descricao: 'Comunicar com o divino',
    conteudo: 'A oração é um diálogo, não um monólogo. Fala com Deus como falarias com um amigo próximo. Partilha as tuas alegrias, medos e gratidão. E depois, escuta em silêncio.'
  },
  {
    id: 'fe',
    titulo: 'Fé',
    descricao: 'Confiar no invisível',
    conteudo: 'A fé não elimina as tempestades, mas dá-te paz durante elas. Cultiva a confiança de que há um propósito maior, mesmo quando não consegues ver o caminho completo.'
  },
  {
    id: 'gratidao-espiritual',
    titulo: 'Gratidão Espiritual',
    descricao: 'Reconhecer as bênçãos',
    conteudo: 'A gratidão transforma o que temos em suficiente. Todos os dias, reconhece as bênçãos na tua vida - grandes e pequenas. Este simples ato eleva a tua vibração espiritual.'
  }
];

// Rituais diários
export const rituaisDiarios = [
  { id: 'agua', titulo: 'Água', descricao: 'Beber 2L de água', icon: 'droplet' },
  { id: 'leitura', titulo: 'Leitura', descricao: '15 min de leitura', icon: 'book-open' },
  { id: 'movimento', titulo: 'Movimento', descricao: '20 min de exercício', icon: 'activity' },
  { id: 'gratidao', titulo: 'Gratidão', descricao: 'Escrever 3 gratidões', icon: 'heart' },
  { id: 'mental', titulo: 'Momento Mental', descricao: '10 min de meditação', icon: 'brain' }
];

// Orações
export interface Oracao {
  id: string;
  titulo: string;
  descricao: string;
  contexto: string;
  textoCompleto: string;
  isPremium: boolean;
  previewText?: string; // Texto de preview para orações premium
}

export const oracoes: Oracao[] = [
  {
    id: 'oracao-manha',
    titulo: 'Oração da Manhã',
    descricao: 'Para começar o dia com propósito',
    contexto: 'Esta oração ajuda-te a começar o dia com clareza, gratidão e confiança no propósito divino.',
    textoCompleto: `Senhor, agradeço por este novo dia que me ofereces.

Que eu possa viver cada momento com presença e gratidão.
Que as minhas ações reflitam o amor e a luz que habita em mim.
Que eu seja instrumento de paz e bondade para todos que cruzarem o meu caminho.

Guia os meus passos, ilumina as minhas decisões e fortalece a minha fé.

Confio em Ti e no propósito que tens para a minha vida.

Amém.`,
    isPremium: false
  },
  {
    id: 'oracao-gratidao',
    titulo: 'Oração de Gratidão',
    descricao: 'Para reconhecer as bênçãos',
    contexto: 'A gratidão transforma o que temos em suficiente e abre portas para mais bênçãos. Esta oração ajuda-te a reconhecer e celebrar as dádivas da vida.',
    previewText: `Pai Celestial, venho diante de Ti com um coração cheio de gratidão.

Agradeço por cada respiração, por cada momento de vida que me concedes.
Agradeço pela saúde, pela família, pelos amigos que iluminam os meus dias.`,
    textoCompleto: `Pai Celestial, venho diante de Ti com um coração cheio de gratidão.

Agradeço por cada respiração, por cada momento de vida que me concedes.
Agradeço pela saúde, pela família, pelos amigos que iluminam os meus dias.
Agradeço pelos desafios que me fortalecem e pelas vitórias que me inspiram.

Reconheço que tudo o que tenho é uma bênção Tua.
Que eu nunca esqueça de agradecer, mesmo nos momentos difíceis.
Que a gratidão seja a minha oração constante.

Obrigado por me amares incondicionalmente.
Obrigado por nunca me abandonares.
Obrigado por seres a minha força e o meu refúgio.

Que eu possa retribuir este amor servindo os outros com compaixão e generosidade.

Amém.`,
    isPremium: true
  },
  {
    id: 'oracao-protecao',
    titulo: 'Oração de Proteção',
    descricao: 'Para sentir segurança divina',
    contexto: 'Quando precisas de sentir a proteção e o cuidado divino sobre ti e os teus entes queridos.',
    textoCompleto: `Senhor, coloco-me sob a Tua proteção divina.

Que a Tua luz me envolva e afaste toda a escuridão.
Que os Teus anjos me guardem em todos os meus caminhos.
Protege a minha família, os meus amigos e todos aqueles que amo.

Que nenhum mal nos alcance.
Que a Tua paz habite nos nossos corações e nos nossos lares.

Confio plenamente em Ti, meu protetor e guardião.

Amém.`,
    isPremium: false
  },
  {
    id: 'oracao-dias-dificeis',
    titulo: 'Oração para Dias Difíceis',
    descricao: 'Para encontrar força nos desafios',
    contexto: 'Nos momentos de dificuldade, esta oração oferece conforto, força e a certeza de que não estás sozinho.',
    previewText: `Senhor, hoje o meu coração está pesado.
As dificuldades parecem maiores do que a minha força.

Mas eu sei que Tu estás comigo.
Sei que nunca me abandonas, mesmo quando não consigo sentir a Tua presença.`,
    textoCompleto: `Senhor, hoje o meu coração está pesado.
As dificuldades parecem maiores do que a minha força.

Mas eu sei que Tu estás comigo.
Sei que nunca me abandonas, mesmo quando não consigo sentir a Tua presença.

Dá-me força para enfrentar este dia.
Dá-me coragem para não desistir.
Dá-me fé para confiar que tudo tem um propósito.

Transforma a minha dor em crescimento.
Transforma o meu medo em confiança.
Transforma a minha fraqueza em força através de Ti.

Lembra-me que as tempestades passam e que o sol voltará a brilhar.
Lembra-me que Tu tens um plano perfeito para a minha vida.

Segura a minha mão e guia-me através desta jornada.

Amém.`,
    isPremium: true
  },
  {
    id: 'oracao-paz',
    titulo: 'Oração pela Paz Interior',
    descricao: 'Para acalmar a mente e o coração',
    contexto: 'Quando a ansiedade e a agitação tomam conta, esta oração traz serenidade e equilíbrio.',
    textoCompleto: `Senhor da Paz, acalma o meu coração inquieto.

Que a Tua paz, que excede todo o entendimento, inunde o meu ser.
Que eu possa soltar as preocupações e confiar plenamente em Ti.

Ensina-me a viver no presente, sem ansiedade pelo futuro.
Ensina-me a encontrar serenidade mesmo no meio do caos.

Que a Tua paz seja a minha âncora.

Amém.`,
    isPremium: false
  },
  {
    id: 'oracao-dormir',
    titulo: 'Oração Antes de Ir Dormir',
    descricao: 'Para descansar em paz',
    contexto: 'Esta oração prepara o teu coração e mente para um descanso profundo e restaurador, entregando o dia nas mãos de Deus.',
    previewText: `Senhor, agradeço por este dia que termina.

Agradeço pelas alegrias, pelas lições e até pelos desafios que me fizeram crescer.
Perdoa-me por qualquer erro que tenha cometido.`,
    textoCompleto: `Senhor, agradeço por este dia que termina.

Agradeço pelas alegrias, pelas lições e até pelos desafios que me fizeram crescer.
Perdoa-me por qualquer erro que tenha cometido.
Ajuda-me a perdoar aqueles que me magoaram.

Agora, entrego este dia nas Tuas mãos.
Entrego as minhas preocupações, os meus medos e as minhas ansiedades.

Que eu possa descansar em paz, sabendo que Tu cuidas de mim.
Que o meu sono seja profundo e restaurador.
Que eu acorde amanhã renovado e cheio de energia.

Protege-me durante a noite.
Protege todos aqueles que amo.

Que os Teus anjos nos guardem até o amanhecer.

Boa noite, Senhor. Confio em Ti.

Amém.`,
    isPremium: true
  },
  {
    id: 'oracao-sabedoria',
    titulo: 'Oração por Sabedoria',
    descricao: 'Para tomar decisões com clareza',
    contexto: 'Quando precisas de discernimento e sabedoria para tomar decisões importantes.',
    textoCompleto: `Senhor, fonte de toda sabedoria, ilumina a minha mente.

Que eu possa ver com clareza o caminho que devo seguir.
Que eu possa discernir entre o certo e o errado.
Que as minhas decisões sejam guiadas pela Tua vontade.

Dá-me sabedoria para agir com prudência.
Dá-me coragem para seguir o que é justo.
Dá-me humildade para reconhecer quando preciso de ajuda.

Confio na Tua orientação.

Amém.`,
    isPremium: false
  }
];
