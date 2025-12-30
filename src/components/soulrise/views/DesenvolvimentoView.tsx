'use client';

import { useState, useRef } from 'react';
import { 
  Target, 
  Zap, 
  Repeat, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Circle,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Calendar,
  TrendingUp,
  X,
  Book
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import LivrosEssenciaisView from './LivrosEssenciaisView';

// Tipos
interface Habito {
  id: string;
  titulo: string;
  descricao: string;
  frequencia: string;
}

interface GuiaDesenvolvimento {
  id: string;
  titulo: string;
  descricao: string;
  conteudo: string;
  aplicacao: string;
}

interface ExplicacaoPlano {
  titulo: string;
  explicacao: string;
  porqueImporta: string;
  comoFazer: string;
}

// Dados do Plano do Dia (atualizados diariamente)
const getPlanoDoDia = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  
  const intencoes = [
    'Cultivar clareza mental em cada decisão',
    'Agir com propósito e presença',
    'Manter consistência nas pequenas ações',
    'Praticar autocompaixão e paciência',
    'Focar no essencial, eliminar o supérfluo',
    'Honrar meus compromissos comigo mesmo',
    'Transformar desconforto em crescimento'
  ];

  const acoesPrincipais = [
    'Dedica 15 minutos à tua prioridade máxima do dia',
    'Completa uma tarefa que tens adiado',
    'Pratica 10 minutos de reflexão ou escrita',
    'Faz uma pausa consciente a cada 2 horas',
    'Revê os teus objetivos da semana',
    'Elimina uma distração do teu ambiente',
    'Pratica gratidão por 3 conquistas recentes'
  ];

  const acoesComplementares = [
    'Lê 10 páginas de um livro inspirador',
    'Organiza o teu espaço de trabalho',
    'Faz uma caminhada de 15 minutos',
    'Escreve 3 coisas pelas quais és grato',
    'Revê o teu progresso semanal',
    'Pratica 5 minutos de respiração consciente',
    'Planeia o dia seguinte com intenção'
  ];

  const rituaisMentais = [
    'Respira fundo 3 vezes. Pergunta: "O que realmente importa agora?"',
    'Fecha os olhos. Visualiza-te a completar o dia com sucesso.',
    'Repete mentalmente: "Eu escolho clareza. Eu escolho ação."',
    'Pausa de 2 minutos: observa os teus pensamentos sem julgamento.',
    'Pergunta-te: "Estou a agir ou a reagir?" Ajusta se necessário.',
    'Momento de gratidão: reconhece 3 coisas boas do teu dia.',
    'Visualiza o teu "eu futuro" orgulhoso das escolhas de hoje.'
  ];

  return {
    intencao: intencoes[dayOfYear % intencoes.length],
    acaoPrincipal: acoesPrincipais[dayOfYear % acoesPrincipais.length],
    acaoComplementar: acoesComplementares[dayOfYear % acoesComplementares.length],
    ritualMental: rituaisMentais[dayOfYear % rituaisMentais.length]
  };
};

