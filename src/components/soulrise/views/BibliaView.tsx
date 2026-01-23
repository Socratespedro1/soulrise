'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Lock,
  ChevronRight,
  Heart,
  Lightbulb,
  ArrowLeft,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { savePrayer } from '@/lib/saved-content-helpers';
import { supabase, isSupabaseConfigured, offlineAuth } from '@/lib/supabase';

const CHECKOUT_URL = 'https://pay.kambafy.com/checkout/a8abc16a-4344-4e32-b456-4f69592454ac';

// Temas disponíveis
const TEMAS_GRATUITOS = ['Ansiedade', 'Medo', 'Disciplina', 'Solidão', 'Força'];
const TEMAS_PREMIUM = ['Propósito', 'Perdão', 'Gratidão', 'Fé'];

const TODOS_TEMAS = [
  'Ansiedade',
  'Medo',
  'Propósito',
  'Fé',
  'Disciplina',
  'Solidão',
  'Gratidão',
  'Força',
  'Perdão'
];

// Conteúdo dos temas
const CONTEUDO_TEMAS: Record<string, {
  introducao: string;
  versiculos: Array<{ texto: string; referencia: string }>;
  explicacao: string;
  aplicacao: string;
}> = {
  'Ansiedade': {
    introducao: 'A ansiedade é uma das emoções mais comuns nos dias de hoje. A Bíblia oferece palavras de paz e conforto para acalmar o coração inquieto.',
    versiculos: [
      { texto: '"Não andeis ansiosos por coisa alguma, mas em tudo, pela oração e súplica, com ação de graças, sejam as vossas petições conhecidas diante de Deus."', referencia: 'Filipenses 4:6' },
      { texto: '"Lança o teu fardo sobre o Senhor, e ele te susterá; jamais permitirá que o justo seja abalado."', referencia: 'Salmos 55:22' },
      { texto: '"Não se turbe o vosso coração; credes em Deus, crede também em mim."', referencia: 'João 14:1' }
    ],
    explicacao: 'A ansiedade surge quando tentamos carregar sozinhos o peso das nossas preocupações. Estes versículos não dizem que não devemos sentir ansiedade, mas mostram que há um caminho para lidar com ela: entregar as preocupações através da oração, confiar que não estamos sozinhos e acreditar que há uma força maior que nos sustenta. A paz não vem de ter todas as respostas, mas de confiar em quem tem.',
    aplicacao: 'Hoje, quando sentires ansiedade a crescer, para por um momento. Respira fundo três vezes. Depois, em voz alta ou mentalmente, entrega cada preocupação específica. Diz: "Não consigo controlar isto sozinho, confio que serei sustentado." Escreve as tuas preocupações num papel e, simbolicamente, deixa-as de lado. Volta a elas amanhã, se necessário, mas hoje, descansa.'
  },
  'Medo': {
    introducao: 'O medo pode paralisar-nos e impedir-nos de viver plenamente. A Palavra traz coragem e lembra-nos que não estamos sozinhos.',
    versiculos: [
      { texto: '"Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça."', referencia: 'Isaías 41:10' },
      { texto: '"Porque Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação."', referencia: '2 Timóteo 1:7' },
      { texto: '"Ainda que eu ande pelo vale da sombra da morte, não temerei mal nenhum, porque tu estás comigo."', referencia: 'Salmos 23:4' }
    ],
    explicacao: 'O medo é uma resposta natural a situações de perigo ou incerteza. Mas muitas vezes, o medo que sentimos não é proporcional à realidade. Estes versículos lembram-nos que há uma presença constante connosco, mesmo nos momentos mais escuros. Não se trata de nunca sentir medo, mas de não deixar que ele nos controle. A coragem não é a ausência de medo, mas a decisão de avançar apesar dele.',
    aplicacao: 'Identifica hoje uma coisa que tens evitado por medo. Pode ser uma conversa difícil, uma decisão importante ou um passo em direção a um sonho. Não precisas de fazer tudo hoje, mas dá um pequeno passo. Antes de agir, repete para ti mesmo: "Não estou sozinho. Tenho força para isto." E depois, age. Mesmo que seja um passo pequeno, é um passo de coragem.'
  },
  'Disciplina': {
    introducao: 'A disciplina é o caminho para a transformação. A Bíblia ensina que pequenas escolhas diárias constroem o caráter e moldam o futuro.',
    versiculos: [
      { texto: '"Toda disciplina, com efeito, no momento não parece ser motivo de alegria, mas de tristeza; ao depois, entretanto, produz fruto pacífico aos que têm sido por ela exercitados, fruto de justiça."', referencia: 'Hebreus 12:11' },
      { texto: '"Porque Deus não é Deus de confusão, mas de paz."', referencia: '1 Coríntios 14:33' },
      { texto: '"Tudo me é lícito, mas nem tudo convém. Tudo me é lícito, mas eu não me deixarei dominar por nenhuma coisa."', referencia: '1 Coríntios 6:12' }
    ],
    explicacao: 'A disciplina não é sobre ser perfeito ou nunca falhar. É sobre fazer escolhas consistentes que te aproximam de quem queres ser. Muitas vezes, a disciplina parece difícil no momento, mas os frutos vêm depois. É como plantar uma semente: não vês resultados imediatos, mas com paciência e consistência, algo belo cresce. A disciplina é um ato de amor próprio, porque escolhes o teu bem-estar a longo prazo em vez da gratificação imediata.',
    aplicacao: 'Escolhe hoje uma área da tua vida onde queres mais disciplina. Pode ser saúde, finanças, relacionamentos ou espiritualidade. Define uma ação pequena e específica que podes fazer hoje. Não tentes mudar tudo de uma vez. Foca-te numa coisa só. E quando fizeres essa pequena ação, celebra. A disciplina constrói-se com pequenas vitórias diárias.'
  },
  'Solidão': {
    introducao: 'A solidão pode ser dolorosa, mas a Bíblia lembra-nos que nunca estamos verdadeiramente sozinhos. Há uma presença constante que nos acompanha.',
    versiculos: [
      { texto: '"Não te deixarei nem te desampararei."', referencia: 'Hebreus 13:5' },
      { texto: '"Eis que estou convosco todos os dias até à consumação do século."', referencia: 'Mateus 28:20' },
      { texto: '"O Senhor é o meu pastor; nada me faltará."', referencia: 'Salmos 23:1' }
    ],
    explicacao: 'A solidão não é apenas estar fisicamente sozinho, mas sentir-se desconectado, incompreendido ou invisível. Estes versículos falam de uma companhia que vai além do físico. Há uma presença que te vê, te conhece e está contigo, mesmo quando ninguém mais está. A solidão pode ser uma oportunidade para te conectares contigo mesmo e com algo maior. Não precisas de preencher o vazio com barulho; às vezes, o silêncio é onde encontras a verdadeira companhia.',
    aplicacao: 'Se te sentes sozinho hoje, em vez de fugir desse sentimento, senta-te com ele por alguns minutos. Reconhece a dor, mas também reconhece que não estás abandonado. Depois, faz algo gentil por ti mesmo: prepara uma refeição que gostas, dá um passeio, escreve no teu diário. E se puderes, contacta alguém. Às vezes, a solidão quebra-se com um simples "olá".'
  },
  'Força': {
    introducao: 'Quando te sentes fraco e cansado, a Bíblia lembra que há uma fonte de força que vai além das tuas próprias capacidades.',
    versiculos: [
      { texto: '"Tudo posso naquele que me fortalece."', referencia: 'Filipenses 4:13' },
      { texto: '"Mas os que esperam no Senhor renovam as suas forças, sobem com asas como águias, correm e não se cansam, caminham e não se fatigam."', referencia: 'Isaías 40:31' },
      { texto: '"A minha graça te basta, porque o poder se aperfeiçoa na fraqueza."', referencia: '2 Coríntios 12:9' }
    ],
    explicacao: 'A força não é sobre nunca te sentires fraco. É sobre continuar mesmo quando te sentes fraco. Estes versículos falam de uma força que não vem de ti, mas através de ti. Quando reconheces as tuas limitações e te conectas com algo maior, encontras uma resiliência que não sabias que tinhas. A verdadeira força não é nunca cair, mas levantar-te cada vez que cais.',
    aplicacao: 'Hoje, identifica uma situação onde te sentes fraco ou incapaz. Em vez de te julgares por isso, reconhece: "Estou a fazer o melhor que posso com o que tenho agora." Depois, pede ajuda. Pode ser a alguém, pode ser em oração, pode ser simplesmente reconhecer que não precisas de fazer tudo sozinho. A força também está em saber quando pedir apoio.'
  },
  'Propósito': {
    introducao: 'Todos procuramos um sentido para a nossa existência. A Bíblia revela que cada vida tem um propósito único e valioso.',
    versiculos: [
      { texto: '"Porque sou eu que conheço os planos que tenho para vós, diz o Senhor; planos de paz e não de mal, para vos dar um futuro e uma esperança."', referencia: 'Jeremias 29:11' },
      { texto: '"Porque somos feitura dele, criados em Cristo Jesus para boas obras, as quais Deus de antemão preparou para que andássemos nelas."', referencia: 'Efésios 2:10' },
      { texto: '"Tudo tem o seu tempo determinado, e há tempo para todo propósito debaixo do céu."', referencia: 'Eclesiastes 3:1' }
    ],
    explicacao: 'O propósito não é algo que encontras num momento de revelação mágica. É algo que se revela ao longo da vida, através das tuas escolhas, paixões e experiências. Estes versículos dizem que não estás aqui por acaso. Há um plano, mesmo quando não consegues vê-lo. O teu propósito não precisa de ser grandioso aos olhos do mundo; pode ser simples, mas profundamente significativo. Às vezes, o propósito está em como tratas as pessoas, em como vives os teus dias, em como escolhes o amor em vez do medo.',
    aplicacao: 'Hoje, reflecte sobre o que te faz sentir vivo. O que te traz alegria? Onde sentes que estás a contribuir? O propósito muitas vezes está escondido nas coisas que fazes naturalmente bem e que ajudam os outros. Escreve três coisas que te fazem sentir que estás no caminho certo. E depois, faz mais disso. O propósito não é um destino, é uma direção.'
  },
  'Perdão': {
    introducao: 'O perdão liberta-nos do peso do ressentimento e abre caminho para a cura. A Bíblia ensina que perdoar é um ato de amor próprio.',
    versiculos: [
      { texto: '"Antes, sede uns para com os outros benignos, compassivos, perdoando-vos uns aos outros, como também Deus, em Cristo, vos perdoou."', referencia: 'Efésios 4:32' },
      { texto: '"Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça."', referencia: '1 João 1:9' },
      { texto: '"Porque, se perdoardes aos homens as suas ofensas, também vosso Pai celeste vos perdoará."', referencia: 'Mateus 6:14' }
    ],
    explicacao: 'O perdão não significa esquecer ou justificar o que te magoou. Significa escolher libertar-te do peso de carregar a dor e a raiva. Perdoar é um presente que dás a ti mesmo, não à pessoa que te magoou. É dizer: "Não vou deixar que isto continue a controlar a minha vida." O perdão é um processo, não um evento único. Pode levar tempo, e está tudo bem. Mas cada passo em direção ao perdão é um passo em direção à tua própria liberdade.',
    aplicacao: 'Hoje, pensa em alguém que te magoou. Não precisas de contactar essa pessoa ou fazer as pazes imediatamente. Mas podes começar o processo de perdão dentro de ti. Escreve uma carta (que não vais enviar) dizendo tudo o que sentes. Depois, escreve: "Escolho libertar-me deste peso. Escolho perdoar, não por ti, mas por mim." E respira. O perdão é uma jornada, e hoje deste o primeiro passo.'
  },
  'Gratidão': {
    introducao: 'A gratidão transforma a nossa perspectiva e abre os olhos para as bênçãos que já temos. A Bíblia ensina que agradecer é um caminho para a alegria.',
    versiculos: [
      { texto: '"Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco."', referencia: '1 Tessalonicenses 5:18' },
      { texto: '"Entrai por suas portas com ações de graças e nos seus átrios, com hinos de louvor; rendei-lhe graças e bendizei o seu nome."', referencia: 'Salmos 100:4' },
      { texto: '"E tudo quanto fizerdes, seja em palavra, seja em ação, fazei-o em nome do Senhor Jesus, dando por ele graças a Deus Pai."', referencia: 'Colossenses 3:17' }
    ],
    explicacao: 'A gratidão não é apenas dizer "obrigado" quando algo bom acontece. É uma postura de vida, uma escolha de focar no que tens em vez do que te falta. Estes versículos falam de agradecer "em tudo", não "por tudo". Não precisas de agradecer pelas coisas más, mas podes encontrar algo para agradecer mesmo nas situações difíceis. A gratidão muda o teu foco e, ao mudar o foco, muda a tua experiência de vida.',
    aplicacao: 'Hoje, antes de dormir, escreve três coisas pelas quais és grato. Podem ser grandes ou pequenas: um sorriso de alguém, uma refeição quente, um momento de paz. Faz disto um hábito diário. Com o tempo, vais treinar o teu cérebro para procurar o bom, mesmo nos dias difíceis. A gratidão é um músculo que se fortalece com a prática.'
  },
  'Fé': {
    introducao: 'A fé é confiar mesmo quando não vês o caminho completo. A Bíblia ensina que a fé move montanhas e transforma vidas.',
    versiculos: [
      { texto: '"Ora, a fé é a certeza de coisas que se esperam, a convicção de fatos que se não veem."', referencia: 'Hebreus 11:1' },
      { texto: '"Porque andamos por fé e não por vista."', referencia: '2 Coríntios 5:7' },
      { texto: '"Se tiverdes fé como um grão de mostarda, direis a este monte: Passa daqui para acolá, e ele passará. Nada vos será impossível."', referencia: 'Mateus 17:20' }
    ],
    explicacao: 'A fé não é sobre ter todas as respostas ou nunca duvidar. É sobre dar o próximo passo mesmo quando não vês o caminho completo. É confiar que há algo maior a guiar-te, mesmo quando tudo parece incerto. A fé não elimina o medo ou a dúvida, mas dá-te coragem para avançar apesar deles. É como caminhar no escuro com uma lanterna que só ilumina o próximo passo. Não precisas de ver todo o caminho, apenas o próximo passo.',
    aplicacao: 'Hoje, identifica uma área da tua vida onde precisas de mais fé. Pode ser um sonho que parece impossível, uma situação difícil ou uma decisão importante. Em vez de tentar controlar tudo, dá um pequeno passo de fé. Pode ser tão simples como começar algo que tens adiado, ou confiar que as coisas vão melhorar. A fé cresce com a ação. Dá o primeiro passo, e o caminho vai-se revelando.'
  }
};

