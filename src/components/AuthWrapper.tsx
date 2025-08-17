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
    // URLパラメータをチェックしてメール確認を処理
    const handleEmailConfirmation = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      const type = urlParams.get('type');

      if (accessToken && refreshToken && type === 'signup') {
        try {
          // Supabaseセッションを設定
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Session setting error:', error);
            return;
          }

          if (data.user) {
            // URLパラメータをクリア
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // メール確認完了画面に遷移
            setCurrentView('email-confirmed');
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Email confirmation error:', error);
        }
      }

      // 通常の認証チェック
      await checkAuth();
    };

    // 初期認証状態をチェック
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // プロフィール情報を確認
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !profile.onboarding_completed) {
            setCurrentView('onboarding');
          } else {
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleEmailConfirmation();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile && !profile.onboarding_completed) {
              setCurrentView('onboarding');
            } else {
              setIsAuthenticated(true);
            }
          }
        }
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !profile.onboarding_completed) {
            setCurrentView('onboarding');
          } else {
            setIsAuthenticated(true);
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