// Explicações detalhadas para cada tipo de ação do plano
const getExplicacaoIntencao = (intencao: string): ExplicacaoPlano => {
  const explicacoes: Record<string, ExplicacaoPlano> = {
    'Cultivar clareza mental em cada decisão': {
      titulo: 'Clareza Mental',
      explicacao: 'Clareza mental significa tomar decisões conscientes, sem ruído mental ou distrações. É sobre saber o que realmente importa e agir de acordo com isso.',
      porqueImporta: 'Quando tens clareza, eliminas indecisão, ansiedade e procrastinação. Cada escolha torna-se mais fácil porque sabes o que queres e porquê.',
      comoFazer: 'Antes de cada decisão importante hoje, para 30 segundos. Respira fundo e pergunta: "Esta escolha está alinhada com o que realmente importa para mim?" Se sim, age. Se não, recusa.'
    },
    'Agir com propósito e presença': {
      titulo: 'Propósito e Presença',
      explicacao: 'Agir com propósito significa fazer cada ação com intenção clara. Presença significa estar totalmente focado no momento, sem dispersão mental.',
      porqueImporta: 'Quando ages com propósito e presença, cada momento ganha significado. Deixas de viver no piloto automático e começas a viver conscientemente.',
      comoFazer: 'Hoje, antes de iniciar qualquer tarefa, define a intenção: "Vou fazer isto porque..." Durante a tarefa, sempre que a mente dispersar, traz-te de volta ao momento presente.'
    },
    'Manter consistência nas pequenas ações': {
      titulo: 'Consistência',
      explicacao: 'Consistência é fazer as pequenas ações todos os dias, mesmo quando não te apetece. É o hábito de aparecer, independentemente de como te sentes.',
      porqueImporta: 'Transformação não vem de ações heroicas ocasionais, mas de pequenas ações repetidas. 1% melhor todos os dias = 37x melhor em um ano.',
      comoFazer: 'Identifica UMA pequena ação que podes fazer hoje (ex: 10 minutos de leitura, 5 minutos de meditação). Faz-a, não importa o quê. Marca no calendário. Repete amanhã.'
    },
    'Praticar autocompaixão e paciência': {
      titulo: 'Autocompaixão',
      explicacao: 'Autocompaixão é tratar-te com a mesma gentileza que tratarias um bom amigo. Paciência é aceitar que crescimento leva tempo.',
      porqueImporta: 'Quando és duro contigo, crias resistência interna. Autocompaixão liberta energia para crescer. Paciência evita desistência prematura.',
      comoFazer: 'Quando errares ou falhares hoje, em vez de te criticares, diz: "Está tudo bem. Sou humano. O que posso aprender disto?" Trata-te como tratarias alguém que amas.'
    },
    'Focar no essencial, eliminar o supérfluo': {
      titulo: 'Essencialismo',
      explicacao: 'Essencialismo é a disciplina de fazer menos, mas melhor. É identificar o que realmente importa e eliminar o resto.',
      porqueImporta: 'Vivemos sobrecarregados. Quando eliminas o supérfluo, ganhas tempo, energia e clareza para o que realmente importa.',
      comoFazer: 'Hoje, identifica 3 coisas que estás a fazer por obrigação ou hábito, mas que não te servem. Elimina ou delega uma delas. Usa o tempo ganho no que realmente importa.'
    },
    'Honrar meus compromissos comigo mesmo': {
      titulo: 'Integridade Pessoal',
      explicacao: 'Honrar compromissos contigo é fazer o que dizes que vais fazer. É construir confiança interna através da ação consistente.',
      porqueImporta: 'Cada vez que quebras um compromisso contigo, enfraqueces a tua autoconfiança. Cada vez que honras, fortalezes-a. Autoconfiança vem de provas repetidas.',
      comoFazer: 'Hoje, faz UMA promessa pequena a ti mesmo (ex: "Vou beber 2L de água"). Não importa quão pequena. Cumpre-a. Celebra. Repete amanhã com outra.'
    },
    'Transformar desconforto em crescimento': {
      titulo: 'Crescimento pelo Desconforto',
      explicacao: 'Desconforto não é o inimigo. É o sinal de que estás a crescer. Zona de conforto = zona de estagnação. Crescimento acontece fora dela.',
      porqueImporta: 'Evitar desconforto mantém-te preso. Abraçar desconforto expande os teus limites. Cada vez que ages apesar do medo, tornas-te mais forte.',
      comoFazer: 'Hoje, identifica UMA coisa que te causa desconforto mas que sabes que te faria crescer (ex: fazer aquela chamada difícil). Faz-a. Observa como te sentes depois.'
    }
  };

  return explicacoes[intencao] || {
    titulo: 'Intenção do Dia',
    explicacao: 'Esta é a tua intenção para hoje - um princípio orientador para as tuas ações.',
    porqueImporta: 'Ter uma intenção clara dá direção ao teu dia e ajuda-te a tomar melhores decisões.',
    comoFazer: 'Mantém esta intenção em mente ao longo do dia e deixa-a guiar as tuas escolhas.'
  };
};

