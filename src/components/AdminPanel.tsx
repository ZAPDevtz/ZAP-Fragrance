import React, { useState, useEffect } from 'react';
import { Settings, X, RotateCcw, Image as ImageIcon, Sun, Moon, LayoutTemplate, Lock, LogOut, Save, Loader2, UploadCloud } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [uploadingState, setUploadingState] = useState<'idle' | 'day' | 'night'>('idle');

  const { 
    accentColor, setAccentColor, 
    dayImage, setDayImage, 
    nightImage, setNightImage,
    themeMode, setThemeMode,
    resetTheme,
    saveSettings
  } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSave = async () => {
    setLoading(true);
    await saveSettings();
    setLoading(false);
    alert("Site settings updated successfully!");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'day' | 'night') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingState(type);
    
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(filePath);

      // 3. Update State
      if (type === 'day') setDayImage(publicUrl);
      if (type === 'night') setNightImage(publicUrl);

    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploadingState('idle');
    }
  };

  return (
    <>
      {/* Toggle Button - Only visible if logged in OR hidden trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[90] bg-stone-900 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform border border-stone-700"
        title="Admin Settings"
      >
        <Settings size={24} />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-[101] border-l border-stone-200 overflow-y-auto flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                <h2 className="font-serif text-2xl text-stone-900">
                  {session ? "Site Controls" : "Admin Access"}
                </h2>
                <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-900">
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {!session ? (
                  /* LOGIN FORM */
                  <div className="space-y-6">
                    <div className="text-center py-8">
                       <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Lock className="w-6 h-6 text-stone-400" />
                       </div>
                       <p className="text-sm text-stone-500">Please authenticate to modify luxury settings.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="text-xs uppercase font-bold text-stone-400 tracking-wider">Email</label>
                        <input 
                          type="email" 
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full mt-1 p-3 border border-stone-200 rounded focus:border-[var(--brand-accent)] focus:outline-none transition-colors"
                          placeholder="admin@zapfragrance.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-bold text-stone-400 tracking-wider">Password</label>
                        <input 
                          type="password" 
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full mt-1 p-3 border border-stone-200 rounded focus:border-[var(--brand-accent)] focus:outline-none transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-stone-900 text-white py-3 uppercase tracking-widest text-xs font-bold hover:bg-[var(--brand-accent)] transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Authenticating...' : 'Enter Admin Panel'}
                      </button>
                    </form>
                  </div>
                ) : (
                  /* AUTHENTICATED CONTROLS */
                  <div className="space-y-10">
                    
                    {/* Status Bar */}
                    <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-100 pb-4">
                      <span>Logged in as Admin</span>
                      <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-500">
                        <LogOut size={12} /> Sign Out
                      </button>
                    </div>

                    {/* Mode Selection */}
                    <section>
                      <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-4 font-bold flex items-center gap-2">
                        <LayoutTemplate size={14} /> View Mode
                      </h3>
                      <div className="flex gap-2">
                         <button 
                           onClick={() => setThemeMode('day')}
                           className={`flex-1 py-3 px-3 rounded flex items-center justify-center gap-2 text-xs font-semibold border transition-all ${themeMode === 'day' ? 'bg-amber-50 border-amber-400 text-amber-800' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-400'}`}
                         >
                           <Sun size={14} /> Day
                         </button>
                         <button 
                           onClick={() => setThemeMode('night')}
                           className={`flex-1 py-3 px-3 rounded flex items-center justify-center gap-2 text-xs font-semibold border transition-all ${themeMode === 'night' ? 'bg-stone-800 border-stone-600 text-white' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-400'}`}
                         >
                           <Moon size={14} /> Night
                         </button>
                         <button 
                           onClick={() => setThemeMode('unset')}
                           className={`flex-1 py-3 px-3 rounded flex items-center justify-center gap-2 text-xs font-semibold border transition-all ${themeMode === 'unset' ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-400'}`}
                         >
                           Default
                         </button>
                      </div>
                    </section>

                    {/* Color Section */}
                    <section>
                      <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-4 font-bold">Brand Accent</h3>
                      <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-lg border border-stone-100">
                        <input 
                          type="color" 
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-12 h-12 rounded border-0 cursor-pointer p-0 bg-transparent"
                        />
                        <div>
                          <p className="text-sm font-bold text-stone-700">Primary Gold</p>
                          <p className="text-xs font-mono text-stone-400 uppercase">{accentColor}</p>
                        </div>
                      </div>
                    </section>

                    {/* Aesthetics Section */}
                    <section>
                      <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-4 font-bold">Background Assets</h3>
                      
                      {/* Day Image */}
                      <div className="mb-6">
                        <label className="text-xs font-semibold text-stone-600 mb-2 flex justify-between">
                           <span>Day Setup</span>
                           {uploadingState === 'day' && <span className="text-[var(--brand-accent)] flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Uploading...</span>}
                        </label>
                        <div className="relative group w-full h-40 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shadow-sm">
                          <img src={dayImage} alt="Day Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <label className={`cursor-pointer bg-white text-stone-900 px-4 py-2 rounded shadow-lg text-xs uppercase tracking-wider font-bold hover:bg-[var(--brand-accent)] hover:text-white transition-colors flex items-center gap-2 ${uploadingState === 'day' ? 'pointer-events-none opacity-50' : ''}`}>
                              <UploadCloud size={14} /> Change Image
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'day')} disabled={uploadingState !== 'idle'}/>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Night Image */}
                      <div>
                        <label className="text-xs font-semibold text-stone-600 mb-2 flex justify-between">
                           <span>Night Setup</span>
                           {uploadingState === 'night' && <span className="text-[var(--brand-accent)] flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Uploading...</span>}
                        </label>
                        <div className="relative group w-full h-40 bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shadow-sm">
                          <img src={nightImage} alt="Night Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <label className={`cursor-pointer bg-white text-stone-900 px-4 py-2 rounded shadow-lg text-xs uppercase tracking-wider font-bold hover:bg-[var(--brand-accent)] hover:text-white transition-colors flex items-center gap-2 ${uploadingState === 'night' ? 'pointer-events-none opacity-50' : ''}`}>
                              <UploadCloud size={14} /> Change Image
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'night')} disabled={uploadingState !== 'idle'}/>
                            </label>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Actions */}
                    <div className="pt-8 border-t border-stone-100 space-y-4">
                      <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-4 rounded-sm shadow-lg text-xs uppercase tracking-widest font-bold hover:bg-[var(--brand-accent)] transition-all active:scale-95 disabled:opacity-50"
                      >
                         {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes to Live Site
                      </button>
                      
                      <button 
                        onClick={resetTheme}
                        className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-400 hover:text-red-500 transition-colors py-2"
                      >
                        <RotateCcw size={14} /> Reset to Defaults
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminPanel;