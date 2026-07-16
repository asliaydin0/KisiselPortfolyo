import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin', { replace: true });
      }
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message === 'Invalid login credentials' 
          ? 'Hatalı e-posta veya şifre!' 
          : loginError.message);
      } else if (data.session) {
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-primary overflow-hidden font-sans">
      {/* Background decoration elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[#915EFF] to-[#3b82f6] opacity-20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#ec4899] to-[#8b5cf6] opacity-15 blur-[120px] pointer-events-none" />

      {/* Glassmorphic Container */}
      <div className="relative z-10 w-full max-w-md px-6 py-8 mx-4 transition-all duration-300">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white">
          
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#dfd9ff] to-[#915EFF] bg-clip-text text-transparent">
              Yönetici Girişi
            </h2>
            <p className="mt-2 text-sm text-[#dfd9ff] opacity-80">
              Portföyünüzü güncellemek için giriş yapın
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-center gap-2 animate-bounce">
              <span className="text-base font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#dfd9ff] mb-2">
                E-posta Adresi
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@alanadi.com"
                className="w-full px-4 py-3 rounded-xl bg-primary/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#915EFF] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#dfd9ff] mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-primary/40 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#915EFF] focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#915EFF] to-[#8254eb] text-white hover:shadow-[0_0_20px_rgba(145,94,255,0.4)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Giriş Yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-xs text-[#dfd9ff] hover:text-white transition-colors duration-200 flex items-center justify-center gap-1.5 mx-auto opacity-70 hover:opacity-100"
            >
              <span>←</span> Portföye Geri Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