const getExplicacaoAcaoPrincipal = (acao: string): ExplicacaoPlano => {
  const explicacoes: Record<string, ExplicacaoPlano> = {
    'Dedica 15 minutos à tua prioridade máxima do dia': {
      titulo: 'Prioridade Máxima',
      explicacao: 'A tua prioridade máxima é aquela tarefa que, se completada, faria o maior impacto no teu dia. É o teu "one thing" - a coisa mais importante.',
      porqueImporta: 'A maioria das pessoas passa o dia ocupada, mas não produtiva. Focar na prioridade máxima garante que, mesmo num dia caótico, fizeste o que realmente importa.',
      comoFazer: 'Agora mesmo, identifica: qual é a UMA tarefa que, se completada hoje, faria a maior diferença? Dedica os próximos 15 minutos APENAS a isso. Sem telemóvel, sem distrações.'
    },
    'Completa uma tarefa que tens adiado': {
      titulo: 'Vencer a Procrastinação',
      explicacao: 'Tarefas adiadas criam peso mental. Cada vez que as vês na lista, drenam energia. Completá-las liberta espaço mental e energia.',
      porqueImporta: 'Procrastinação não é preguiça - é medo disfarçado. Completar tarefas adiadas constrói momentum e autoconfiança. Cada tarefa completada torna a próxima mais fácil.',
      comoFazer: 'Escolhe a tarefa que tens adiado há mais tempo. Não precisa ser perfeita. Dedica 15 minutos a ela AGORA. Ação imperfeita > planeamento perfeito.'
    },
    'Pratica 10 minutos de reflexão ou escrita': {
      titulo: 'Reflexão Consciente',
      explicacao: 'Reflexão é o processo de parar, observar os teus pensamentos e ganhar perspectiva. Escrita torna os pensamentos tangíveis e claros.',
      porqueImporta: 'Vivemos em modo reativo constante. Reflexão permite-te sair do piloto automático, processar emoções e ganhar clareza sobre o que realmente importa.',
      comoFazer: 'Pega num papel ou abre um documento. Define timer de 10 minutos. Escreve livremente sobre: "Como me sinto agora? O que preciso? O que posso fazer?" Sem filtro, sem julgamento.'
    },
    'Faz uma pausa consciente a cada 2 horas': {
      titulo: 'Pausas Conscientes',
      explicacao: 'Pausa consciente não é scroll no telemóvel. É parar completamente, respirar e reconectar contigo. É reset mental intencional.',
      porqueImporta: 'Trabalhar sem pausas esgota-te mental e fisicamente. Pausas conscientes restauram energia, melhoram foco e previnem burnout.',
      comoFazer: 'A cada 2 horas, para tudo. Levanta-te. Respira fundo 5 vezes. Estica o corpo. Bebe água. Olha pela janela. 2-3 minutos. Depois volta com energia renovada.'
    },
    'Revê os teus objetivos da semana': {
      titulo: 'Revisão de Objetivos',
      explicacao: 'Objetivos sem revisão tornam-se esquecidos. Revisão regular mantém-te alinhado, ajusta o rumo e celebra progresso.',
      porqueImporta: 'É fácil perder-se no dia-a-dia e esquecer o que realmente importa. Revisão semanal garante que estás a caminhar na direção certa.',
      comoFazer: 'Dedica 15 minutos agora: 1) Revê os objetivos que definiste para esta semana. 2) O que já fizeste? Celebra. 3) O que falta? Ajusta o plano. 4) Próximos passos claros.'
    },
    'Elimina uma distração do teu ambiente': {
      titulo: 'Ambiente Focado',
      explicacao: 'O teu ambiente molda o teu comportamento. Distrações no ambiente = distrações na mente. Ambiente limpo = mente clara.',
      porqueImporta: 'Força de vontade é limitada. É mais fácil remover tentações do ambiente do que resistir a elas constantemente. Design o teu ambiente para o sucesso.',
      comoFazer: 'Olha à tua volta AGORA. Identifica UMA distração (telemóvel à vista, notificações ativas, ambiente desorganizado). Elimina-a. Cria fricção entre ti e a distração.'
    },
    'Pratica gratidão por 3 conquistas recentes': {
      titulo: 'Gratidão Ativa',
      explicacao: 'Gratidão não é só agradecer. É reconhecer ativamente o que está a correr bem, mesmo nas pequenas coisas. É treinar a mente para ver o positivo.',
      porqueImporta: 'O cérebro tem viés negativo - foca naturalmente no que está errado. Gratidão consciente reequilibra, melhora humor e aumenta motivação.',
      comoFazer: 'Agora, pensa em 3 coisas que conseguiste recentemente (podem ser pequenas: acordar cedo, fazer exercício, ter uma boa conversa). Sente genuinamente a gratidão por cada uma.'
    }
  };

  return explicacoes[acao] || {
    titulo: 'Ação Principal',
    explicacao: 'Esta é a ação mais importante que deves fazer hoje para avançar nos teus objetivos.',
    porqueImporta: 'Completar esta ação garante que fizeste progresso real hoje, independentemente do resto.',
    comoFazer: 'Dedica tempo focado a esta ação. Elimina distrações e dá-lhe a tua melhor energia.'
  };
};

