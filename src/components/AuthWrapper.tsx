import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Login from './auth/Login';
import Register from './auth/Register';
import RegisterSuccess from './auth/RegisterSuccess';
import EmailConfirmed from './auth/EmailConfirmed';
import Onboarding from './auth/Onboarding';
import PasswordReset from './auth/PasswordReset';
import Dashboard from './Dashboard';

function AuthWrapper() {
  const [currentView, setCurrentView] = useState<string>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // URLパラメータをチェック（クエリパラメータとハッシュフラグメント両方）
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // クエリパラメータから取得を試行
        let accessToken = urlParams.get('access_token') || hashParams.get('access_token');
        let refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token');
        let type = urlParams.get('type') || hashParams.get('type');
        let error = urlParams.get('error') || hashParams.get('error');
        let errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
        let code = urlParams.get('code');

        // エラーがある場合の処理
        if (error) {
          console.error('Auth error:', error, errorDescription);
          setCurrentView('login');
          setIsLoading(false);
          return;
        }

        // 認証コードがある場合（PKCE flow）
        if (code) {
          try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
              console.error('Code exchange error:', error);
              setCurrentView('login');
              setIsLoading(false);
              return;
            }

            if (data.user && data.user.email_confirmed_at) {
              // URLパラメータをクリア
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // プロフィールをチェック
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

              if (profileError || !profile) {
                // プロフィールが存在しない場合は本登録へ
                setCurrentView('onboarding');
              } else if (!profile.onboarding_completed) {
                // 本登録が未完了の場合
                setCurrentView('onboarding');
              } else {
                // ログイン成功
                setIsAuthenticated(true);
              }
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error('Code exchange error:', error);
            setCurrentView('login');
            setIsLoading(false);
            return;
          }
        }

        // メール確認の場合（従来のフロー）
        if (accessToken && refreshToken) {
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (error) {
              console.error('Session setting error:', error);
              setCurrentView('login');
              setIsLoading(false);
              return;
            }

            if (data.user && data.user.email_confirmed_at) {
              // URLハッシュをクリア
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // プロフィールをチェック
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

              if (profileError || !profile) {
                // プロフィールが存在しない場合は本登録へ
                setCurrentView('onboarding');
              } else if (!profile.onboarding_completed) {
                // 本登録が未完了の場合
                setCurrentView('onboarding');
              } else {
                // ログイン成功
                setIsAuthenticated(true);
              }
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error('Email confirmation error:', error);
            setCurrentView('login');
            setIsLoading(false);
            return;
          }
        }

        // 通常の認証状態チェック
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          if (session.user.email_confirmed_at) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError || !profile) {
              console.error('Profile fetch error:', profileError);
              setCurrentView('onboarding');
            } else if (profile && !profile.onboarding_completed) {
              setCurrentView('onboarding');
            } else {
              setIsAuthenticated(true);
            }
          } else {
            setCurrentView('login');
          }
        } else {
          setCurrentView('login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setCurrentView('login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id, session?.user?.email_confirmed_at);
        
        if (event === 'SIGNED_IN' && session?.user) {
          if (session.user.email_confirmed_at) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!profile || !profile.onboarding_completed) {
              setCurrentView('onboarding');
            } else {
              setIsAuthenticated(true);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setCurrentView('login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleOnboardingComplete = () => {
    setIsAuthenticated(true);
  };

  const navigateToView = (view: string) => {
    setCurrentView(view);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  switch (currentView) {
    case 'register':
      return <Register onNavigate={navigateToView} />;
    case 'register-success':
      return <RegisterSuccess onNavigate={navigateToView} />;
    case 'email-confirmed':
      return <EmailConfirmed onNavigate={navigateToView} />;
    case 'onboarding':
      return <Onboarding onNavigate={navigateToView} onComplete={handleOnboardingComplete} />;
    case 'password-reset':
      return <PasswordReset onNavigate={navigateToView} />;
    default:
      return <Login onNavigate={navigateToView} onLoginSuccess={handleLoginSuccess} />;
  }
}

export default AuthWrapper;