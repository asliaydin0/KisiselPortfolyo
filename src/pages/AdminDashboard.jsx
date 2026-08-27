import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from '../config/supabaseClient';
import AdminProjects from './admin/AdminProjects';
import AdminExperiences from './admin/AdminExperiences';
import AdminSkills from './admin/AdminSkills';
import AdminServices from './admin/AdminServices';
import AdminSettings from './admin/AdminSettings';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Panel Özeti', icon: '📊' },
  { id: 'settings', label: 'Genel Ayarlar', icon: '⚙️' },
  { id: 'projects', label: 'Projeleri Yönet', icon: '📁' },
  { id: 'experience', label: 'Deneyimleri Yönet', icon: '💼' },
  { id: 'skills', label: 'Yetenekleri Yönet', icon: '🛠' },
  { id: 'services', label: 'Hizmetleri Yönet', icon: '✨' },
];

const TAB_META = {
  dashboard: {
    title: 'Panel Özeti',
    subtitle: 'Hoş geldiniz! Portföyünüzün genel durumunu buradan izleyebilirsiniz.',
  },
  settings: {
    title: 'Genel Ayarlar',
    subtitle: 'Logo, profil fotoğrafı ve hero metinlerini yönetin.',
  },
  projects: {
    title: 'Projeler',
    subtitle: 'Portföy projelerinizi yönetin.',
  },
  experience: {
    title: 'Deneyimler',
    subtitle: 'İş ve eğitim deneyimlerinizi yönetin.',
  },
  skills: {
    title: 'Yetenekler',
    subtitle: 'Teknik yeteneklerinizi yönetin.',
  },
  services: {
    title: 'Hizmetler',
    subtitle: 'Sunduğunuz hizmetleri yönetin.',
  },
};

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [counts, setCounts] = useState({ projects: 0, experiences: 0, skills: 0, services: 0 });
  const navigate = useNavigate();

  const fetchCounts = useCallback(async () => {
    const [projectsRes, experiencesRes, skillsRes, servicesRes] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('experiences').select('*', { count: 'exact', head: true }),
      supabase.from('skills').select('*', { count: 'exact', head: true }),
      supabase.from('services').select('*', { count: 'exact', head: true }),
    ]);

    setCounts({
      projects: projectsRes.count ?? 0,
      experiences: experiencesRes.count ?? 0,
      skills: skillsRes.count ?? 0,
      services: servicesRes.count ?? 0,
    });
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
        navigate('/admin-login', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!loading) {
      fetchCounts();
    }
  }, [loading, fetchCounts, activeTab]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-login', { replace: true });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return <AdminSettings />;
      case 'projects':
        return <AdminProjects />;
      case 'experience':
        return <AdminExperiences />;
      case 'skills':
        return <AdminSkills />;
      case 'services':
        return <AdminServices />;
      default:
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#dfd9ff] font-medium uppercase tracking-wider">Projeler</span>
                  <span className="text-2xl">📁</span>
                </div>
                <p className="text-4xl font-extrabold text-[#915EFF]">{counts.projects}</p>
                <p className="text-xs text-[#dfd9ff]/60 mt-2">Supabase veritabanından</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#dfd9ff] font-medium uppercase tracking-wider">Deneyimler</span>
                  <span className="text-2xl">💼</span>
                </div>
                <p className="text-4xl font-extrabold text-[#3b82f6]">{counts.experiences}</p>
                <p className="text-xs text-[#dfd9ff]/60 mt-2">Supabase veritabanından</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#dfd9ff] font-medium uppercase tracking-wider">Yetenekler</span>
                  <span className="text-2xl">🛠</span>
                </div>
                <p className="text-4xl font-extrabold text-emerald-400">{counts.skills}</p>
                <p className="text-xs text-[#dfd9ff]/60 mt-2">Supabase veritabanından</p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#dfd9ff] font-medium uppercase tracking-wider">Hizmetler</span>
                  <span className="text-2xl">✨</span>
                </div>
                <p className="text-4xl font-extrabold text-amber-400">{counts.services}</p>
                <p className="text-xs text-[#dfd9ff]/60 mt-2">Supabase veritabanından</p>
              </div>
            </div>

            <section className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>⚙️</span> Hızlı Başlangıç
              </h3>
              <div className="space-y-3 text-sm text-[#dfd9ff]/80">
                <p>
                  Sol menüden <strong className="text-white">Projeleri Yönet</strong>,{' '}
                  <strong className="text-white">Deneyimleri Yönet</strong> veya{' '}
                  <strong className="text-white">Yetenekleri Yönet</strong> veya{' '}
                  <strong className="text-white">Hizmetleri Yönet</strong> sekmelerine giderek
                  içeriklerinizi ekleyebilirsiniz.
                </p>
                <p>
                  Proje kapak fotoğrafları Supabase Storage&apos;daki{' '}
                  <code className="bg-primary px-2 py-1 rounded border border-white/10 text-[#915EFF] font-mono text-xs">
                    project-images
                  </code>{' '}
                  bucket&apos;ına yüklenir.
                </p>
              </div>
            </section>
          </>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  const meta = TAB_META[activeTab] || TAB_META.dashboard;

  return (
    <div className="min-h-screen bg-primary text-white font-sans flex flex-col md:flex-row">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#151030',
            color: '#f3f3f3',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#915EFF', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <aside className="w-full md:w-64 bg-primary/40 backdrop-blur-md border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#915EFF] flex items-center justify-center font-bold text-white text-lg">
              A
            </div>
            <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-white to-[#dfd9ff] bg-clip-text text-transparent">
              Admin Paneli
            </h1>
          </div>

          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-white/5 border border-white/10 text-white'
                    : 'text-[#dfd9ff] hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 md:mt-0 pt-6 border-t border-white/10">
          <div className="text-xs text-[#dfd9ff]/60 mb-3 truncate" title={user?.email}>
            Oturum Açan: <span className="font-semibold text-white">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 hover:bg-red-500 hover:text-white transition-all duration-200 font-medium"
          >
            <span>🚪</span> Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white">{meta.title}</h2>
              <p className="text-sm text-[#dfd9ff] opacity-80 mt-1">{meta.subtitle}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-all duration-200"
            >
              Sitemi Görüntüle ↗
            </button>
          </header>
        )}

        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
