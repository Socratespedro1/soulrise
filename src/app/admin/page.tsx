'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkIsAdmin, getCurrentUserEmail } from '@/lib/admin';
import { supabase, supabaseAdmin, isSupabaseConfigured, hasServiceRoleKey, offlineAuth } from '@/lib/supabase';
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
  BarChart3,
  RefreshCw,
  AlertCircle
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

interface User {
  id: string;
  email: string;
  isPremium: boolean;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'users' | 'ai' | 'stats'>('users');
  const [contents, setContents] = useState<Content[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

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
        loadUsers();
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
      loadUsers();
    } else {
      alert('Código de acesso inválido!');
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    setUsersError(null);
    
    try {
      if (isSupabaseConfigured) {
        // Estratégia 1: Usar supabaseAdmin para buscar todos os usuários
        if (hasServiceRoleKey && supabaseAdmin) {
          try {
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
            
            if (authData && authData.users && authData.users.length > 0 && !authError) {
              const formattedUsers: User[] = authData.users.map((user: any) => ({
                id: user.id,
                email: user.email || 'Sem email',
                isPremium: user.user_metadata?.is_premium || false,
                created_at: user.created_at || new Date().toISOString(),
                last_sign_in_at: user.last_sign_in_at,
                email_confirmed_at: user.email_confirmed_at
              }));
              setUsers(formattedUsers);
              return; // Sucesso - sair da função
            }
          } catch (adminError) {
            console.error('Erro ao usar supabaseAdmin:', adminError);
          }
        }

        // Estratégia 2: Tentar buscar da tabela profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesData && profilesData.length > 0 && !profilesError) {
          const formattedUsers: User[] = profilesData.map((profile: any) => ({
            id: profile.id,
            email: profile.email || 'Sem email',
            isPremium: profile.is_premium || false,
            created_at: profile.created_at || new Date().toISOString(),
            last_sign_in_at: profile.last_sign_in_at,
            email_confirmed_at: profile.email_confirmed_at
          }));
          setUsers(formattedUsers);
          return;
        }

        // Estratégia 3: Buscar usuário atual como fallback
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (currentUser) {
          const formattedUsers: User[] = [{
            id: currentUser.id,
            email: currentUser.email || 'Sem email',
            isPremium: currentUser.user_metadata?.is_premium || false,
            created_at: currentUser.created_at || new Date().toISOString(),
            last_sign_in_at: currentUser.last_sign_in_at,
            email_confirmed_at: currentUser.email_confirmed_at
          }];
          setUsers(formattedUsers);
          
          if (!hasServiceRoleKey) {
            setUsersError('⚠️ Mostrando apenas o utilizador atual. Para ver todos os utilizadores, adicione a Service Role Key do Supabase nas variáveis de ambiente (NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY).');
          }
        } else {
          setUsersError('Não foi possível carregar utilizadores. Verifique a configuração do Supabase.');
        }
      } else {
        // Modo offline - carregar do localStorage
        const offlineUsers = JSON.parse(localStorage.getItem('soulrise_offline_users') || '[]');
        
        const formattedUsers: User[] = offlineUsers.map((user: any) => ({
          id: user.id,
          email: user.email,
          isPremium: user.isPremium || false,
          created_at: user.created_at || new Date().toISOString()
        }));

        setUsers(formattedUsers);
        
        if (formattedUsers.length === 0) {
          setUsersError('Nenhum utilizador encontrado no modo offline. Os utilizadores registados aparecerão aqui.');
        }
      }
    } catch (error: any) {
      console.error('Erro ao carregar utilizadores:', error);
      setUsersError(error.message || 'Erro ao carregar utilizadores. Tente novamente.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleUserPremium = async (userId: string) => {
    try {
      if (isSupabaseConfigured) {
        // Atualizar no Supabase
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const { error } = await supabase
          .from('profiles')
          .update({ is_premium: !user.isPremium })
          .eq('id', userId);

        if (error) {
          console.error('Erro ao atualizar premium:', error);
          alert('Erro ao atualizar status premium. Verifique as permissões.');
          return;
        }

        // Atualizar estado local
        setUsers(users.map(u => 
          u.id === userId ? { ...u, isPremium: !u.isPremium } : u
        ));
      } else {
        // Modo offline
        const offlineUsers = JSON.parse(localStorage.getItem('soulrise_offline_users') || '[]');
        const updatedUsers = offlineUsers.map((user: any) => {
          if (user.id === userId) {
            return { ...user, isPremium: !user.isPremium };
          }
          return user;
        });
        
        localStorage.setItem('soulrise_offline_users', JSON.stringify(updatedUsers));
        
        // Atualizar estado local
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isPremium: !user.isPremium } : user
        ));

        // Se o usuário alterado está logado, atualizar sessão
        const session = localStorage.getItem('soulrise_offline_session');
        if (session) {
          const currentUser = JSON.parse(session);
          if (currentUser.id === userId) {
            const updatedUser = updatedUsers.find((u: any) => u.id === userId);
            localStorage.setItem('soulrise_offline_session', JSON.stringify(updatedUser));
          }
        }
      }
    } catch (error: any) {
      console.error('Erro ao alternar premium:', error);
      alert('Erro ao atualizar status premium.');
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

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Gerir Utilizadores</h2>
                <p className="text-sm text-gray-600 mt-1">Total de utilizadores: {users.length}</p>
              </div>
              <button
                onClick={loadUsers}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                disabled={loadingUsers}
              >
                <RefreshCw className={`w-5 h-5 ${loadingUsers ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </button>
            </div>

            {/* Alerta de erro */}
            {usersError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-1">Aviso</h3>
                  <p className="text-sm text-yellow-800">{usersError}</p>
                </div>
              </div>
            )}

            {loadingUsers ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">A carregar utilizadores...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum utilizador encontrado</h3>
                <p className="text-gray-600">Os utilizadores registados aparecerão aqui.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {users.map(user => (
                  <div key={user.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{user.email}</h3>
                          {user.isPremium ? (
                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              PREMIUM
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              FREE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>ID: {user.id.substring(0, 8)}...</span>
                          <span>•</span>
                          <span>Registado: {new Date(user.created_at).toLocaleDateString('pt-PT')}</span>
                          {user.last_sign_in_at && (
                            <>
                              <span>•</span>
                              <span>Último login: {new Date(user.last_sign_in_at).toLocaleDateString('pt-PT')}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleUserPremium(user.id)}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                          user.isPremium
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
                        }`}
                      >
                        {user.isPremium ? 'Remover Premium' : 'Tornar Premium'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-purple-900">Total de Utilizadores</h3>
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-900">{users.length}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-yellow-900">Utilizadores Premium</h3>
                  <Crown className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-3xl font-bold text-yellow-900">{users.filter(u => u.isPremium).length}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-blue-900">Taxa de Conversão</h3>
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-900">
                  {users.length > 0 ? Math.round((users.filter(u => u.isPremium).length / users.length) * 100) : 0}%
                </p>
              </div>
            </div>
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