const getExplicacaoAcaoComplementar = (acao: string): ExplicacaoPlano => {
  const explicacoes: Record<string, ExplicacaoPlano> = {
    'Lê 10 páginas de um livro inspirador': {
      titulo: 'Leitura Intencional',
      explicacao: 'Leitura não é entretenimento passivo. É investimento em ti. 10 páginas por dia = 12-15 livros por ano. Conhecimento composto.',
      porqueImporta: 'Líderes são leitores. Cada livro expande a tua perspectiva, dá-te ferramentas novas e conecta-te com mentes brilhantes.',
      comoFazer: 'Escolhe um livro que te inspire ou ensine algo útil. Define timer de 15 minutos. Lê com atenção. Sublinha o que ressoa. Aplica uma ideia hoje.'
    },
    'Organiza o teu espaço de trabalho': {
      titulo: 'Espaço Organizado',
      explicacao: 'Espaço físico reflete e influencia o espaço mental. Ambiente caótico = mente caótica. Ambiente organizado = mente clara.',
      porqueImporta: 'Cada objeto fora do lugar é uma micro-distração. Organizar o espaço liberta energia mental e melhora foco.',
      comoFazer: 'Dedica 10 minutos: remove tudo que não precisas à vista. Deixa apenas o essencial. Limpa superfícies. Cria um espaço que te inspire a trabalhar.'
    },
    'Faz uma caminhada de 15 minutos': {
      titulo: 'Movimento Consciente',
      explicacao: 'Caminhada não é só exercício físico. É reset mental, processamento de ideias e conexão com o corpo.',
      porqueImporta: 'Estar sentado o dia todo esgota-te mental e fisicamente. Movimento restaura energia, melhora humor e clarifica pensamentos.',
      comoFazer: 'Sai agora. Sem telemóvel ou com modo avião. Caminha 15 minutos. Observa o ambiente. Respira fundo. Deixa a mente vaguear. Volta renovado.'
    },
    'Escreve 3 coisas pelas quais és grato': {
      titulo: 'Prática de Gratidão',
      explicacao: 'Gratidão é o antídoto para ansiedade e insatisfação. É treinar a mente para ver abundância em vez de escassez.',
      porqueImporta: 'O que focar cresce. Focar no que está errado = mais negatividade. Focar no que está bem = mais positividade e motivação.',
      comoFazer: 'Pega num papel. Escreve 3 coisas específicas pelas quais és grato hoje. Podem ser pequenas: "café quente", "conversa boa", "sol na janela". Sente a gratidão.'
    },
    'Revê o teu progresso semanal': {
      titulo: 'Revisão de Progresso',
      explicacao: 'Progresso sem reconhecimento é invisível. Revisão torna o progresso tangível, celebra vitórias e ajusta o rumo.',
      porqueImporta: 'É fácil sentir que não estás a avançar. Revisão mostra-te o quanto já fizeste, motiva-te e dá clareza sobre próximos passos.',
      comoFazer: 'Dedica 15 minutos: 1) O que fizeste bem esta semana? Celebra. 2) O que não correu como esperado? Aprende. 3) O que vais fazer diferente na próxima semana?'
    },
    'Pratica 5 minutos de respiração consciente': {
      titulo: 'Respiração Consciente',
      explicacao: 'Respiração é a ponte entre corpo e mente. Respiração consciente acalma o sistema nervoso, reduz ansiedade e aumenta clareza.',
      porqueImporta: 'Vivemos em estado de stress constante. 5 minutos de respiração consciente resetam o sistema nervoso e restauram equilíbrio.',
      comoFazer: 'Senta-te confortavelmente. Fecha os olhos. Respira fundo pelo nariz (4 segundos), segura (4 segundos), solta pela boca (6 segundos). Repete 10 vezes. Observa como te sentes.'
    },
    'Planeia o dia seguinte com intenção': {
      titulo: 'Planeamento Intencional',
      explicacao: 'Planear o dia seguinte à noite elimina decisões pela manhã. Acordas sabendo exatamente o que fazer. Menos fricção = mais ação.',
      porqueImporta: 'Dias sem plano tornam-se reativos. Planeamento intencional garante que ages de acordo com as tuas prioridades, não com urgências.',
      comoFazer: 'Antes de dormir: 1) Qual é a prioridade máxima de amanhã? 2) Que 3 tarefas vou completar? 3) Quando vou fazê-las? Escreve. Acorda e executa.'
    }
  };

  return explicacoes[acao] || {
    titulo: 'Ação Complementar',
    explicacao: 'Esta ação complementa o teu desenvolvimento e reforça hábitos positivos.',
    porqueImporta: 'Embora opcional, esta ação adiciona valor ao teu dia e contribui para o teu crescimento contínuo.',
    comoFazer: 'Se tiveres tempo e energia, dedica alguns minutos a esta ação. Cada pequeno passo conta.'
  };
};

