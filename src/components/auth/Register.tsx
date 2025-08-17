import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RegisterProps {
  onNavigate: (view: string) => void;
}

function Register({ onNavigate }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // パスワード確認
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/#/email-confirmed`,
          data: {
            email_confirm: true
          }
        }
      });

      if (error) {
        // 既に登録済みの場合は確認メールを再送
        if (error.message.includes('already') || error.message.includes('registered')) {
          try {
            const { error: resendError } = await supabase.auth.resend({
              type: 'signup',
              email: email,
              options: {
                emailRedirectTo: `${window.location.origin}/#/email-confirmed`
              }
            });
            
            if (resendError) {
              console.error('Resend error:', resendError);
              // 再送エラーでも成功画面に遷移（メールが既に送信済みの可能性）
              onNavigate('register-success');
            } else {
              onNavigate('register-success');
            }
            return;
          } catch (resendErr) {
            console.error('Resend catch error:', resendErr);
            // エラーでも成功画面に遷移
            onNavigate('register-success');
            return;
          }
        }
        setError(error.message);
        return;
      }

      if (data.user) {
        // 仮登録完了画面へ
        onNavigate('register-success');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-2xl">
              <UserPlus className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">新規登録</h1>
            <p className="text-slate-600">賢者の精算へようこそ</p>
          </div>

          {/* 登録フォーム */}
          <div className="backdrop-blur-xl bg-white/20 rounded-xl p-8 border border-white/30 shadow-2xl">
            <form onSubmit={handleRegister} className="space-y-6">
              {error && (
                <div className="bg-red-50/50 border border-red-200/50 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-xl"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-xl"
                    placeholder="8文字以上のパスワード"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  パスワード確認
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/50 border border-white/40 rounded-lg text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-xl"
                    placeholder="パスワードを再入力"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white rounded-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-5 h-5" />
                <span>{isLoading ? '登録中...' : '仮登録'}</span>
              </button>
            </form>

            {/* ログインリンク */}
            <div className="mt-6 text-center">
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center justify-center space-x-2 text-navy-600 hover:text-navy-800 text-sm font-medium transition-colors mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ログイン画面に戻る</span>
              </button>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-xs">
              登録することで、利用規約とプライバシーポリシーに同意したものとみなされます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;