'use client';

import { useState } from 'react';
import { Book, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Tema = 'Ansiedade' | 'Medo' | 'Propósito' | 'Fé' | 'Disciplina' | 'Solidão' | 'Gratidão' | 'Força' | 'Perdão';
type SecaoBiblia = 'menu' | 'versiculos' | 'oracoes';

interface Versiculo {
  texto: string;
  referencia: string;
  explicacao: string;
  aplicacao: string;
}

interface Oracao {
  tipo: string;
  texto: string;
  cor: string;
}

const oracoes: Oracao[] = [
  {
    tipo: 'Oração de Entrega',
    texto: 'Senhor, hoje coloco tudo nas Tuas mãos. As minhas preocupações, os meus planos, as minhas dúvidas. Confio que Tu sabes o que é melhor para mim. Ajuda-me a soltar o controlo e a descansar na Tua vontade. Que a Tua paz encha o meu coração.',
    cor: 'from-blue-400 to-cyan-500'
  },
  {
    tipo: 'Oração para Dias Difíceis',
    texto: 'Pai, este dia está pesado e eu preciso de Ti. Sinto-me cansado, mas sei que Tu estás comigo. Dá-me força para continuar, mesmo quando tudo parece difícil. Lembra-me que esta tempestade vai passar e que Tu nunca me abandonas.',
    cor: 'from-purple-400 to-pink-500'
  },
  {
    tipo: 'Oração de Gratidão',
    texto: 'Obrigado, Senhor, por tudo o que tens feito por mim. Pelas pequenas coisas que muitas vezes não vejo, pelas pessoas que colocaste no meu caminho, pela vida que me deste. Hoje escolho ver as Tuas bênçãos e agradecer com um coração cheio.',
    cor: 'from-yellow-400 to-amber-500'
  },
  {
    tipo: 'Oração de Confiança',
    texto: 'Senhor, mesmo quando não entendo o caminho, eu confio em Ti. Sei que os Teus planos são maiores que os meus e que Tu vês o que eu não consigo ver. Ajuda-me a caminhar com fé, um passo de cada vez, sabendo que Tu me guias.',
    cor: 'from-emerald-400 to-teal-500'
  },
  {
    tipo: 'Oração para Clareza',
    texto: 'Pai, a minha mente está confusa e preciso de clareza. Mostra-me o caminho que devo seguir. Acalma os meus pensamentos e ajuda-me a ouvir a Tua voz. Que eu possa ver com os Teus olhos e decidir com sabedoria.',
    cor: 'from-indigo-400 to-blue-500'
  },
  {
    tipo: 'Oração Antes de Dormir',
    texto: 'Senhor, obrigado por este dia. Entrego-Te tudo o que aconteceu, o bom e o difícil. Perdoa os meus erros e renova-me enquanto durmo. Que eu descanse em paz, sabendo que Tu cuidas de mim. Amanhã é um novo dia nas Tuas mãos.',
    cor: 'from-pink-400 to-rose-500'
  }
];

const versiculosPorTema: Record<Tema, Versiculo[]> = {
  Ansiedade: [
    {
      texto: "Não andeis ansiosos por coisa alguma; antes em tudo sejam os vossos pedidos conhecidos diante de Deus pela oração e súplica com ações de graças.",
      referencia: "Filipenses 4:6",
      explicacao: "Este versículo nos lembra que não precisamos carregar sozinhos o peso das preocupações. Podemos entregar tudo a Deus através da oração.",
      aplicacao: "Quando sentires ansiedade, para um momento e fala com Deus sobre o que te preocupa. Escreve as tuas preocupações num papel e entrega-as a Ele em oração."
    },
    {
      texto: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.",
      referencia: "1 Pedro 5:7",
      explicacao: "Deus quer que confiemos Nele com as nossas preocupações. Ele cuida de nós como um pai amoroso cuida dos seus filhos.",
      aplicacao: "Antes de dormir, faz uma lista mental de tudo o que te preocupa e imagina-te a entregar cada item nas mãos de Deus."
    },
    {
      texto: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.",
      referencia: "Isaías 41:10",
      explicacao: "Deus promete estar sempre connosco, fortalecendo-nos e ajudando-nos em cada situação difícil.",
      aplicacao: "Quando sentires medo ou ansiedade, repete para ti mesmo: 'Deus está comigo, Ele me fortalece'. Respira fundo e confia."
    }
  ],
  Medo: [
    {
      texto: "Porque Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação.",
      referencia: "2 Timóteo 1:7",
      explicacao: "O medo não vem de Deus. Ele nos deu força interior, amor e uma mente equilibrada para enfrentar os desafios.",
      aplicacao: "Quando o medo aparecer, lembra-te que tens dentro de ti o poder de Deus. Respira fundo e age com coragem, mesmo que seja um pequeno passo."
    },
    {
      texto: "Ainda que eu ande pelo vale da sombra da morte, não temerei mal nenhum, porque tu estás comigo.",
      referencia: "Salmos 23:4",
      explicacao: "Mesmo nos momentos mais escuros, Deus está ao nosso lado. A Sua presença nos protege e conforta.",
      aplicacao: "Nos momentos de medo, fecha os olhos e imagina Deus ao teu lado, caminhando contigo. Não estás sozinho."
    },
    {
      texto: "O Senhor é a minha luz e a minha salvação; de quem terei medo? O Senhor é a fortaleza da minha vida; de quem terei temor?",
      referencia: "Salmos 27:1",
      explicacao: "Quando Deus é a nossa luz, Ele ilumina o caminho e afasta as trevas do medo. Ele é a nossa proteção.",
      aplicacao: "Começa o dia declarando: 'O Senhor é a minha luz e salvação'. Deixa esta verdade guiar os teus pensamentos."
    }
  ],
  Propósito: [
    {
      texto: "Porque sou eu que conheço os planos que tenho para vós, diz o Senhor; planos de paz, e não de mal, para vos dar um futuro e uma esperança.",
      referencia: "Jeremias 29:11",
      explicacao: "Deus tem um plano específico e bom para a tua vida. Mesmo quando não entendes o caminho, Ele está a guiar-te para um futuro cheio de esperança.",
      aplicacao: "Quando te sentires perdido, lembra-te que Deus tem um plano para ti. Pergunta-Lhe em oração: 'Senhor, mostra-me o próximo passo'."
    },
    {
      texto: "Tudo tem o seu tempo determinado, e há tempo para todo propósito debaixo do céu.",
      referencia: "Eclesiastes 3:1",
      explicacao: "Cada fase da vida tem o seu propósito. Deus trabalha em cada estação da nossa vida para nos moldar e preparar.",
      aplicacao: "Aceita a estação em que estás agora. Pergunta a Deus: 'O que queres ensinar-me neste momento da minha vida?'"
    },
    {
      texto: "Porque somos feitura dele, criados em Cristo Jesus para boas obras, as quais Deus de antemão preparou para que andássemos nelas.",
      referencia: "Efésios 2:10",
      explicacao: "Foste criado com um propósito específico. Deus preparou boas obras para ti realizares, que trazem significado à tua vida.",
      aplicacao: "Identifica uma forma de servir os outros hoje. Pode ser algo simples: um sorriso, uma palavra de encorajamento, um ato de bondade."
    }
  ],
  Fé: [
    {
      texto: "Ora, a fé é a certeza de coisas que se esperam, a convicção de fatos que se não veem.",
      referencia: "Hebreus 11:1",
      explicacao: "A fé é confiar em Deus mesmo quando não vemos o resultado. É ter certeza de que Ele está a trabalhar, mesmo nos bastidores.",
      aplicacao: "Escolhe uma situação difícil e decide confiar em Deus, mesmo sem ver a solução. Declara: 'Eu confio que Deus está a trabalhar'."
    },
    {
      texto: "Porque andamos por fé, e não por vista.",
      referencia: "2 Coríntios 5:7",
      explicacao: "A vida cristã não se baseia apenas no que vemos, mas na confiança em Deus e nas Suas promessas.",
      aplicacao: "Quando as circunstâncias parecerem impossíveis, escolhe confiar em Deus em vez de confiar apenas no que vês."
    },
    {
      texto: "Jesus disse: Se podes crer, tudo é possível ao que crê.",
      referencia: "Marcos 9:23",
      explicacao: "A fé abre portas para o impossível. Quando confiamos em Deus, Ele pode fazer além do que imaginamos.",
      aplicacao: "Identifica uma área onde precisas de um milagre. Ora com fé, acreditando que Deus pode fazer o impossível."
    }
  ],
  Disciplina: [
    {
      texto: "Toda disciplina, com efeito, no momento não parece ser motivo de alegria, mas de tristeza; ao depois, entretanto, produz fruto pacífico aos que têm sido por ela exercitados, fruto de justiça.",
      referencia: "Hebreus 12:11",
      explicacao: "A disciplina pode ser difícil no momento, mas produz crescimento e frutos positivos na nossa vida a longo prazo.",
      aplicacao: "Escolhe uma área onde precisas de mais disciplina (exercício, alimentação, tempo com Deus). Começa com um pequeno hábito diário."
    },
    {
      texto: "Não sabeis vós que os que correm no estádio, todos, na verdade, correm, mas um só leva o prêmio? Correi de tal maneira que o alcanceis.",
      referencia: "1 Coríntios 9:24",
      explicacao: "A vida cristã requer esforço e dedicação, como um atleta que treina para vencer. A disciplina nos ajuda a alcançar os nossos objetivos.",
      aplicacao: "Define um objetivo espiritual (ler a Bíblia diariamente, orar pela manhã) e compromete-te a praticá-lo durante 21 dias."
    },
    {
      texto: "Exercita-te pessoalmente na piedade. Pois o exercício físico para pouco é proveitoso, mas a piedade para tudo é proveitosa.",
      referencia: "1 Timóteo 4:7-8",
      explicacao: "Assim como exercitamos o corpo, devemos exercitar a nossa vida espiritual através de práticas disciplinadas.",
      aplicacao: "Cria uma rotina matinal que inclua tempo com Deus: 10 minutos de leitura bíblica e 5 minutos de oração."
    }
  ],
  Solidão: [
    {
      texto: "Não te deixarei nem te desampararei.",
      referencia: "Hebreus 13:5",
      explicacao: "Deus promete nunca nos abandonar. Mesmo quando nos sentimos sozinhos, Ele está sempre presente.",
      aplicacao: "Nos momentos de solidão, fala com Deus como falarias com um amigo. Ele está ali, ouvindo cada palavra."
    },
    {
      texto: "Eis que estou convosco todos os dias até à consumação do século.",
      referencia: "Mateus 28:20",
      explicacao: "Jesus prometeu estar connosco todos os dias. A Sua presença é constante e real, mesmo quando não a sentimos.",
      aplicacao: "Começa e termina o dia reconhecendo a presença de Deus. Diz: 'Obrigado por estares comigo hoje'."
    },
    {
      texto: "Deus é o nosso refúgio e fortaleza, socorro bem presente nas tribulações.",
      referencia: "Salmos 46:1",
      explicacao: "Deus é o nosso lugar seguro, especialmente nos momentos difíceis. Podemos correr para Ele quando nos sentimos sozinhos.",
      aplicacao: "Quando te sentires sozinho, encontra um lugar tranquilo e passa alguns minutos na presença de Deus em silêncio."
    }
  ],
  Gratidão: [
    {
      texto: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.",
      referencia: "1 Tessalonicenses 5:18",
      explicacao: "Agradecer em todas as circunstâncias transforma a nossa perspetiva e aproxima-nos de Deus.",
      aplicacao: "Antes de dormir, escreve três coisas pelas quais és grato hoje. Faz disto um hábito diário."
    },
    {
      texto: "Entrai por suas portas com ações de graças e nos seus átrios com hinos de louvor; rendei-lhe graças e bendizei o seu nome.",
      referencia: "Salmos 100:4",
      explicacao: "A gratidão é a porta de entrada para a presença de Deus. Quando agradecemos, o nosso coração se abre para Ele.",
      aplicacao: "Começa as tuas orações com gratidão. Antes de pedir algo, agradece por três bênçãos que já recebeste."
    },
    {
      texto: "Porque dele, e por meio dele, e para ele são todas as coisas. A ele, pois, a glória eternamente. Amém.",
      referencia: "Romanos 11:36",
      explicacao: "Tudo vem de Deus e existe para a Sua glória. Reconhecer isto enche-nos de gratidão.",
      aplicacao: "Olha à tua volta e identifica cinco coisas que Deus te deu. Agradece especificamente por cada uma delas."
    }
  ],
  Força: [
    {
      texto: "Tudo posso naquele que me fortalece.",
      referencia: "Filipenses 4:13",
      explicacao: "A nossa força não vem de nós mesmos, mas de Cristo que vive em nós. Com Ele, podemos enfrentar qualquer desafio.",
      aplicacao: "Quando enfrentares um desafio difícil, repete este versículo em voz alta. Lembra-te que a força de Cristo está em ti."
    },
    {
      texto: "Mas os que esperam no Senhor renovam as suas forças, sobem com asas como águias, correm e não se cansam, caminham e não se fatigam.",
      referencia: "Isaías 40:31",
      explicacao: "Quando esperamos em Deus e confiamos Nele, Ele renova as nossas forças de forma sobrenatural.",
      aplicacao: "Quando te sentires cansado, para e passa alguns minutos em oração. Pede a Deus para renovar as tuas forças."
    },
    {
      texto: "O Senhor é a minha força e o meu escudo; nele o meu coração confia, nele fui socorrido.",
      referencia: "Salmos 28:7",
      aplicacao: "Deus é tanto a nossa força interior como a nossa proteção exterior. Podemos confiar completamente Nele.",
      explicacao: "Identifica uma área onde te sentes fraco. Pede a Deus para ser a tua força nessa área específica."
    }
  ],
  Perdão: [
    {
      texto: "Antes sede uns para com os outros benignos, compassivos, perdoando-vos uns aos outros, como também Deus, em Cristo, vos perdoou.",
      referencia: "Efésios 4:32",
      explicacao: "Somos chamados a perdoar os outros da mesma forma que Deus nos perdoou - com compaixão e amor incondicional.",
      aplicacao: "Pensa em alguém que te magoou. Ora por essa pessoa e pede a Deus que te ajude a perdoá-la de coração."
    },
    {
      texto: "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça.",
      referencia: "1 João 1:9",
      explicacao: "Deus está sempre pronto a perdoar-nos quando nos arrependemos sinceramente. O Seu perdão é completo e restaurador.",
      aplicacao: "Confessa a Deus algo que te pesa na consciência. Recebe o Seu perdão e perdoa-te a ti mesmo."
    },
    {
      texto: "Porque, se perdoardes aos homens as suas ofensas, também vosso Pai celeste vos perdoará.",
      referencia: "Mateus 6:14",
      explicacao: "O perdão que oferecemos aos outros está ligado ao perdão que recebemos de Deus. Perdoar liberta-nos e aproxima-nos de Deus.",
      aplicacao: "Faz uma lista de pessoas que precisas perdoar. Ora por cada uma delas e escolhe libertar o ressentimento."
    }
  ]
};

const temas: Tema[] = ['Ansiedade', 'Medo', 'Propósito', 'Fé', 'Disciplina', 'Solidão', 'Gratidão', 'Força', 'Perdão'];

const coresTema: Record<Tema, string> = {
  Ansiedade: 'from-blue-400 to-cyan-500',
  Medo: 'from-purple-400 to-pink-500',
  Propósito: 'from-amber-400 to-orange-500',
  Fé: 'from-emerald-400 to-teal-500',
  Disciplina: 'from-red-400 to-rose-500',
  Solidão: 'from-indigo-400 to-blue-500',
  Gratidão: 'from-yellow-400 to-amber-500',
  Força: 'from-green-400 to-emerald-500',
  Perdão: 'from-pink-400 to-rose-500'
};

interface BibliaManualVidaProps {
  onBack: () => void;
}

export default function BibliaManualVida({ onBack }: BibliaManualVidaProps) {
  const [secaoAtual, setSecaoAtual] = useState<SecaoBiblia>('menu');
  const [temaSelecionado, setTemaSelecionado] = useState<Tema | null>(null);
  const [oracoesFavoritas, setOracoesFavoritas] = useState<Set<string>>(new Set());

  const toggleFavorito = (tipoOracao: string) => {
    setOracoesFavoritas(prev => {
      const novoSet = new Set(prev);
      if (novoSet.has(tipoOracao)) {
        novoSet.delete(tipoOracao);
      } else {
        novoSet.add(tipoOracao);
      }
      return novoSet;
    });
  };

  // Seção de Orações
  if (secaoAtual === 'oracoes') {
    return (
      <div className="max-w-4xl mx-auto pb-20 md:pb-8">
        <Button
          onClick={() => setSecaoAtual('menu')}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Menu
        </Button>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Orações</h2>
          <p className="text-white/90 text-base md:text-lg">
            Palavras sinceras para conectar o teu coração a Deus
          </p>
        </div>

        <div className="space-y-6">
          {oracoes.map((oracao, index) => {
            const isFavorita = oracoesFavoritas.has(oracao.tipo);
            
            return (
              <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-gradient-to-r ${oracao.cor} text-white px-4 py-2 rounded-xl font-semibold text-sm md:text-base`}>
                    {oracao.tipo}
                  </div>
                  <button
                    onClick={() => toggleFavorito(oracao.tipo)}
                    className={`transition-all duration-300 ${
                      isFavorita ? 'text-red-500 scale-110' : 'text-gray-300 hover:text-red-400'
                    }`}
                    aria-label={isFavorita ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  >
                    <Heart className={`w-6 h-6 ${isFavorita ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className="text-gray-700 text-base md:text-lg leading-relaxed italic">
                  {oracao.texto}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border-l-4 border-blue-500">
          <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">
            💙 Como usar estas orações
          </h3>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            Estas orações são um ponto de partida. Podes lê-las como estão ou usá-las para inspirar as tuas próprias palavras. Deus ouve o teu coração, não a perfeição das palavras. Fala com Ele como falarias com alguém que te ama profundamente.
          </p>
        </div>
      </div>
    );
  }

  // Seção de Versículos por Tema
  if (secaoAtual === 'versiculos' && temaSelecionado) {
    const versiculos = versiculosPorTema[temaSelecionado];
    const corGradiente = coresTema[temaSelecionado];

    return (
      <div className="max-w-4xl mx-auto pb-20 md:pb-8">
        <Button
          onClick={() => {
            setTemaSelecionado(null);
            setSecaoAtual('menu');
          }}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Menu
        </Button>

        <div className={`bg-gradient-to-r ${corGradiente} rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">{temaSelecionado}</h2>
          <p className="text-white/90 text-base md:text-lg">
            Versículos que falam ao teu coração sobre este tema
          </p>
        </div>

        <div className="space-y-6">
          {versiculos.map((versiculo, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
              <div className="mb-6">
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed italic mb-4">
                  "{versiculo.texto}"
                </p>
                <p className="text-purple-600 font-semibold text-base md:text-lg">
                  — {versiculo.referencia}
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                    💡 O que isto significa
                  </h4>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {versiculo.explicacao}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                    ✨ Como aplicar hoje
                  </h4>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    {versiculo.aplicacao}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Menu Principal
  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar à Espiritualidade
      </Button>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Book className="w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-bold">Bíblia: O Manual da Vida</h1>
        </div>
        <p className="text-white/90 text-base md:text-lg">
          Encontra orientação e conforto nas Escrituras Sagradas
        </p>
      </div>

      {/* Card de Orações */}
      <div 
        onClick={() => setSecaoAtual('oracoes')}
        className="bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl p-6 md:p-8 text-white shadow-xl mb-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="flex items-center gap-3 mb-3">
          <Heart className="w-7 h-7" />
          <h2 className="text-2xl md:text-3xl font-bold">Orações</h2>
        </div>
        <p className="text-white/90 text-sm md:text-base">
          Palavras sinceras para conectar o teu coração a Deus. Orações prontas para diferentes momentos da tua vida.
        </p>
      </div>

      {/* Procurar Versículos por Tema */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Procurar Versículos por Tema
        </h2>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Escolhe um tema que fala ao teu coração neste momento. Vais encontrar versículos que trazem luz, conforto e orientação prática para a tua vida.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {temas.map((tema) => (
            <button
              key={tema}
              onClick={() => {
                setTemaSelecionado(tema);
                setSecaoAtual('versiculos');
              }}
              className={`bg-gradient-to-r ${coresTema[tema]} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center font-semibold text-base md:text-lg`}
            >
              {tema}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border-l-4 border-blue-500">
        <h3 className="font-semibold text-gray-800 mb-2 text-base md:text-lg">
          💙 Como usar esta ferramenta
        </h3>
        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
          Escolhe o tema que mais ressoa contigo hoje. Cada versículo vem com uma explicação simples e uma aplicação prática para o teu dia a dia. Não precisas de conhecimento teológico - apenas um coração aberto para receber a mensagem de Deus.
        </p>
      </div>
    </div>
  );
}