const getExplicacaoRitualMental = (ritual: string): ExplicacaoPlano => {
  const explicacoes: Record<string, ExplicacaoPlano> = {
    'Respira fundo 3 vezes. Pergunta: "O que realmente importa agora?"': {
      titulo: 'Clareza no Momento',
      explicacao: 'Este ritual traz-te de volta ao presente e ajuda-te a distinguir urgente de importante. É um reset mental rápido.',
      porqueImporta: 'É fácil perder-se em tarefas urgentes mas não importantes. Esta pergunta reconecta-te com as tuas prioridades reais.',
      comoFazer: 'Sempre que te sentires disperso ou sobrecarregado: para, respira fundo 3 vezes, pergunta "O que realmente importa agora?" e age de acordo com a resposta.'
    },
    'Fecha os olhos. Visualiza-te a completar o dia com sucesso.': {
      titulo: 'Visualização de Sucesso',
      explicacao: 'Visualização não é fantasia. É programação mental. O cérebro não distingue bem entre experiência real e vividamente imaginada.',
      porqueImporta: 'Atletas de elite usam visualização para melhorar performance. Visualizar sucesso aumenta confiança e clarifica os passos necessários.',
      comoFazer: 'Fecha os olhos. Vê-te a completar as tarefas do dia com sucesso. Sente a satisfação. Vê os detalhes. Abre os olhos e age para tornar a visualização real.'
    },
    'Repete mentalmente: "Eu escolho clareza. Eu escolho ação."': {
      titulo: 'Afirmação de Poder',
      explicacao: 'Afirmações não são pensamento positivo vazio. São lembretes de que tens poder de escolha. És agente, não vítima.',
      porqueImporta: 'A linguagem que usas contigo molda a tua realidade. "Eu escolho" é empoderador. "Eu tenho que" é vitimizante.',
      comoFazer: 'Quando te sentires preso ou sem controlo, repete mentalmente (ou em voz alta): "Eu escolho clareza. Eu escolho ação." Depois, age de acordo.'
    },
    'Pausa de 2 minutos: observa os teus pensamentos sem julgamento.': {
      titulo: 'Mindfulness Rápido',
      explicacao: 'Mindfulness é observar pensamentos sem se identificar com eles. És o observador, não os pensamentos. Isto cria espaço mental.',
      porqueImporta: 'Pensamentos não são factos. Observá-los sem julgamento reduz ansiedade, aumenta clareza e dá-te poder de escolha sobre como responder.',
      comoFazer: 'Para 2 minutos. Senta-te. Observa os pensamentos que surgem como se fossem nuvens passando. Não os julgues, não os sigas. Apenas observa. Volta ao presente.'
    },
    'Pergunta-te: "Estou a agir ou a reagir?" Ajusta se necessário.': {
      titulo: 'Ação vs Reação',
      explicacao: 'Agir é escolha consciente alinhada com valores. Reagir é resposta automática a estímulos externos. Agir = poder. Reagir = piloto automático.',
      porqueImporta: 'A maioria das pessoas vive em modo reativo. Questionar-te sobre isto traz consciência e permite-te escolher a resposta em vez de reagir automaticamente.',
      comoFazer: 'Várias vezes ao dia, especialmente em momentos de stress, pergunta: "Estou a agir (escolha consciente) ou a reagir (automático)?" Se estás a reagir, para, respira e escolhe.'
    },
    'Momento de gratidão: reconhece 3 coisas boas do teu dia.': {
      titulo: 'Gratidão no Momento',
      explicacao: 'Gratidão em tempo real é mais poderosa que gratidão retrospectiva. É treinar a mente para ver o positivo enquanto acontece.',
      porqueImporta: 'O cérebro tem viés negativo. Gratidão consciente reequilibra, melhora humor instantaneamente e aumenta satisfação com a vida.',
      comoFazer: 'Agora mesmo, para e reconhece 3 coisas boas que já aconteceram hoje (podem ser pequenas: café bom, conversa agradável, tarefa completada). Sente a gratidão.'
    },
    'Visualiza o teu "eu futuro" orgulhoso das escolhas de hoje.': {
      titulo: 'Perspectiva Futura',
      explicacao: 'Esta técnica cria distância temporal e ajuda-te a tomar decisões melhores. O "eu futuro" tem perspectiva que o "eu presente" não tem.',
      porqueImporta: 'Decisões impulsivas focam no presente. Decisões sábias consideram o futuro. Visualizar o "eu futuro" ajuda-te a escolher o que realmente queres, não o que é fácil agora.',
      comoFazer: 'Antes de uma decisão importante, fecha os olhos. Visualiza-te daqui a 6 meses. Como te sentes sobre a escolha que fizeste hoje? Escolhe o que fará o "eu futuro" orgulhoso.'
    }
  };

  return explicacoes[ritual] || {
    titulo: 'Ritual Mental',
    explicacao: 'Este é um exercício mental rápido para te reconectar com o presente e as tuas intenções.',
    porqueImporta: 'Rituais mentais ajudam a manter foco, clareza e alinhamento ao longo do dia.',
    comoFazer: 'Pratica este ritual sempre que sentires necessidade de reset mental ou reconexão com as tuas prioridades.'
  };
};

// Foco da Semana (atualizado semanalmente)
const getFocoDaSemana = () => {
  const weekOfYear = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  
  const focos = [
    {
      tema: 'Disciplina',
      descricao: 'Esta semana, foca-te em manter consistência nas tuas ações diárias, mesmo quando não te apetecer.',
      conexao: 'Cada ação diária reforça a tua capacidade de te comprometeres contigo mesmo.'
    },
    {
      tema: 'Clareza',
      descricao: 'Esta semana, elimina o ruído mental. Foca no essencial e deixa ir o que não serve.',
      conexao: 'As tuas ações diárias devem refletir o que realmente importa para ti.'
    },
    {
      tema: 'Consistência',
      descricao: 'Esta semana, celebra os pequenos passos. Progresso é feito de ações repetidas.',
      conexao: 'Cada dia que cumpres o teu plano, fortalezes a tua identidade de pessoa consistente.'
    },
    {
      tema: 'Autoconfiança',
      descricao: 'Esta semana, confia nas tuas decisões. Age mesmo com dúvida.',
      conexao: 'Cada ação que tomas, mesmo imperfeita, constrói a tua autoconfiança.'
    },
    {
      tema: 'Foco',
      descricao: 'Esta semana, protege a tua atenção. Diz não ao que te dispersa.',
      conexao: 'As tuas ações diárias devem estar alinhadas com as tuas prioridades reais.'
    },
    {
      tema: 'Resiliência',
      descricao: 'Esta semana, abraça o desconforto. Crescimento acontece fora da zona de conforto.',
      conexao: 'Cada desafio que enfrentas fortalece a tua capacidade de superar obstáculos.'
    }
  ];

  return focos[weekOfYear % focos.length];
};

