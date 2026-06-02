import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [contentBlocks, setContentBlocks] = useState<Record<string, string>>({});
  const [parsedContent, setParsedContent] = useState<Record<string, any>>({});
  const [editMode, setEditMode] = useState<'form' | 'json'>('form');
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
  
  // Project editing state
  const [editingProject, setEditingProject] = useState<any>(null);

  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsLoggedIn(true);
      fetchProjects();
      fetchContentBlocks();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error) {
      console.error(error);
      setLoginError(`Database Error: ${error.message} (Check RLS Policies)`);
    } else if (data) {
      setIsLoggedIn(true);
      localStorage.setItem('adminAuth', 'true');
      fetchProjects();
      fetchContentBlocks();
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminAuth');
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  const fetchContentBlocks = async () => {
    const { data } = await supabase.from('portfolio_content').select('*');
    if (data) {
      const blocks: Record<string, string> = {};
      const parsed: Record<string, any> = {};
      data.forEach(item => {
        blocks[item.id] = JSON.stringify(item.content, null, 2);
        parsed[item.id] = item.content;
      });
      setContentBlocks(blocks);
      setParsedContent(parsed);
    }
  };

  const updateParsedField = (sectionId: string, path: string[], value: any) => {
    setParsedContent(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy[sectionId]) copy[sectionId] = {};
      
      let current = copy[sectionId];
      for (let i = 0; i < path.length - 1; i++) {
        if (current[path[i]] === undefined) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      
      setContentBlocks(prevStr => ({
        ...prevStr,
        [sectionId]: JSON.stringify(copy[sectionId], null, 2)
      }));

      return copy;
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      try {
        await supabase.storage.createBucket('portfolio', {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
      } catch (bucketErr) {
        console.warn("Could not create/verify bucket, trying upload anyway:", bucketErr);
      }

      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Could not retrieve public URL for uploaded file.");
      }

      return publicUrlData.publicUrl;
    } catch (err: any) {
      console.warn("Supabase Storage upload failed, falling back to base64:", err);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error("Failed to read file as Base64"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImageId('about');
    try {
      const url = await uploadImage(file);
      updateParsedField('about', ['image'], url);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploadingImageId(null);
    }
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImageId('project');
    try {
      const url = await uploadImage(file);
      setEditingProject((prev: any) => ({ ...prev, image: url }));
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploadingImageId(null);
    }
  };

  const saveContentBlock = async (id: string) => {
    try {
      let payload;
      if (editMode === 'form') {
        payload = parsedContent[id];
      } else {
        payload = JSON.parse(contentBlocks[id]);
      }
      
      const { error } = await supabase.from('portfolio_content').upsert([{ id, content: payload }]);
      if (error) throw error;
      
      alert(`Saved ${id} successfully!`);
      fetchContentBlocks();
    } catch (err: any) {
      alert(`Failed to save content block: ${err.message || err}`);
    }
  };  const renderFormEditor = (id: string) => {
    switch (id) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/50 uppercase mb-1">Meta Line 1</label>
                <input 
                  type="text" 
                  value={parsedContent.hero?.meta1 || ''} 
                  onChange={e => updateParsedField('hero', ['meta1'], e.target.value)} 
                  className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase mb-1">Meta Line 2</label>
                <input 
                  type="text" 
                  value={parsedContent.hero?.meta2 || ''} 
                  onChange={e => updateParsedField('hero', ['meta2'], e.target.value)} 
                  className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase mb-1">Title Lines (up to 3)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {[0, 1, 2].map(i => (
                  <input 
                    key={i}
                    type="text" 
                    placeholder={`Line ${i + 1}`}
                    value={parsedContent.hero?.lines?.[i] || ''} 
                    onChange={e => {
                      const newLines = [...(parsedContent.hero?.lines || ['', '', ''])];
                      newLines[i] = e.target.value;
                      updateParsedField('hero', ['lines'], newLines);
                    }} 
                    className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase mb-1">Subtitle</label>
              <textarea 
                value={parsedContent.hero?.subtitle || ''} 
                onChange={e => updateParsedField('hero', ['subtitle'], e.target.value)} 
                className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white min-h-[80px] focus:border-white/40 outline-none resize-y"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase mb-2">Stats</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className="p-3 bg-black/40 rounded border border-white/10 space-y-2">
                    <span className="text-[10px] text-white/30 uppercase font-mono">Stat {i + 1}</span>
                    <input 
                      type="text" 
                      placeholder="Value (e.g. 8+)"
                      value={parsedContent.hero?.stats?.[i]?.value || ''} 
                      onChange={e => {
                        const newStats = [...(parsedContent.hero?.stats || [])];
                        if (!newStats[i]) newStats[i] = { value: '', label: '' };
                        newStats[i] = { ...newStats[i], value: e.target.value };
                        updateParsedField('hero', ['stats'], newStats);
                      }} 
                      className="w-full p-1.5 bg-black rounded border border-white/20 text-xs text-white focus:border-white/40 outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Label (e.g. Years)"
                      value={parsedContent.hero?.stats?.[i]?.label || ''} 
                      onChange={e => {
                        const newStats = [...(parsedContent.hero?.stats || [])];
                        if (!newStats[i]) newStats[i] = { value: '', label: '' };
                        newStats[i] = { ...newStats[i], label: e.target.value };
                        updateParsedField('hero', ['stats'], newStats);
                      }} 
                      className="w-full p-1.5 bg-black rounded border border-white/20 text-xs text-white focus:border-white/40 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 uppercase mb-1">Quote</label>
              <textarea 
                value={parsedContent.about?.quote || ''} 
                onChange={e => updateParsedField('about', ['quote'], e.target.value)} 
                className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white min-h-[80px] focus:border-white/40 outline-none resize-y"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase mb-1">Paragraphs</label>
              <div className="space-y-2">
                {[0, 1].map(i => (
                  <textarea 
                    key={i}
                    placeholder={`Paragraph ${i + 1}`}
                    value={parsedContent.about?.paragraphs?.[i] || ''} 
                    onChange={e => {
                      const newParas = [...(parsedContent.about?.paragraphs || ['', ''])];
                      newParas[i] = e.target.value;
                      updateParsedField('about', ['paragraphs'], newParas);
                    }} 
                    className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white min-h-[100px] focus:border-white/40 outline-none resize-y"
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-black/40 p-3 rounded border border-white/10">
              <div className="md:col-span-8 space-y-2">
                <label className="block text-xs text-white/50 uppercase">Profile Image Link or Upload</label>
                <input 
                  type="text" 
                  value={parsedContent.about?.image || ''} 
                  onChange={e => updateParsedField('about', ['image'], e.target.value)} 
                  placeholder="Image URL (e.g. https://...)"
                  className="w-full p-2 bg-black rounded border border-white/20 text-xs text-white focus:border-white/40 outline-none"
                />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleProfileImageUpload} 
                  className="w-full text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-white file:text-black hover:file:bg-white/80 cursor-pointer file:cursor-pointer"
                />
                {uploadingImageId === 'about' && <span className="text-[10px] text-emerald-400 block mt-1">Uploading image...</span>}
              </div>
              <div className="md:col-span-4 flex justify-center h-28 w-full overflow-hidden rounded bg-black/60 border border-white/10 relative">
                {parsedContent.about?.image ? (
                  <img src={parsedContent.about.image} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center text-[10px] text-white/20">No Image</div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase mb-1">Location / Status Text</label>
              <input 
                type="text" 
                value={parsedContent.about?.locationString || ''} 
                onChange={e => updateParsedField('about', ['locationString'], e.target.value)} 
                className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
              />
            </div>
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 uppercase mb-1">Skills (comma-separated)</label>
              <input 
                type="text" 
                value={Array.isArray(parsedContent.skills?.items) ? parsedContent.skills.items.join(', ') : ''} 
                onChange={e => {
                  const list = e.target.value.split(',').map(s => s.trim());
                  updateParsedField('skills', ['items'], list);
                }} 
                placeholder="React, TypeScript, Node.js, PostgreSQL"
                className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.isArray(parsedContent.skills?.items) && parsedContent.skills.items.map((skill: string, idx: number) => (
                <span key={idx} className="text-[10px] bg-white/10 px-2.5 py-1 rounded text-white/70">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      case 'process':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/50 uppercase mb-1">Headline</label>
                <input 
                  type="text" 
                  value={parsedContent.process?.headline || ''} 
                  onChange={e => updateParsedField('process', ['headline'], e.target.value)} 
                  className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase mb-1">Subtitle</label>
                <textarea 
                  value={parsedContent.process?.subtitle || ''} 
                  onChange={e => updateParsedField('process', ['subtitle'], e.target.value)} 
                  className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white min-h-[60px] focus:border-white/40 outline-none resize-y"
                />
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <label className="block text-xs text-white/50 uppercase font-semibold">Steps</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="p-3 bg-black/40 rounded border border-white/10 space-y-2">
                    <span className="text-[10px] text-emerald-400 font-mono">Step {parsedContent.process?.steps?.[i]?.number || `0${i + 1}`}</span>
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase mb-0.5">Title</label>
                      <input 
                        type="text" 
                        value={parsedContent.process?.steps?.[i]?.title || ''} 
                        onChange={e => {
                          const newSteps = [...(parsedContent.process?.steps || [])];
                          if (!newSteps[i]) newSteps[i] = { number: `0${i + 1}`, title: '', description: '' };
                          newSteps[i] = { ...newSteps[i], title: e.target.value };
                          updateParsedField('process', ['steps'], newSteps);
                        }} 
                        className="w-full p-1.5 bg-black rounded border border-white/20 text-xs text-white focus:border-white/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase mb-0.5">Description</label>
                      <textarea 
                        value={parsedContent.process?.steps?.[i]?.description || ''} 
                        onChange={e => {
                          const newSteps = [...(parsedContent.process?.steps || [])];
                          if (!newSteps[i]) newSteps[i] = { number: `0${i + 1}`, title: '', description: '' };
                          newSteps[i] = { ...newSteps[i], description: e.target.value };
                          updateParsedField('process', ['steps'], newSteps);
                        }} 
                        className="w-full p-1.5 bg-black rounded border border-white/20 text-xs text-white min-h-[50px] focus:border-white/40 outline-none resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 uppercase mb-1">Title Lines</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[0, 1].map(i => (
                  <input 
                    key={i}
                    type="text" 
                    placeholder={`Line ${i + 1}`}
                    value={parsedContent.contact?.lines?.[i] || ''} 
                    onChange={e => {
                      const newLines = [...(parsedContent.contact?.lines || ['', ''])];
                      newLines[i] = e.target.value;
                      updateParsedField('contact', ['lines'], newLines);
                    }} 
                    className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/50 uppercase mb-1">Highlight Word (e.g. GREAT.)</label>
                <input 
                  type="text" 
                  value={parsedContent.contact?.highlight || ''} 
                  onChange={e => updateParsedField('contact', ['highlight'], e.target.value)} 
                  className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase mb-1">Email</label>
                <input 
                  type="email" 
                  value={parsedContent.contact?.email || ''} 
                  onChange={e => updateParsedField('contact', ['email'], e.target.value)} 
                  className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase mb-1">Availability Status Text</label>
              <input 
                type="text" 
                value={parsedContent.contact?.availability || ''} 
                onChange={e => updateParsedField('contact', ['availability'], e.target.value)} 
                className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 uppercase mb-1">Message Description</label>
              <textarea 
                value={parsedContent.contact?.message || ''} 
                onChange={e => updateParsedField('contact', ['message'], e.target.value)} 
                className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white min-h-[60px] focus:border-white/40 outline-none resize-y"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-white/50 uppercase mb-1">GitHub URL</label>
                <input 
                  type="text" 
                  value={parsedContent.contact?.githubUrl || ''} 
                  onChange={e => updateParsedField('contact', ['githubUrl'], e.target.value)} 
                  className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase mb-1">LinkedIn URL</label>
                <input 
                  type="text" 
                  value={parsedContent.contact?.linkedinUrl || ''} 
                  onChange={e => updateParsedField('contact', ['linkedinUrl'], e.target.value)} 
                  className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase mb-1">Twitter / X URL</label>
                <input 
                  type="text" 
                  value={parsedContent.contact?.twitterUrl || ''} 
                  onChange={e => updateParsedField('contact', ['twitterUrl'], e.target.value)} 
                  className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                />
              </div>
            </div>
          </div>
        );
      case 'footer':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-white/50 uppercase mb-1">Brand Name</label>
                <input 
                  type="text" 
                  value={parsedContent.footer?.name || ''} 
                  onChange={e => updateParsedField('footer', ['name'], e.target.value)} 
                  className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase mb-1">Left Column Text</label>
                <input 
                  type="text" 
                  value={parsedContent.footer?.leftText || ''} 
                  onChange={e => updateParsedField('footer', ['leftText'], e.target.value)} 
                  className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase mb-1">Right Column Text</label>
                <input 
                  type="text" 
                  value={parsedContent.footer?.rightText || ''} 
                  onChange={e => updateParsedField('footer', ['rightText'], e.target.value)} 
                  className="w-full p-2 bg-black rounded border border-white/20 text-sm text-white focus:border-white/40 outline-none"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let tagsArray = editingProject.tags;
    if (typeof tagsArray === 'string') {
      tagsArray = tagsArray.split(',').map((t: string) => t.trim());
    }

    const payload = { ...editingProject, tags: tagsArray };
    
    if (payload.id) {
      await supabase.from('projects').update(payload).eq('id', payload.id);
    } else {
      await supabase.from('projects').insert([payload]);
    }
    setEditingProject(null);
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white/10 p-8 rounded-lg flex flex-col gap-4 w-96">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          {loginError && <p className="text-red-500">{loginError}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 bg-black text-white rounded border border-white/20"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 bg-black text-white rounded border border-white/20"
          />
          <button type="submit" className="bg-white text-black p-2 rounded mt-2 font-semibold">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10 pb-40">
      <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-5">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <a href="/" target="_blank" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition">View Site</a>
          <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition text-red-300">Logout</button>
        </div>
      </div>
      
      {/* 1. Page Content Editor */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Website Content</h2>
            <p className="text-white/50 text-sm mt-1">Edit the texts, sections, and locations shown on your site here.</p>
          </div>
          <div className="flex bg-white/5 p-1 rounded border border-white/10">
            <button 
              onClick={() => setEditMode('form')}
              className={`px-3 py-1.5 text-xs rounded transition-all ${editMode === 'form' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'}`}
            >
              Form Editor
            </button>
            <button 
              onClick={() => setEditMode('json')}
              className={`px-3 py-1.5 text-xs rounded transition-all ${editMode === 'json' ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'}`}
            >
              Raw JSON
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.entries(contentBlocks).map(([id, jsonString]) => (
            <div key={id} className="bg-white/5 p-6 rounded-lg border border-white/10 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium capitalize">{id} Section</h3>
                <button 
                  onClick={() => saveContentBlock(id)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded text-sm transition"
                >
                  Save Changes
                </button>
              </div>
              
              {editMode === 'form' ? (
                <div className="flex-1 bg-black/30 p-4 rounded border border-white/5 min-h-[300px]">
                  {renderFormEditor(id)}
                </div>
              ) : (
                <textarea
                  value={jsonString}
                  onChange={(e) => setContentBlocks({ ...contentBlocks, [id]: e.target.value })}
                  className="w-full flex-1 min-h-[300px] p-4 bg-black/50 text-white/90 font-mono text-sm rounded border border-white/10 outline-none focus:border-white/30 resize-y"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2. Projects Editor */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Portfolio Projects</h2>
          <button 
            onClick={() => setEditingProject({ title: '', category: '', year: '', description: '', image: '', tags: [] })}
            className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-white/90 transition"
          >
            + Add New Project
          </button>
        </div>

        {/* Project Editing Form */}
        {editingProject && (
          <div className="bg-white/10 p-6 rounded-lg border border-white/20 mb-8">
            <h3 className="text-xl font-medium mb-4">{editingProject.id ? 'Edit Project' : 'New Project'}</h3>
            <form onSubmit={saveProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Title (e.g. Meridian)" value={editingProject.title || ''} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="p-3 bg-black rounded border border-white/20 w-full" required />
              <input type="text" placeholder="Category (e.g. Web App)" value={editingProject.category || ''} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="p-3 bg-black rounded border border-white/20 w-full" required />
              <input type="text" placeholder="Year (e.g. 2024)" value={editingProject.year || ''} onChange={e => setEditingProject({...editingProject, year: e.target.value})} className="p-3 bg-black rounded border border-white/20 w-full" required />
              <input type="text" placeholder="Tags (comma separated: React, Tailwind)" value={Array.isArray(editingProject.tags) ? editingProject.tags.join(', ') : editingProject.tags || ''} onChange={e => setEditingProject({...editingProject, tags: e.target.value})} className="p-3 bg-black rounded border border-white/20 w-full" />
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-black/40 p-4 rounded border border-white/10">
                <div className="md:col-span-8 space-y-2">
                  <label className="block text-xs text-white/50 uppercase">Project Image Link or File Upload</label>
                  <input 
                    type="text" 
                    placeholder="Image URL (e.g. https://...)" 
                    value={editingProject.image || ''} 
                    onChange={e => setEditingProject({...editingProject, image: e.target.value})} 
                    className="p-3 bg-black rounded border border-white/20 w-full text-sm focus:border-white/40 outline-none" 
                  />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleProjectImageUpload} 
                    className="w-full text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-white/80 cursor-pointer file:cursor-pointer"
                  />
                  {uploadingImageId === 'project' && <span className="text-xs text-emerald-400 block mt-1">Uploading image...</span>}
                </div>
                <div className="md:col-span-4 flex justify-center h-28 w-full overflow-hidden rounded bg-black/60 border border-white/10 relative">
                  {editingProject.image ? (
                    <img src={editingProject.image} alt="Project Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center text-xs text-white/20">No Image Selected</div>
                  )}
                </div>
              </div>

              <textarea placeholder="Description" value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="p-3 bg-black rounded border border-white/20 w-full md:col-span-2 min-h-[100px]" required />
              
              <div className="md:col-span-2 flex gap-4 mt-2">
                <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded font-semibold hover:bg-emerald-500">Save Project</button>
                <button type="button" onClick={() => setEditingProject(null)} className="bg-white/10 text-white px-6 py-2 rounded font-semibold hover:bg-white/20">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden flex flex-col">
              <div className="h-48 overflow-hidden bg-black/50">
                {project.image && <img src={project.image} alt={project.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-medium mb-1">{project.title} <span className="text-white/30 text-sm ml-2">{project.year}</span></h3>
                <p className="text-white/50 text-sm mb-4 flex-1">{project.description}</p>
                
                <div className="flex gap-2 mb-4 flex-wrap">
                  {project.tags?.map((tag: string) => (
                    <span key={tag} className="text-[10px] bg-white/10 px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <button onClick={() => setEditingProject(project)} className="text-emerald-400 hover:text-emerald-300 text-sm">Edit</button>
                  <button onClick={() => deleteProject(project.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p className="text-white/50">No projects found in database.</p>}
        </div>
      </section>
    </div>
  );
}