// Conteúdo dinâmico
const getConteudoBiblico = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  
  const versiculos = [
    {
      texto: '"Tudo posso naquele que me fortalece."',
      referencia: 'Filipenses 4:13',
      significado: 'Este versículo não é sobre ter superpoderes ou conseguir fazer tudo sozinho. Paulo escreveu isto enquanto estava preso, enfrentando dificuldades extremas. A mensagem é: quando te conectas com algo maior que ti, encontras uma força interior que não sabias que tinhas. Não é sobre nunca falhar, mas sobre ter coragem para continuar mesmo quando é difícil.',
      aplicacao: 'Hoje, quando enfrentares um desafio, lembra-te: a tua força não vem apenas de ti. Podes fazer mais do que imaginas quando confias em algo maior. Identifica uma situação difícil que estás a evitar e dá um pequeno passo em direção a ela. Não precisas de resolver tudo hoje, apenas começa.'
    },
    {
      texto: '"Confia no Senhor de todo o teu coração e não te apoies no teu próprio entendimento."',
      referencia: 'Provérbios 3:5',
      significado: 'Este provérbio fala sobre a humildade de reconhecer que não temos todas as respostas. Muitas vezes, queremos controlar tudo e entender cada detalhe antes de agir. Mas a vida não funciona assim. Confiar não significa ser passivo, mas sim ter a coragem de avançar mesmo sem ter tudo mapeado.',
      aplicacao: 'Nem sempre precisas de ter todas as respostas. Às vezes, dar o próximo passo com fé é suficiente. Confia no processo. Hoje, identifica uma área da tua vida onde estás a tentar controlar tudo. Pratica soltar um pouco esse controlo e observa o que acontece.'
    },
    {
      texto: '"Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus."',
      referencia: 'Isaías 41:10',
      significado: 'O medo é uma das emoções mais paralisantes. Este versículo foi escrito para um povo que estava em exílio, longe de casa, cheio de incertezas. A mensagem é clara: o medo é natural, mas não precisa de te controlar. Há uma presença maior contigo, mesmo quando te sentes sozinho.',
      aplicacao: 'O medo é natural, mas não precisa de te paralisar. Hoje, age apesar do medo. Não estás sozinho. Escreve três coisas que te assustam agora. Depois, para cada uma, escreve um pequeno passo que podes dar hoje, mesmo com medo.'
    },
    {
      texto: '"Tudo tem o seu tempo determinado, e há tempo para todo propósito debaixo do céu."',
      referencia: 'Eclesiastes 3:1',
      significado: 'Vivemos numa cultura de imediatismo, onde tudo tem de acontecer agora. Este versículo lembra-nos que a vida tem ritmos e estações. Há tempo para plantar e tempo para colher. Há tempo para construir e tempo para descansar. Respeitar esses tempos é sabedoria.',
      aplicacao: 'Se algo não está a acontecer agora, não significa que não vai acontecer. Respeita o timing. Confia no processo. Hoje, identifica algo que estás a forçar. Pergunta-te: será que este é o momento certo? Se não for, o que podes fazer para te preparar para quando for?'
    }
  ];

  return {
    versiculo: versiculos[dayOfYear % versiculos.length]
  };
};