// Hábitos-chave
const habitosChave: Habito[] = [
  {
    id: 'habito-1',
    titulo: 'Planeamento Diário',
    descricao: 'Dedica 5 minutos todas as manhãs para definir as tuas prioridades',
    frequencia: 'Diário'
  },
  {
    id: 'habito-2',
    titulo: 'Reflexão Noturna',
    descricao: 'Antes de dormir, revê o dia: o que correu bem e o que podes melhorar',
    frequencia: 'Diário'
  },
  {
    id: 'habito-3',
    titulo: 'Movimento Consciente',
    descricao: 'Pratica 15-30 minutos de atividade física que gostes',
    frequencia: 'Diário'
  },
  {
    id: 'habito-4',
    titulo: 'Aprendizagem Contínua',
    descricao: 'Lê, ouve ou aprende algo novo durante 20 minutos',
    frequencia: 'Diário'
  },
  {
    id: 'habito-5',
    titulo: 'Revisão Semanal',
    descricao: 'Aos domingos, revê a semana e planeia a próxima com intenção',
    frequencia: 'Semanal'
  }
];

// Reflexões Guiadas
const getReflexaoDoDia = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  
  const reflexoes = [
    'O que é uma pequena ação que podes fazer hoje para te aproximares do teu objetivo?',
    'Que hábito tens adiado que faria diferença na tua vida?',
    'Como te sentes em relação ao teu progresso esta semana?',
    'O que aprendeste sobre ti nos últimos dias?',
    'Que distração podes eliminar para ganhar mais foco?',
    'Como podes ser mais gentil contigo hoje?',
    'Que versão de ti queres ser daqui a 6 meses?',
    'O que te impede de agir? É real ou é medo?',
    'Que pequena vitória podes celebrar hoje?',
    'Como podes transformar um desafio atual numa oportunidade?'
  ];

  return reflexoes[dayOfYear % reflexoes.length];
};

// Guias Curtos
const guiasDesenvolvimento: GuiaDesenvolvimento[] = [
  {
    id: 'disciplina',
    titulo: 'Disciplina: A Base da Transformação',
    descricao: 'Como construir disciplina sustentável',
    conteudo: 'Disciplina não é sobre ser perfeito. É sobre aparecer, mesmo quando não te apetece. É a capacidade de fazer o que precisa ser feito, independentemente de como te sentes. Disciplina é liberdade: quanto mais consistente fores, mais controlo tens sobre a tua vida.',
    aplicacao: 'Escolhe UMA ação simples (ex: 10 minutos de leitura) e faz todos os dias durante 7 dias. Não falha. Depois, adiciona outra.'
  },
  {
    id: 'procrastinacao',
    titulo: 'Vencer a Procrastinação',
    descricao: 'Estratégias práticas para agir',
    conteudo: 'Procrastinação não é preguiça. É medo disfarçado. Medo de falhar, de não ser bom o suficiente, de ser julgado. A solução? Ação imperfeita. Começa mal, mas começa. Dois minutos de ação valem mais que duas horas de planeamento perfeito.',
    aplicacao: 'Regra dos 2 minutos: quando tiveres uma tarefa, compromete-te a fazê-la durante apenas 2 minutos. Geralmente, vais continuar.'
  },
  {
    id: 'gestao-emocional',
    titulo: 'Gestão Emocional',
    descricao: 'Lidar com emoções difíceis',
    conteudo: 'Emoções não são o inimigo. São informação. Ansiedade diz "há algo importante aqui". Raiva diz "um limite foi ultrapassado". Tristeza diz "preciso de processar uma perda". Não suprimas. Observa, reconhece, age com consciência.',
    aplicacao: 'Quando sentires uma emoção forte: para, respira, nomeia a emoção ("estou ansioso"), pergunta "o que isto me quer dizer?" e escolhe conscientemente a próxima ação.'
  },
  {
    id: 'foco',
    titulo: 'Foco Profundo',
    descricao: 'Como proteger a tua atenção',
    conteudo: 'Vivemos na economia da atenção. Quem controla a tua atenção, controla a tua vida. Foco não é fazer mais. É fazer menos, mas melhor. É escolher conscientemente onde colocas a tua energia mental.',
    aplicacao: 'Técnica Pomodoro: 25 minutos de foco total numa tarefa (sem telemóvel, sem distrações), depois 5 minutos de pausa. Repete 4 vezes.'
  },
  {
    id: 'consistencia',
    titulo: 'O Poder da Consistência',
    descricao: 'Pequenas ações, grandes resultados',
    conteudo: 'Não são as ações heroicas que transformam vidas. São as pequenas ações repetidas. 1% melhor todos os dias = 37x melhor em um ano. Consistência vence talento. Sempre.',
    aplicacao: 'Escolhe um hábito minúsculo (ex: 1 flexão ao acordar) e faz TODOS os dias. Quando for automático, aumenta gradualmente.'
  }
];

