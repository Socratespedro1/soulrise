// Sistema de verificação e gerenciamento de conteúdo Premium

export interface PremiumStatus {
  isPremium: boolean;
  userId: string | null;
}

/**
 * Verifica se o utilizador tem acesso Premium
 * Prioriza verificação no Supabase, fallback para localStorage
 */
export function checkPremiumStatus(): PremiumStatus {
  // Verificar localStorage primeiro (mais rápido)
  const localPremium = localStorage.getItem('soulrise_is_premium');
  const userId = localStorage.getItem('soulrise_user_id');
  
  return {
    isPremium: localPremium === 'true',
    userId: userId
  };
}

/**
 * Atualiza o status Premium no localStorage
 */
export function updatePremiumStatus(isPremium: boolean, userId: string) {
  localStorage.setItem('soulrise_is_premium', String(isPremium));
  localStorage.setItem('soulrise_user_id', userId);
}

/**
 * Define quais funcionalidades são Free vs Premium
 */
export const PREMIUM_FEATURES = {
  home: {
    free: ['intencao', 'acaoPrincipal', 'ritual', 'afirmacao'],
    premium: ['acaoComplementar', 'miniDesafio', 'focoExpandido']
  },
  desenvolvimento: {
    free: ['planoDia', 'habitosPrincipais', 'mensagemMindset', 'guiasIntro', 'livrosLista'],
    premium: ['reflexaoDiaria', 'guiasCompletos', 'livrosAplicacao', 'focoSemana', 'historicoProgresso']
  },
  espiritualidade: {
    free: ['versiculoDia', 'reflexaoCurta', 'oracaoSimples'],
    premium: ['oracoesGuiadas', 'meditacaoGuiada', 'reflexoesAprofundadas', 'percursosEspirituais']
  },
  biblia: {
    free: ['versiculoDia', 'explicacaoSimples', 'aplicacaoCurta'],
    premium: ['leiturasTema', 'reflexoesLongas', 'bibliotecaGuiada']
  },
  saude: {
    free: ['movimentoLeve', 'respiracaoSimples', 'alimentacaoConsciente', 'jejumInfo'],
    premium: ['rotinasCompletas', 'respiracaoObjetivo', 'planosSemanal', 'sonoRecuperacao']
  },
  perfil: {
    free: ['diasAtivos', 'ritualHoje', 'streakAtual'],
    premium: ['historicoCompleto', 'melhorStreak', 'ajustePlano']
  }
};

/**
 * Verifica se uma funcionalidade específica requer Premium
 */
export function requiresPremium(area: keyof typeof PREMIUM_FEATURES, feature: string): boolean {
  const areaFeatures = PREMIUM_FEATURES[area];
  return areaFeatures.premium.includes(feature);
}

/**
 * Obtém mensagem contextual para paywall baseada na área
 */
export function getPaywallMessage(area: keyof typeof PREMIUM_FEATURES): {
  title: string;
  description: string;
  benefits: string[];
} {
  const messages = {
    home: {
      title: 'Desbloqueia o teu potencial completo',
      description: 'Acede a ações complementares, mini-desafios diários e explicações expandidas.',
      benefits: [
        'Ação complementar personalizada',
        'Mini-desafio diário',
        'Foco da semana detalhado',
        'Conteúdos com maior personalização'
      ]
    },
    desenvolvimento: {
      title: 'Aprofunda o teu crescimento pessoal',
      description: 'Acede a reflexões guiadas, guias completos e histórico de progresso.',
      benefits: [
        'Reflexão guiada diária',
        'Guias completos de temas',
        'Aplicações práticas dos livros',
        'Histórico de progresso e streaks'
      ]
    },
    espiritualidade: {
      title: 'Expande a tua jornada espiritual',
      description: 'Acede a orações guiadas, meditações e percursos espirituais completos.',
      benefits: [
        'Orações guiadas por tema',
        'Momentos de meditação guiada',
        'Reflexões espirituais aprofundadas',
        'Percursos espirituais de 7/14 dias'
      ]
    },
    biblia: {
      title: 'Aprofunda o teu estudo bíblico',
      description: 'Acede a leituras por tema, reflexões longas e biblioteca guiada.',
      benefits: [
        'Leituras bíblicas por tema',
        'Reflexões longas com aplicação',
        'Biblioteca de leituras guiadas',
        'Sequências de estudo estruturadas'
      ]
    },
    saude: {
      title: 'Eleva o teu bem-estar',
      description: 'Acede a rotinas completas, respiração guiada e planos semanais.',
      benefits: [
        'Rotinas completas (manhã e noite)',
        'Respiração guiada por objetivo',
        'Planos semanais de bem-estar',
        'Estratégias de sono e recuperação'
      ]
    },
    perfil: {
      title: 'Acompanha o teu progresso completo',
      description: 'Acede ao histórico completo, melhor streak e ajustes personalizados.',
      benefits: [
        'Histórico completo de progressos',
        'Melhor streak de todos os tempos',
        'Ajuste de plano personalizado',
        'Conteúdos sugeridos avançados'
      ]
    }
  };

  return messages[area];
}