export default function BibliaView() {
  const isPremium = false;
  const conteudo = getConteudoBiblico();
  const [viewMode, setViewMode] = useState<'main' | 'temas' | 'tema-detalhe'>('main');
  const [temaSelecionado, setTemaSelecionado] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<Set<string>>(new Set());

  // Obter userId ao carregar
  useEffect(() => {
    const getUserId = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUserId(session.user.id);
          }
        } catch {
          const offlineSession = offlineAuth.getSession();
          if (offlineSession.user) {
            setUserId(offlineSession.user.id);
          }
        }
      } else {
        const offlineSession = offlineAuth.getSession();
        if (offlineSession.user) {
          setUserId(offlineSession.user.id);
        }
      }
    };
    getUserId();
  }, []);

  // Função para guardar oração
  const handleSavePrayer = async (content: string, reference?: string) => {
    if (!userId) return;
    
    const prayerText = reference ? `${content} - ${reference}` : content;
    const success = await savePrayer(userId, prayerText);
    
    if (success) {
      setSavedPrayers(prev => new Set(prev).add(prayerText));
      alert('Oração guardada com sucesso! ✨');
    }
  };
  const [userId, setUserId] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<Set<string>>(new Set());

  // Obter userId ao carregar
  useEffect(() => {
    const getUserId = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUserId(session.user.id);
          }
        } catch {
          const offlineSession = offlineAuth.getSession();
          if (offlineSession.user) {
            setUserId(offlineSession.user.id);
          }
        }
      } else {
        const offlineSession = offlineAuth.getSession();
        if (offlineSession.user) {
          setUserId(offlineSession.user.id);
        }
      }
    };
    getUserId();
  }, []);

  // Função para guardar oração
  const handleSavePrayer = async (content: string, reference?: string) => {
    if (!userId) return;
    
    const prayerText = reference ? `${content} - ${reference}` : content;
    const success = await savePrayer(userId, prayerText);
    
    if (success) {
      setSavedPrayers(prev => new Set(prev).add(prayerText));
      alert('Oração guardada com sucesso! ✨');
    }
  };
  const [userId, setUserId] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<Set<string>>(new Set());

  // Obter userId ao carregar
  useEffect(() => {
    const getUserId = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUserId(session.user.id);
          }
        } catch {
          const offlineSession = offlineAuth.getSession();
          if (offlineSession.user) {
            setUserId(offlineSession.user.id);
          }
        }
      } else {
        const offlineSession = offlineAuth.getSession();
        if (offlineSession.user) {
          setUserId(offlineSession.user.id);
        }
      }
    };
    getUserId();
  }, []);

  // Função para guardar oração
  const handleSavePrayer = async (content: string, reference?: string) => {
    if (!userId) return;
    
    const prayerText = reference ? `${content} - ${reference}` : content;
    const success = await savePrayer(userId, prayerText);
    
    if (success) {
      setSavedPrayers(prev => new Set(prev).add(prayerText));
      alert('Oração guardada com sucesso! ✨');
    }
  };
  const [userId, setUserId] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<Set<string>>(new Set());

  // Obter userId ao carregar
  useEffect(() => {
    const getUserId = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUserId(session.user.id);
          }
        } catch {
          const offlineSession = offlineAuth.getSession();
          if (offlineSession.user) {
            setUserId(offlineSession.user.id);
          }
        }
      } else {
        const offlineSession = offlineAuth.getSession();
        if (offlineSession.user) {
          setUserId(offlineSession.user.id);
        }
      }
    };
    getUserId();
  }, []);

  // Função para guardar oração
  const handleSavePrayer = async (content: string, reference?: string) => {
    if (!userId) return;
    
    const prayerText = reference ? `${content} - ${reference}` : content;
    const success = await savePrayer(userId, prayerText);
    
    if (success) {
      setSavedPrayers(prev => new Set(prev).add(prayerText));
      alert('Oração guardada com sucesso! ✨');
    }
  };
  const [userId, setUserId] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<Set<string>>(new Set());

  // Obter userId ao carregar
  useEffect(() => {
    const getUserId = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUserId(session.user.id);
          }
        } catch {
          const offlineSession = offlineAuth.getSession();
          if (offlineSession.user) {
            setUserId(offlineSession.user.id);
          }
        }
      } else {
        const offlineSession = offlineAuth.getSession();
        if (offlineSession.user) {
          setUserId(offlineSession.user.id);
        }
      }
    };
    getUserId();
  }, []);

  // Função para guardar oração
  const handleSavePrayer = async (content: string, reference?: string) => {
    if (!userId) return;
    
    const prayerText = reference ? `${content} - ${reference}` : content;
    const success = await savePrayer(userId, prayerText);
    
    if (success) {
      setSavedPrayers(prev => new Set(prev).add(prayerText));
      alert('Oração guardada com sucesso! ✨');
    }
  };
  const [userId, setUserId] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<Set<string>>(new Set());

  // Obter userId ao carregar
  useEffect(() => {
    const getUserId = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUserId(session.user.id);
          }
        } catch {
          const offlineSession = offlineAuth.getSession();
          if (offlineSession.user) {
            setUserId(offlineSession.user.id);
          }
        }
      } else {
        const offlineSession = offlineAuth.getSession();
        if (offlineSession.user) {
          setUserId(offlineSession.user.id);
        }
      }
    };
    getUserId();
  }, []);

  // Função para guardar oração
  const handleSavePrayer = async (content: string, reference?: string) => {
    if (!userId) return;
    
    const prayerText = reference ? `${content} - ${reference}` : content;
    const success = await savePrayer(userId, prayerText);
    
    if (success) {
      setSavedPrayers(prev => new Set(prev).add(prayerText));
      alert('Oração guardada com sucesso! ✨');
    }
  };
  const [userId, setUserId] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<Set<string>>(new Set());

  // Obter userId ao carregar
  useEffect(() => {
    const getUserId = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUserId(session.user.id);
          }
        } catch {
          const offlineSession = offlineAuth.getSession();
          if (offlineSession.user) {
            setUserId(offlineSession.user.id);
          }
        }
      } else {
        const offlineSession = offlineAuth.getSession();
        if (offlineSession.user) {
          setUserId(offlineSession.user.id);
        }
      }
    };
    getUserId();
  }, []);

  // Função para guardar oração
  const handleSavePrayer = async (content: string, reference?: string) => {
    if (!userId) return;
    
    const prayerText = reference ? `${content} - ${reference}` : content;
    const success = await savePrayer(userId, prayerText);
    
    if (success) {
      setSavedPrayers(prev => new Set(prev).add(prayerText));
      alert('Oração guardada com sucesso! ✨');
    }
  };
  const [userId, setUserId] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<Set<string>>(new Set());

  // Obter userId ao carregar
  useEffect(() => {
    const getUserId = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUserId(session.user.id);
          }
        } catch {
          const offlineSession = offlineAuth.getSession();
          if (offlineSession.user) {
            setUserId(offlineSession.user.id);
          }
        }
      } else {
        const offlineSession = offlineAuth.getSession();
        if (offlineSession.user) {
          setUserId(offlineSession.user.id);
        }
      }
    };
    getUserId();
  }, []);

  // Função para guardar oração
  const handleSavePrayer = async (content: string, reference?: string) => {
    if (!userId) return;
    
    const prayerText = reference ? `${content} - ${reference}` : content;
    const success = await savePrayer(userId, prayerText);
    
    if (success) {
      setSavedPrayers(prev => new Set(prev).add(prayerText));
      alert('Oração guardada com sucesso! ✨');
    }
  };
  const [userId, setUserId] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<Set<string>>(new Set());

  // Obter userId ao carregar
  useEffect(() => {
    const getUserId = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUserId(session.user.id);
          }
        } catch {
          const offlineSession = offlineAuth.getSession();
          if (offlineSession.user) {
            setUserId(offlineSession.user.id);
          }
        }
      } else {
        const offlineSession = offlineAuth.getSession();
        if (offlineSession.user) {
          setUserId(offlineSession.user.id);
        }
      }
    };
    getUserId();
  }, []);

  // Função para guardar oração
  const handleSavePrayer = async (content: string, reference?: string) => {
    if (!userId) return;
    
    const prayerText = reference ? `${content} - ${reference}` : content;
    const success = await savePrayer(userId, prayerText);
    
    if (success) {
      setSavedPrayers(prev => new Set(prev).add(prayerText));
      alert('Oração guardada com sucesso! ✨');
    }
  };
  const [userId, setUserId] = useState<string | null>(null);
  const [savedPrayers, setSavedPrayers] = useState<Set<string>>(new Set());

  // Obter userId ao carregar
  useEffect(() => {
    const getUserId = async () => {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUserId(session.user.id);
          }
        } catch {
          const offlineSession = offlineAuth.getSession();
          if (offlineSession.user) {
            setUserId(offlineSession.user.id);
          }
        }
      } else {
        const offlineSession = offlineAuth.getSession();
        if (offlineSession.user) {
          setUserId(offlineSession.user.id);
        }
      }
    };
    getUserId();
  }, []);

  // Função para guardar oração
  const handleSavePrayer = async (content: string, reference?: string) => {
    if (!userId) return;
    
    const prayerText = reference ? `${content} - ${reference}` : content;
    const success = await savePrayer(userId, prayerText);
    
    if (success) {
      setSavedPrayers(prev => new Set(prev).add(prayerText));
      alert('Oração guardada com sucesso! ✨');
    }
  };

  const handlePremiumClick = () => {
    window.open(CHECKOUT_URL, '_blank');
  };

  // Pré-visualização: primeiras 1-2 linhas
  const getPreview = (text: string) => {
    const sentences = text.split('. ');
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '');
  };

  const isTemaGratuito = (tema: string) => TEMAS_GRATUITOS.includes(tema);

  const renderTemaDetalhe = () => {
    if (!temaSelecionado) return null;
    
    const tema = CONTEUDO_TEMAS[temaSelecionado];
    const isGratuito = isTemaGratuito(temaSelecionado);
    
    return (
      <div className="max-w-4xl mx-auto pb-20 md:pb-8">
        {/* Botão Voltar */}
        <button
          onClick={() => {
            setTemaSelecionado(null);
            setViewMode('temas');
          }}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Voltar aos temas</span>
        </button>

        {/* Header do Tema */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              {temaSelecionado}
            </h1>
            {!isGratuito && (
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold rounded-full">
                Premium
              </span>
            )}
          </div>
          <p className="text-gray-600 text-base md:text-lg">
            {tema.introducao}
          </p>
        </div>

        {/* Versículos */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 md:p-8 shadow-lg mb-6 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Versículos</h2>
          </div>
          
          {/* Para temas gratuitos: mostrar todos os versículos */}
          {isGratuito && tema.versiculos.map((v, idx) => (
            <div key={idx} className={idx > 0 ? 'mt-6 pt-6 border-t border-purple-200' : ''}>
              <p className="text-gray-800 text-base md:text-lg leading-relaxed italic mb-3">
                {v.texto}
              </p>
              <p className="text-purple-600 font-semibold">
                {v.referencia}
              </p>
            </div>
          ))}

          {/* Para temas premium: mostrar apenas 1 versículo */}
          {!isGratuito && !isPremium && (
            <div>
              <p className="text-gray-800 text-base md:text-lg leading-relaxed italic mb-3">
                {tema.versiculos[0].texto}
              </p>
              <p className="text-purple-600 font-semibold">
                {tema.versiculos[0].referencia}
              </p>
            </div>
          )}

          {/* Para usuários premium: mostrar todos */}
          {!isGratuito && isPremium && tema.versiculos.map((v, idx) => (
            <div key={idx} className={idx > 0 ? 'mt-6 pt-6 border-t border-purple-200' : ''}>
              <p className="text-gray-800 text-base md:text-lg leading-relaxed italic mb-3">
                {v.texto}
              </p>
              <p className="text-purple-600 font-semibold">
                {v.referencia}
              </p>
            </div>
          ))}
        </div>

        {/* Explicação */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">O que isto significa</h2>
          </div>
          
          {/* Para temas gratuitos: mostrar explicação completa */}
          {isGratuito && (
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {tema.explicacao}
            </p>
          )}

          {/* Para temas premium (usuários free): mostrar preview + paywall */}
          {!isGratuito && !isPremium && (
            <>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                {getPreview(tema.explicacao)}
              </p>
              
              <button
                onClick={handlePremiumClick}
                className="w-full bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200 hover:border-purple-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed text-left">
                    Este tema aprofunda a Palavra e ajuda a aplicá-la à tua vida diária.
                  </p>
                  <Lock className="w-5 h-5 text-purple-500 flex-shrink-0 ml-3 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-600 font-semibold text-sm md:text-base">
                    Continua com SoulRise Premium
                  </span>
                  <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </>
          )}

          {/* Para usuários premium: mostrar explicação completa */}
          {!isGratuito && isPremium && (
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {tema.explicacao}
            </p>
          )}
        </div>

        {/* Aplicação Prática */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Como aplicar hoje</h2>
          </div>
          
          {/* Para temas gratuitos: mostrar aplicação completa */}
          {isGratuito && (
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {tema.aplicacao}
            </p>
          )}

          {/* Para temas premium: já está bloqueado na explicação, então não mostrar nada aqui para free */}
          {!isGratuito && !isPremium && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <p className="text-gray-700 text-sm md:text-base">
                  Conteúdo disponível no SoulRise Premium
                </p>
              </div>
            </div>
          )}

          {/* Para usuários premium: mostrar aplicação completa */}
          {!isGratuito && isPremium && (
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              {tema.aplicacao}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderListaTemas = () => (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8">
      {/* Botão Voltar */}
      <button
        onClick={() => setViewMode('main')}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Voltar</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Procurar Versículos por Tema
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Escolhe um tema que fala ao teu coração neste momento. Vais encontrar versículos que trazem luz, conforto e orientação prática para a tua vida.
        </p>
      </div>

      {/* Lista de Temas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TODOS_TEMAS.map((tema) => {
          const isGratuito = isTemaGratuito(tema);
          return (
            <button
              key={tema}
              onClick={() => {
                setTemaSelecionado(tema);
                setViewMode('tema-detalhe');
              }}
              className="bg-white rounded-xl p-5 shadow-lg border-2 border-gray-200 hover:border-purple-300 transition-all group text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                  {tema}
                </h3>
                {!isGratuito && (
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-semibold rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3">
                {CONTEUDO_TEMAS[tema].introducao.substring(0, 80)}...
              </p>
              <div className="flex items-center justify-between">
                <span className="text-purple-600 font-semibold text-sm">
                  Ver versículos
                </span>
                <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderMainView = () => (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Bíblia 📖
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Palavra viva aplicada à vida diária
        </p>
      </div>

      {/* Versículo do Dia - FREE (sempre acessível) */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 md:p-8 shadow-lg mb-6 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Versículo do Dia</h2>
        </div>
        <p className="text-gray-800 text-lg md:text-xl leading-relaxed italic mb-4">
          {conteudo.versiculo.texto}
        </p>
        <p className="text-purple-600 font-semibold">
          {conteudo.versiculo.referencia}
        </p>
      </div>

      {/* O que significa este versículo - PREMIUM com preview */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">O que significa este versículo</h2>
        </div>
        
        {/* Pré-visualização (1-2 linhas) */}
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
          {getPreview(conteudo.versiculo.significado)}
        </p>

        {/* Paywall suave */}
        {!isPremium && (
          <button
            onClick={handlePremiumClick}
            className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200 hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed text-left">
                Este conteúdo ajuda a compreender e aplicar a Palavra no dia a dia.
              </p>
              <Lock className="w-5 h-5 text-blue-500 flex-shrink-0 ml-3 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 font-semibold text-sm md:text-base">
                Disponível no SoulRise Premium
              </span>
              <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        )}

        {/* Conteúdo completo para Premium */}
        {isPremium && (
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            {conteudo.versiculo.significado}
          </p>
        )}
      </div>

      {/* Como aplicar este versículo hoje - PREMIUM com preview */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Como aplicar este versículo hoje</h2>
        </div>
        
        {/* Pré-visualização (1-2 linhas) */}
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
          {getPreview(conteudo.versiculo.aplicacao)}
        </p>

        {/* Paywall suave */}
        {!isPremium && (
          <button
            onClick={handlePremiumClick}
            className="w-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 hover:border-green-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed text-left">
                Este conteúdo ajuda a compreender e aplicar a Palavra no dia a dia.
              </p>
              <Lock className="w-5 h-5 text-green-500 flex-shrink-0 ml-3 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-600 font-semibold text-sm md:text-base">
                Disponível no SoulRise Premium
              </span>
              <ChevronRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        )}

        {/* Conteúdo completo para Premium */}
        {isPremium && (
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            {conteudo.versiculo.aplicacao}
          </p>
        )}
      </div>

      {/* Botão para Procurar Versículos por Tema */}
      <button
        onClick={() => setViewMode('temas')}
        className="w-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              Procurar Versículos por Tema
            </h3>
            <p className="text-purple-100 text-sm md:text-base">
              Encontra versículos sobre ansiedade, medo, propósito, fé e muito mais
            </p>
          </div>
          <ChevronRight className="w-8 h-8 flex-shrink-0 ml-4 group-hover:translate-x-2 transition-transform" />
        </div>
      </button>
    </div>
  );

  if (viewMode === 'tema-detalhe') {
    return renderTemaDetalhe();
  }

  if (viewMode === 'temas') {
    return renderListaTemas();
  }

  return renderMainView();
}
