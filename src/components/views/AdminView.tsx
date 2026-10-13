import React, { useState, useEffect } from 'react';
import { User, Game, Bookmark, UpdateLog, FriendMessage } from '../../types';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  Ban,
  CheckCircle2,
  Globe,
  Sparkles,
  RefreshCw,
  Edit,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  Search,
  MessageSquare,
  Lock,
  Unlock,
  Layers,
  Gamepad2,
  ExternalLink,
} from 'lucide-react';

interface AdminViewProps {
  currentUser: User | null;
  onRefreshGames: () => void;
  onRefreshBookmarks: () => void;
  onRefreshUpdates: () => void;
  onLaunchFramer: (url: string, title: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  onRefreshGames,
  onRefreshBookmarks,
  onRefreshUpdates,
  onLaunchFramer,
}) => {
  const [activeTab, setActiveTab] = useState<'games' | 'users' | 'messages' | 'bookmarks' | 'updates'>('games');
  
  // Games state
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [gameSearch, setGameSearch] = useState('');
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [newGameModalOpen, setNewGameModalOpen] = useState(false);

  // New/Edit Game Form
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formCover, setFormCover] = useState('');
  const [formCategory, setFormCategory] = useState('Arcade');
  const [formPlace, setFormPlace] = useState<'top' | 'bottom'>('top');

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [selectedUserToBan, setSelectedUserToBan] = useState<User | null>(null);

  // Messages Moderation state
  const [messages, setMessages] = useState<FriendMessage[]>([]);

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bmTitle, setBmTitle] = useState('');
  const [bmUrl, setBmUrl] = useState('');
  const [bmIcon, setBmIcon] = useState('🌐');
  const [bmPinned, setBmPinned] = useState(false);

  // Updates state
  const [updates, setUpdates] = useState<UpdateLog[]>([]);
  const [upVersion, setUpVersion] = useState('v2.2');
  const [upTitle, setUpTitle] = useState('');
  const [upCategory, setUpCategory] = useState<'Feature' | 'Games' | 'Improvements' | 'Fix'>('Feature');
  const [upContent, setUpContent] = useState('');

  const [statusMessage, setStatusMessage] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllGames();
      fetchUsers();
      fetchMessages();
      fetchBookmarks();
      fetchUpdates();
    }
  }, [isAdmin]);

  const fetchAllGames = async () => {
    try {
      const res = await fetch('/api/games');
      const data = await res.json();
      if (res.ok && data.games) {
        setAllGames(data.games);
      }
    } catch {
      // Ignored
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'x-admin-email': currentUser?.email || '' },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
    } catch {
      // Ignored
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { 'x-admin-email': currentUser?.email || '' },
      });
      const data = await res.json();
      if (res.ok) setMessages(data.messages || []);
    } catch {
      // Ignored
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await fetch('/api/bookmarks');
      const data = await res.json();
      if (res.ok) setBookmarks(data.bookmarks || []);
    } catch {
      // Ignored
    }
  };

  const fetchUpdates = async () => {
    try {
      const res = await fetch('/api/updates');
      const data = await res.json();
      if (res.ok) setUpdates(data.updates || []);
    } catch {
      // Ignored
    }
  };

  // ==================== GAMES SUPER-CONTROL ====================

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUrl.trim()) return;

    try {
      if (editingGame) {
        // Edit existing game
        const res = await fetch(`/api/admin/games/${editingGame.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-email': currentUser?.email || '',
          },
          body: JSON.stringify({
            name: formName.trim(),
            url: formUrl.trim(),
            cover: formCover.trim(),
            category: formCategory.trim(),
            place: formPlace,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update game.');

        showStatus(`Updated "${formName}"!`);
        setEditingGame(null);
      } else {
        // Add new game
        const res = await fetch('/api/admin/games', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-email': currentUser?.email || '',
          },
          body: JSON.stringify({
            name: formName.trim(),
            url: formUrl.trim(),
            cover: formCover.trim(),
            category: formCategory.trim(),
            place: formPlace,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to add game.');

        showStatus(`Added "${formName}" to portal!`);
        setNewGameModalOpen(false);
      }

      setFormName('');
      setFormUrl('');
      setFormCover('');
      await fetchAllGames();
      onRefreshGames();
    } catch (err: any) {
      alert(err.message || 'Error saving game.');
    }
  };

  const handleDeleteGame = async (gameId: string | number, name?: string) => {
    if (!confirm(`Are you sure you want to unadd/remove "${name || 'this game'}" from the website?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/games/${gameId}`, {
        method: 'DELETE',
        headers: { 'x-admin-email': currentUser?.email || '' },
      });
      if (res.ok) {
        showStatus(`Removed game "${name || gameId}"`);
        await fetchAllGames();
        onRefreshGames();
      }
    } catch {
      // Ignored
    }
  };

  const handleReorderGame = async (gameId: string | number, direction: 'top' | 'up' | 'down') => {
    try {
      const res = await fetch('/api/admin/games/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': currentUser?.email || '',
        },
        body: JSON.stringify({ gameId, direction }),
      });
      if (res.ok) {
        showStatus(`Moved game position (${direction})`);
        await fetchAllGames();
        onRefreshGames();
      }
    } catch {
      // Ignored
    }
  };

  const openEditModal = (game: Game) => {
    setEditingGame(game);
    setFormName(game.name || game.title || '');
    setFormUrl(game.url || game.embedUrl || '');
    setFormCover(game.cover || game.thumbnail || '');
    setFormCategory(game.category || 'Arcade');
    setFormPlace('top');
  };

  // ==================== USER CONTROLS & MESSAGING TRUST ====================

  const handleToggleTrust = async (userId: string, currentTrust?: boolean) => {
    try {
      const res = await fetch('/api/admin/users/trust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': currentUser?.email || '',
        },
        body: JSON.stringify({ userId, canMessage: !currentTrust }),
      });
      if (res.ok) {
        showStatus(!currentTrust ? 'Granted messaging trust!' : 'Revoked messaging trust.');
        await fetchUsers();
      }
    } catch {
      // Ignored
    }
  };

  const handleToggleRole = async (userId: string, currentRole: 'admin' | 'user') => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': currentUser?.email || '',
        },
        body: JSON.stringify({ userId, role: nextRole }),
      });
      if (res.ok) {
        showStatus(`Updated user role to ${nextRole}`);
        await fetchUsers();
      }
    } catch {
      // Ignored
    }
  };

  const handleBanUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserToBan) return;

    try {
      const res = await fetch('/api/admin/users/ban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': currentUser?.email || '',
        },
        body: JSON.stringify({
          userId: selectedUserToBan.id,
          banned: true,
          reason: banReason || 'Community policy violation',
        }),
      });
      if (res.ok) {
        showStatus(`Suspended ${selectedUserToBan.username}`);
        setSelectedUserToBan(null);
        setBanReason('');
        await fetchUsers();
      }
    } catch {
      // Ignored
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/users/ban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': currentUser?.email || '',
        },
        body: JSON.stringify({ userId, banned: false }),
      });
      if (res.ok) {
        showStatus('User unsuspended');
        await fetchUsers();
      }
    } catch {
      // Ignored
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Delete user account "${username}" completely?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'x-admin-email': currentUser?.email || '' },
      });
      if (res.ok) {
        showStatus(`Deleted user ${username}`);
        await fetchUsers();
      }
    } catch {
      // Ignored
    }
  };

  // ==================== MESSAGE MODERATION ====================

  const handleDeleteMessage = async (msgId: string) => {
    try {
      const res = await fetch(`/api/admin/messages/${msgId}`, {
        method: 'DELETE',
        headers: { 'x-admin-email': currentUser?.email || '' },
      });
      if (res.ok) {
        showStatus('Message removed from portal.');
        await fetchMessages();
      }
    } catch {
      // Ignored
    }
  };

  // ==================== BOOKMARKS & UPDATES ====================

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bmTitle || !bmUrl) return;

    try {
      const res = await fetch('/api/admin/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': currentUser?.email || '',
        },
        body: JSON.stringify({ title: bmTitle, url: bmUrl, icon: bmIcon, pinned: bmPinned }),
      });
      if (res.ok) {
        showStatus('Global bookmark added!');
        setBmTitle('');
        setBmUrl('');
        await fetchBookmarks();
        onRefreshBookmarks();
      }
    } catch {
      // Ignored
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/bookmarks/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-email': currentUser?.email || '' },
      });
      if (res.ok) {
        showStatus('Bookmark deleted');
        await fetchBookmarks();
        onRefreshBookmarks();
      }
    } catch {
      // Ignored
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upVersion || !upTitle) return;

    try {
      const res = await fetch('/api/admin/updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': currentUser?.email || '',
        },
        body: JSON.stringify({
          version: upVersion,
          title: upTitle,
          category: upCategory,
          content: upContent.split('\n').filter(Boolean),
        }),
      });
      if (res.ok) {
        showStatus('Published portal update!');
        setUpTitle('');
        setUpContent('');
        await fetchUpdates();
        onRefreshUpdates();
      }
    } catch {
      // Ignored
    }
  };

  const handleDeleteUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/updates/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-email': currentUser?.email || '' },
      });
      if (res.ok) {
        showStatus('Update log removed');
        await fetchUpdates();
        onRefreshUpdates();
      }
    } catch {
      // Ignored
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 rounded-3xl liquid-glass text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold">Admin Deck Access Restricted</h2>
        <p className="text-xs text-stone-500">
          This panel is reserved for the website owner (alxx3433@gmail.com). Please sign in with administrator credentials.
        </p>
      </div>
    );
  }

  const filteredAdminGames = allGames.filter((g) => {
    const q = gameSearch.toLowerCase();
    return (
      (g.name || g.title || '').toLowerCase().includes(q) ||
      (g.category || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-[1720px] mx-auto px-3 sm:px-6 py-6 pb-28 text-stone-900 dark:text-stone-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500 text-stone-950 font-extrabold shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">ALXX Super-Admin Deck</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                Master Control
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Complete oversight: Add/unadd/edit games, reorder places, grant friend messaging trust, moderate messages, and publish updates.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-lg animate-bounce">
            {statusMessage}
          </div>
        )}
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-black/10 dark:border-white/10">
        {[
          { id: 'games' as const, label: `🎮 Games Command (${allGames.length})` },
          { id: 'users' as const, label: `👥 User Accounts (${users.length})` },
          { id: 'messages' as const, label: `💬 Chat Moderation (${messages.length})` },
          { id: 'bookmarks' as const, label: `📌 Global Apps (${bookmarks.length})` },
          { id: 'updates' as const, label: `📰 Updates Logs (${updates.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'liquid-glass hover:bg-black/10 text-stone-600 dark:text-stone-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: GAMES COMMAND CENTER ================= */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          {/* Top Actions: Search + Add Game Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl liquid-glass border border-white/20">
            <div className="relative flex items-center bg-black/5 dark:bg-white/10 rounded-xl px-3 py-2 text-xs w-full sm:w-96">
              <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
              <input
                type="text"
                value={gameSearch}
                onChange={(e) => setGameSearch(e.target.value)}
                placeholder="Search games to edit, place, or unadd..."
                className="w-full bg-transparent text-xs focus:outline-none placeholder-stone-400"
              />
              {gameSearch && (
                <button onClick={() => setGameSearch('')} className="text-xs text-stone-400">
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setEditingGame(null);
                setFormName('');
                setFormUrl('');
                setFormCover('');
                setFormCategory('Arcade');
                setFormPlace('top');
                setNewGameModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 shadow-md transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Game</span>
            </button>
          </div>

          {/* Games Table List */}
          <div className="rounded-3xl liquid-glass border border-black/10 dark:border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/10 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-stone-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3 w-12 text-center">#</th>
                    <th className="p-3 w-16">Cover</th>
                    <th className="p-3">Title / Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">URL / Stream</th>
                    <th className="p-3 text-center">Place Position</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {filteredAdminGames.slice(0, 150).map((game, index) => (
                    <tr key={game.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3 text-center font-mono text-stone-400 text-[10px]">
                        {index + 1}
                      </td>
                      <td className="p-3">
                        <img
                          src={game.cover || game.thumbnail || ''}
                          alt={game.name}
                          className="w-10 h-10 rounded-xl object-cover bg-stone-800"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </td>
                      <td className="p-3 font-bold truncate max-w-xs">
                        <span>{game.name || game.title}</span>
                        {game.isCustom && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[9px] font-bold">
                            Custom
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-[11px] font-medium">
                          {game.category || 'Arcade'}
                        </span>
                      </td>
                      <td className="p-3 truncate max-w-xs text-stone-400 font-mono text-[11px]">
                        {game.url || game.embedUrl}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleReorderGame(game.id, 'top')}
                            className="p-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-amber-500 hover:text-stone-950 transition-colors"
                            title="Move to Top spot (#1)"
                          >
                            <ArrowUpToLine className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReorderGame(game.id, 'up')}
                            className="p-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-amber-500 hover:text-stone-950 transition-colors"
                            title="Move Up 1 spot"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReorderGame(game.id, 'down')}
                            className="p-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-amber-500 hover:text-stone-950 transition-colors"
                            title="Move Down 1 spot"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(game)}
                            className="p-1.5 rounded-xl bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 font-bold transition-colors"
                            title="Edit Game name, url, cover"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGame(game.id, game.name || game.title)}
                            className="p-1.5 rounded-xl bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 font-bold transition-colors"
                            title="Unadd / Delete Game"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAdminGames.length > 150 && (
              <div className="p-3 text-center text-xs text-stone-400 bg-black/5 dark:bg-white/5">
                Showing first 150 of {filteredAdminGames.length} games. Use search above to find any game instantly.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: USER ACCOUNTS & MESSAGING TRUST ================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl liquid-glass border border-white/20 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold">User Accounts & Trust Permissions</h2>
              <p className="text-[11px] text-stone-400">
                You have master authority to grant or revoke Direct Messaging trust, promote admins, or ban rule violators.
              </p>
            </div>
            <button
              onClick={fetchUsers}
              className="p-2 rounded-xl liquid-glass hover:bg-black/10 text-stone-400 hover:text-white transition-colors"
              title="Refresh Users"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-3xl liquid-glass border border-black/10 dark:border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/10 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-stone-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Messaging Trust</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                          {u.username.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{u.username}</span>
                      </td>
                      <td className="p-3 text-stone-400 font-mono text-[11px]">{u.email}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                            u.role === 'admin'
                              ? 'bg-amber-500 text-stone-950 shadow-sm'
                              : 'bg-black/5 dark:bg-white/10 text-stone-400 hover:text-white'
                          }`}
                        >
                          {u.role}
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleTrust(u.id, u.canMessage)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                            u.role === 'admin' || u.canMessage
                              ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-500 border border-rose-500/30 hover:bg-emerald-500/20 hover:text-emerald-500'
                          }`}
                          title="Click to toggle messaging permission"
                        >
                          {u.role === 'admin' || u.canMessage ? (
                            <>
                              <Unlock className="w-3 h-3" />
                              <span>Trusted (Can Chat)</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>Restricted (Click to Trust)</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        {u.banned ? (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 text-[10px] font-bold">
                            Banned
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.banned ? (
                            <button
                              onClick={() => handleUnbanUser(u.id)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 text-xs font-bold"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedUserToBan(u)}
                              className="p-1.5 rounded-xl bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 font-bold"
                              title="Ban User"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            className="p-1.5 rounded-xl bg-stone-500/20 text-stone-400 hover:text-rose-500 font-bold"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CHAT MODERATION ================= */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl liquid-glass border border-white/20 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold">Live Portal Chat Moderation</h2>
              <p className="text-[11px] text-stone-400">
                Inspect all recent messages exchanged between users. Inappropriate messages with slurs are highlighted and can be purged.
              </p>
            </div>
            <button
              onClick={fetchMessages}
              className="p-2 rounded-xl liquid-glass hover:bg-black/10 text-stone-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-3xl liquid-glass border border-black/10 dark:border-white/10 overflow-hidden shadow-2xl p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-500 text-xs">{msg.fromUsername}</span>
                    <span className="text-[10px] text-stone-400">➔</span>
                    <span className="font-bold text-stone-300 text-xs">{msg.toUsername}</span>
                    <span className="text-[10px] text-stone-500">({msg.timestamp})</span>
                    {msg.isBlurred && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[9px] font-bold">
                        Slur Detected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-200">
                    {msg.content}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  className="p-2 rounded-xl bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 transition-colors"
                  title="Purge Message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-16 text-stone-400 text-xs">
                No chat messages recorded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: GLOBAL BOOKMARKS ================= */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-6">
          <form onSubmit={handleAddBookmark} className="p-4 rounded-3xl liquid-glass border border-white/20 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              required
              value={bmTitle}
              onChange={(e) => setBmTitle(e.target.value)}
              placeholder="Title (e.g. Desmos)"
              className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs focus:outline-none"
            />
            <input
              type="text"
              required
              value={bmUrl}
              onChange={(e) => setBmUrl(e.target.value)}
              placeholder="URL (https://...)"
              className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs focus:outline-none"
            />
            <input
              type="text"
              value={bmIcon}
              onChange={(e) => setBmIcon(e.target.value)}
              placeholder="Icon/Emoji (e.g. 📊)"
              className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 shadow"
            >
              Add Global App
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="p-3 rounded-2xl liquid-card flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-lg">{bm.icon}</span>
                  <div className="truncate">
                    <h4 className="font-bold text-xs truncate">{bm.title}</h4>
                    <span className="text-[10px] text-stone-400 truncate block">{bm.url}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteBookmark(bm.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: UPDATES & CHANGELOGS ================= */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          <form onSubmit={handleAddUpdate} className="p-4 rounded-3xl liquid-glass border border-white/20 space-y-3">
            <h3 className="font-bold text-xs">Publish Portal Update / News</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={upVersion}
                onChange={(e) => setUpVersion(e.target.value)}
                placeholder="Version (e.g. v2.2)"
                className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs focus:outline-none"
              />
              <input
                type="text"
                required
                value={upTitle}
                onChange={(e) => setUpTitle(e.target.value)}
                placeholder="Title (e.g. Chat & Games Update)"
                className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs focus:outline-none sm:col-span-2"
              />
            </div>
            <textarea
              rows={3}
              value={upContent}
              onChange={(e) => setUpContent(e.target.value)}
              placeholder="Bullet points (one per line)..."
              className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs focus:outline-none resize-none"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 shadow"
            >
              Publish Update Log
            </button>
          </form>

          <div className="space-y-3">
            {updates.map((up) => (
              <div key={up.id} className="p-4 rounded-2xl liquid-card flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-amber-500">{up.version}</span>
                    <h4 className="font-bold text-xs">{up.title}</h4>
                    <span className="text-[10px] text-stone-400">({up.date})</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-stone-400 space-y-0.5">
                    {up.content.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleDeleteUpdate(up.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT GAME ================= */}
      {(newGameModalOpen || editingGame) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl liquid-glass border border-white/20 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold">
              {editingGame ? `Edit Game: ${editingGame.name || editingGame.title}` : 'Add New Game to Portal'}
            </h3>

            <form onSubmit={handleSaveGame} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                  Game Name / Title
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Subway Surfers Web"
                  className="w-full px-3 py-2 rounded-xl bg-black/10 dark:bg-white/10 border border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                  Playable Game URL (Web URL or Iframe Stream)
                </label>
                <input
                  type="text"
                  required
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://... or /api/proxy/vc"
                  className="w-full px-3 py-2 rounded-xl bg-black/10 dark:bg-white/10 border border-white/10 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                  Cover / Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={formCover}
                  onChange={(e) => setFormCover(e.target.value)}
                  placeholder="https://... image url"
                  className="w-full px-3 py-2 rounded-xl bg-black/10 dark:bg-white/10 border border-white/10 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/10 focus:outline-none text-white"
                  >
                    <option value="Arcade">Arcade</option>
                    <option value="Action">Action</option>
                    <option value="Driving">Driving</option>
                    <option value="Sports">Sports</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Retro">Retro</option>
                    <option value="Multiplayer">Multiplayer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
                    Placement Spot
                  </label>
                  <select
                    value={formPlace}
                    onChange={(e) => setFormPlace(e.target.value as 'top' | 'bottom')}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/10 focus:outline-none text-white"
                  >
                    <option value="top">Top of catalog (#1 Featured)</option>
                    <option value="bottom">Bottom of catalog</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 font-bold text-stone-950 hover:bg-amber-400 shadow"
                >
                  {editingGame ? 'Save Changes' : 'Publish Game'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewGameModalOpen(false);
                    setEditingGame(null);
                  }}
                  className="px-4 py-2.5 rounded-xl liquid-glass hover:bg-black/10 font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: BAN USER ================= */}
      {selectedUserToBan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl liquid-glass border border-white/20 p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-rose-500">
              Suspend / Ban {selectedUserToBan.username}
            </h3>
            <form onSubmit={handleBanUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase text-stone-400 mb-1">
                  Reason for Suspension
                </label>
                <input
                  type="text"
                  required
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="e.g. Profanity in messages or exam disruption"
                  className="w-full px-3 py-2 rounded-xl bg-black/10 dark:bg-white/10 border border-white/10 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 shadow"
                >
                  Confirm Ban
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUserToBan(null)}
                  className="px-4 py-2 rounded-xl liquid-glass font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
