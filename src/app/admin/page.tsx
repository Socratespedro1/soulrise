'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkIsAdmin, getCurrentUserEmail } from '@/lib/admin';
import { supabase, isSupabaseConfigured, offlineAuth } from '@/lib/supabase';
import { 
  Settings, 
  Users, 
  FileText, 
  Sparkles, 
  Crown, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  BarChart3
} from 'lucide-react';

type ContentType = 'intentions' | 'actions' | 'rituals' | 'affirmations' | 'challenges';

interface Content {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  isPremium: boolean;
  category: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'users' | 'ai' | 'stats'>('content');
  const [contents, setContents] = useState<Content[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  useEffect(() => {
    const verifyAdmin = async () => {
      const adminStatus = await checkIsAdmin();
      const email = await getCurrentUserEmail();
      
      setIsAdmin(adminStatus);
      setUserEmail(email);

      if (!adminStatus) {
        // Não é admin - mostrar prompt de código
        setShowAccessCode(true);
        setLoading(false);
      } else {
        // É admin - carregar dados
        loadContents();
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [router]);

  const handleAccessCode = () => {
    // Código de acesso: SOULRISE2024
    if (accessCode === 'SOULRISE2024') {
      // Marcar como admin no localStorage
      localStorage.setItem('soulrise_admin', 'true');
      localStorage.setItem('soulrise_admin_email', 'admin@soulrise.app');
      setIsAdmin(true);
      setUserEmail('admin@soulrise.app');
      setShowAccessCode(false);
      loadContents();
    } else {
      alert('Código de acesso inválido!');
    }
  };

  const loadContents = () => {
    // Carregar conteúdos do localStorage (simulação)
    const savedContents = localStorage.getItem('soulrise_admin_contents');
    if (savedContents) {
      setContents(JSON.parse(savedContents));
    } else {
      // Conteúdos iniciais de exemplo
      const initialContents: Content[] = [
        {
          id: '1',
          type: 'intentions',
          title: 'Cultivar Gratidão',
          description: 'Praticar gratidão diária para transformar a perspectiva',
          isPremium: false,
          category: 'Desenvolvimento Pessoal'
        },
        {
          id: '2',
          type: 'actions',
          title: 'Meditação Matinal',
          description: '10 minutos de meditação guiada',
          isPremium: true,
          category: 'Espiritualidade'
        },
        {
          id: '3',
          type: 'rituals',
          title: 'Ritual de Sono',
          description: 'Preparação consciente para dormir',
          isPremium: false,
          category: 'Saúde & Bem-Estar'
        }
      ];
      setContents(initialContents);
      localStorage.setItem('soulrise_admin_contents', JSON.stringify(initialContents));
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      offlineAuth.signOut();
    }
    localStorage.removeItem('soulrise_admin');
    localStorage.removeItem('soulrise_admin_email');
    router.push('/');
  };

  const saveContents = (newContents: Content[]) => {
    setContents(newContents);
    localStorage.setItem('soulrise_admin_contents', JSON.stringify(newContents));
  };

  const handleAddContent = (newContent: Omit<Content, 'id'>) => {
    const content: Content = {
      ...newContent,
      id: Date.now().toString()
    };
    saveContents([...contents, content]);
    setShowAddModal(false);
  };

  const handleEditContent = (content: Content) => {
    const updated = contents.map(c => c.id === content.id ? content : c);
    saveContents(updated);
    setEditingContent(null);
  };

  const handleDeleteContent = (id: string) => {
    if (confirm('Tens a certeza que queres apagar este conteúdo?')) {
      saveContents(contents.filter(c => c.id !== id));
    }
  };

  const togglePremium = (id: string) => {
    const updated = contents.map(c => 
      c.id === id ? { ...c, isPremium: !c.isPremium } : c
    );
    saveContents(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">A verificar permissões...</p>
        </div>
      </div>
    );
  }

  // Mostrar prompt de código de acesso
  if (showAccessCode && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Crown className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Administrativo</h1>
            <p className="text-gray-600">Insere o código de acesso para continuar</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAccessCode()}
              placeholder="Código de acesso"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg tracking-widest"
            />
            <button
              onClick={handleAccessCode}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Entrar
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel de Administração</h1>
                <p className="text-sm text-gray-600">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-2 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'content'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Conteúdos</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Utilizadores</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'ai'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>IA</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Estatísticas</span>
          </button>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Gerir Conteúdos</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar Conteúdo</span>
              </button>
            </div>

            <div className="grid gap-4">
              {contents.map(content => (
                <div key={content.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
                        {content.isPremium && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{content.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="capitalize">{content.type}</span>
                        <span>•</span>
                        <span>{content.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => togglePremium(content.id)}
                        className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title={content.isPremium ? 'Tornar Free' : 'Tornar Premium'}
                      >
                        {content.isPremium ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => setEditingContent(content)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteContent(content.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Utilizadores</h2>
            <p className="text-gray-600 mb-4">Gerir utilizadores registados na plataforma.</p>
            <button
              onClick={() => router.push('/admin/utilizadores')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Ver Utilizadores
            </button>
          </div>
        )}

        {/* AI Tab */}
        {activeTab === 'ai' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Controlo de IA</h2>
            <p className="text-gray-600">Funcionalidade em desenvolvimento. Aqui poderás controlar as configurações da Inteligência Artificial da app.</p>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Estatísticas</h2>
            <p className="text-gray-600">Funcionalidade em desenvolvimento. Aqui poderás ver estatísticas de uso da app.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingContent) && (
        <ContentModal
          content={editingContent}
          onSave={editingContent ? handleEditContent : handleAddContent}
          onClose={() => {
            setShowAddModal(false);
            setEditingContent(null);
          }}
        />
      )}
    </div>
  );
}

// Modal Component
function ContentModal({ 
  content, 
  onSave, 
  onClose 
}: { 
  content: Content | null; 
  onSave: (content: any) => void; 
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    type: content?.type || 'intentions' as ContentType,
    title: content?.title || '',
    description: content?.description || '',
    isPremium: content?.isPremium || false,
    category: content?.category || 'Desenvolvimento Pessoal'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content) {
      onSave({ ...content, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {content ? 'Editar Conteúdo' : 'Adicionar Conteúdo'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ContentType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="intentions">Intenção</option>
              <option value="actions">Ação</option>
              <option value="rituals">Ritual</option>
              <option value="affirmations">Afirmação</option>
              <option value="challenges">Desafio</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Desenvolvimento Pessoal">Desenvolvimento Pessoal</option>
              <option value="Espiritualidade">Espiritualidade</option>
              <option value="Saúde & Bem-Estar">Saúde & Bem-Estar</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPremium"
              checked={formData.isPremium}
              onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">
              Conteúdo Premium
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {content ? 'Guardar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
