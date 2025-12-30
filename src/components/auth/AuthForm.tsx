'use client';

import { useState } from 'react';
import { supabase, isSupabaseConfigured, offlineAuth } from '@/lib/supabase';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface AuthFormProps {
  onSuccess: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!isSupabaseConfigured);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (offlineMode || !isSupabaseConfigured) {
        // Modo offline - autenticação local
        if (isLogin) {
          await offlineAuth.signIn(email, password);
        } else {
          await offlineAuth.signUp(email, password);
        }
        onSuccess();
      } else {
        // Modo online - Supabase
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
        } else {
          const { error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
        }
        onSuccess();
      }
    } catch (err: any) {
      // Tratamento específico para erros
      if (err.message?.includes('Load failed') || 
          err.message?.includes('Network') || 
          err.message?.includes('fetch') ||
          err.message?.includes('conexão')) {
        setError('Erro de conexão. A usar modo offline.');
        // Ativar modo offline automaticamente
        setOfflineMode(true);
        setTimeout(() => {
          setError('');
        }, 2000);
      } else if (err.message?.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos. Tenta novamente.');
      } else if (err.message?.includes('User already registered') || err.message?.includes('já está registado')) {
        setError('Este email já está registado. Tenta fazer login.');
      } else {
        setError(err.message || 'Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/f2c3bea7-d643-4051-9ac8-32cfa642b823.png" 
              alt="SoulRise Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SoulRise</h1>
          <p className="text-gray-600">Eleva a tua mente, espírito e hábitos</p>
        </div>

        {/* Indicador de modo */}
        <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${
          offlineMode 
            ? 'bg-blue-50 border border-blue-200 text-blue-700' 
            : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {offlineMode ? (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Modo Offline - Os dados são guardados localmente</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4" />
              <span>Modo Online - Conectado ao Supabase</span>
            </>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
            </h2>
            <p className="text-gray-600">
              {isLogin
                ? 'Entre para continuar a tua jornada'
                : 'Começa a tua jornada de transformação'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="teu@email.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Aguarda...' : isLogin ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              {isLogin ? 'Não tens conta? Cria uma' : 'Já tens conta? Entra'}
            </button>
          </div>

          {/* Toggle Offline/Online Mode */}
          {isSupabaseConfigured && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setOfflineMode(!offlineMode)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {offlineMode ? 'Tentar modo online' : 'Usar modo offline'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Ao continuar, concordas com os nossos termos e condições
        </p>
      </div>
    </div>
  );
}