export default function DesenvolvimentoView() {
  const [completedHabits, setCompletedHabits] = useState<Set<string>>(new Set());
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [showLivrosEssenciais, setShowLivrosEssenciais] = useState(false);
  const [selectedPlanoItem, setSelectedPlanoItem] = useState<{
    tipo: 'intencao' | 'acaoPrincipal' | 'acaoComplementar' | 'ritualMental';
    explicacao: ExplicacaoPlano;
  } | null>(null);

  // Refs para scroll automático
  const planoRef = useRef<HTMLDivElement>(null);
  const focoRef = useRef<HTMLDivElement>(null);
  const livrosRef = useRef<HTMLDivElement>(null);
  const guiasRef = useRef<HTMLDivElement>(null);
  const habitosRef = useRef<HTMLDivElement>(null);

  const planoDoDia = getPlanoDoDia();
  const focoDaSemana = getFocoDaSemana();
  const reflexaoDoDia = getReflexaoDoDia();

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Se Livros Essenciais está ativo, mostra apenas essa view
  if (showLivrosEssenciais) {
    return <LivrosEssenciaisView onBack={() => setShowLivrosEssenciais(false)} />;
  }

  const toggleHabit = (id: string) => {
    setCompletedHabits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handlePlanoItemClick = (tipo: 'intencao' | 'acaoPrincipal' | 'acaoComplementar' | 'ritualMental') => {
    let explicacao: ExplicacaoPlano;
    
    switch (tipo) {
      case 'intencao':
        explicacao = getExplicacaoIntencao(planoDoDia.intencao);
        break;
      case 'acaoPrincipal':
        explicacao = getExplicacaoAcaoPrincipal(planoDoDia.acaoPrincipal);
        break;
      case 'acaoComplementar':
        explicacao = getExplicacaoAcaoComplementar(planoDoDia.acaoComplementar);
        break;
      case 'ritualMental':
        explicacao = getExplicacaoRitualMental(planoDoDia.ritualMental);
        break;
    }
    
    setSelectedPlanoItem({ tipo, explicacao });
  };

  // Modal de explicação do plano
  if (selectedPlanoItem) {
    return (
      <div className="max-w-3xl mx-auto pb-20 md:pb-8">
        <Button
          onClick={() => setSelectedPlanoItem(null)}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Voltar ao Plano
        </Button>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {selectedPlanoItem.explicacao.titulo}
            </h1>
            <button
              onClick={() => setSelectedPlanoItem(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-purple-500" />
                O que é?
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {selectedPlanoItem.explicacao.explicacao}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-blue-600" />
                Porque importa?
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {selectedPlanoItem.explicacao.porqueImporta}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-purple-600" />
                Como fazer?
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {selectedPlanoItem.explicacao.comoFazer}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se um guia está selecionado, mostra apenas ele
  if (selectedGuide) {
    const guide = guiasDesenvolvimento.find(g => g.id === selectedGuide);
    if (!guide) return null;

    return (
      <div className="max-w-3xl mx-auto pb-20 md:pb-8">
        <Button
          onClick={() => setSelectedGuide(null)}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Voltar
        </Button>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {guide.titulo}
          </h1>
          <p className="text-purple-600 font-medium mb-6 text-base md:text-lg">
            {guide.descricao}
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" />
                Compreender
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {guide.conteudo}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Aplicação Prática
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {guide.aplicacao}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Desenvolvimento Pessoal 🎯
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Direção, consistência e acompanhamento real
        </p>
      </div>

      {/* ACESSOS RÁPIDOS - NAVEGAÇÃO INTERNA */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 md:p-6 mb-6 border-2 border-purple-200">
        <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Acesso Rápido
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
          <button
            onClick={() => scrollToSection(planoRef)}
            className="bg-white hover:bg-purple-50 rounded-xl p-3 border border-purple-200 hover:border-purple-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <Calendar className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Plano do Dia</span>
          </button>
          <button
            onClick={() => scrollToSection(focoRef)}
            className="bg-white hover:bg-purple-50 rounded-xl p-3 border border-purple-200 hover:border-purple-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <Trophy className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Foco Semana</span>
          </button>
          <button
            onClick={() => scrollToSection(livrosRef)}
            className="bg-white hover:bg-purple-50 rounded-xl p-3 border border-purple-200 hover:border-purple-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <Book className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Livros</span>
          </button>
          <button
            onClick={() => scrollToSection(guiasRef)}
            className="bg-white hover:bg-purple-50 rounded-xl p-3 border border-purple-200 hover:border-purple-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <BookOpen className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Guias</span>
          </button>
          <button
            onClick={() => scrollToSection(habitosRef)}
            className="bg-white hover:bg-purple-50 rounded-xl p-3 border border-purple-200 hover:border-purple-400 transition-all duration-200 flex flex-col items-center gap-2 group"
          >
            <TrendingUp className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-gray-700">Hábitos</span>
          </button>
        </div>
      </div>

      {/* Foco da Semana */}
      <div ref={focoRef} className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6" />
          <h2 className="text-xl md:text-2xl font-bold">Foco da Semana</h2>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-3">
          {focoDaSemana.tema}
        </h3>
        <p className="text-base md:text-lg leading-relaxed mb-4 text-purple-100">
          {focoDaSemana.descricao}
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-sm md:text-base leading-relaxed">
            💡 {focoDaSemana.conexao}
          </p>
        </div>
      </div>

      {/* Plano do Dia - INTERATIVO */}
      <div ref={planoRef} className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Plano do Dia</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          💡 Clica em cada item para ver explicação detalhada
        </p>

        <div className="space-y-4">
          {/* Intenção - CLICÁVEL */}
          <button
            onClick={() => handlePlanoItemClick('intencao')}
            className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                    Intenção
                  </h3>
                  <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {planoDoDia.intencao}
                </p>
              </div>
            </div>
          </button>

          {/* Ação Principal - CLICÁVEL */}
          <button
            onClick={() => handlePlanoItemClick('acaoPrincipal')}
            className="w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                    Ação Principal
                  </h3>
                  <ChevronRight className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {planoDoDia.acaoPrincipal}
                </p>
              </div>
            </div>
          </button>

          {/* Ação Complementar - CLICÁVEL */}
          <button
            onClick={() => handlePlanoItemClick('acaoComplementar')}
            className="w-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Repeat className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                    Ação Complementar
                  </h3>
                  <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    Opcional
                  </span>
                  <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {planoDoDia.acaoComplementar}
                </p>
              </div>
            </div>
          </button>

          {/* Ritual Mental - CLICÁVEL */}
          <button
            onClick={() => handlePlanoItemClick('ritualMental')}
            className="w-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-200 text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                    Ritual Mental Curto
                  </h3>
                  <ChevronRight className="w-4 h-4 text-green-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  {planoDoDia.ritualMental}
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Hábitos-chave */}
      <div ref={habitosRef} className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Hábitos-chave</h2>
        </div>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Foco em consistência, não em quantidade. Marca os hábitos que praticaste hoje.
        </p>

        <div className="space-y-3">
          {habitosChave.map((habito) => {
            const isCompleted = completedHabits.has(habito.id);
            return (
              <button
                key={habito.id}
                onClick={() => toggleHabit(habito.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-start gap-4 ${
                  isCompleted
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold text-sm md:text-base ${
                      isCompleted ? 'text-green-700' : 'text-gray-800'
                    }`}>
                      {habito.titulo}
                    </h3>
                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                      {habito.frequencia}
                    </span>
                  </div>
                  <p className={`text-xs md:text-sm ${
                    isCompleted ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {habito.descricao}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 bg-purple-50 rounded-xl p-4">
          <p className="text-sm text-purple-700 text-center">
            <span className="font-semibold">{completedHabits.size}</span> de {habitosChave.length} hábitos praticados hoje
          </p>
        </div>
      </div>

      {/* Reflexão Guiada */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Reflexão Guiada</h2>
        </div>
        
        {!showReflection ? (
          <button
            onClick={() => setShowReflection(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Ver reflexão do dia
          </button>
        ) : (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
            <p className="text-gray-800 text-base md:text-lg leading-relaxed mb-4">
              {reflexaoDoDia}
            </p>
            <p className="text-sm text-gray-600 italic">
              Não há resposta certa ou errada. Apenas honestidade contigo mesmo.
            </p>
          </div>
        )}
      </div>

      {/* Guias Curtos */}
      <div ref={guiasRef} className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Guias de Desenvolvimento</h2>
        </div>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Temas práticos com aplicação concreta
        </p>

        <div className="space-y-3">
          {guiasDesenvolvimento.map((guide) => (
            <button
              key={guide.id}
              onClick={() => setSelectedGuide(guide.id)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-purple-300 hover:shadow-md transition-all duration-300 text-left flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">
                  {guide.titulo}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  {guide.descricao}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Livros Essenciais - NOVO */}
      <div ref={livrosRef} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 shadow-xl border-2 border-amber-200">
        <div className="flex items-center gap-3 mb-4">
          <Book className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Livros Essenciais</h2>
        </div>
        <p className="text-gray-700 mb-6 text-sm md:text-base">
          Crescimento pessoal e profissional através da leitura prática. 6 livros-chave organizados por área.
        </p>
        
        <button
          onClick={() => setShowLivrosEssenciais(true)}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Book className="w-5 h-5" />
          Explorar Livros Essenciais
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
