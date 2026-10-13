import React, { useState, useEffect } from 'react';
import { User, FriendMessage, FriendRequest, GroupChat, GroupMessage, FriendsSettings } from '../../types';
import {
  Users,
  MessageSquare,
  UserPlus,
  Send,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Lock,
  Sparkles,
  Search,
  Plus,
  Check,
  X,
  Settings,
  Bell,
  Volume2,
  VolumeX,
  Circle,
  Hash,
  UserCheck,
} from 'lucide-react';

interface FriendsViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({
  currentUser,
  onOpenAuth,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'chats' | 'groups' | 'requests' | 'settings'>('chats');

  // Friends & Chats state
  const [friends, setFriends] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [messages, setMessages] = useState<FriendMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');

  // Groups state
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupChat | null>(null);
  const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);
  const [groupMessageInput, setGroupMessageInput] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [selectedGroupMemberIds, setSelectedGroupMemberIds] = useState<string[]>([]);

  // Requests state
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [addUsernameInput, setAddUsernameInput] = useState('');

  // Friends Settings state
  const [friendsSettings, setFriendsSettings] = useState<FriendsSettings>(() => {
    try {
      const saved = localStorage.getItem('alxx_friends_settings');
      return saved
        ? JSON.parse(saved)
        : {
            filterMode: 'blur',
            allowRequests: true,
            onlineStatus: 'online',
            soundAlerts: true,
          };
    } catch {
      return {
        filterMode: 'blur',
        allowRequests: true,
        onlineStatus: 'online',
        soundAlerts: true,
      };
    }
  });

  const [unblurredIds, setUnblurredIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const isTrusted = currentUser?.role === 'admin' || Boolean(currentUser?.canMessage);

  // Load friends
  const loadFriends = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/friends?userId=${currentUser.id}`);
      const data = await res.json();
      if (res.ok && data.friends) {
        setFriends(data.friends);
        if (!selectedFriend && data.friends.length > 0) {
          setSelectedFriend(data.friends[0]);
        }
      }
    } catch {
      // Ignored
    }
  };

  // Load groups
  const loadGroups = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/groups?userId=${currentUser.id}`);
      const data = await res.json();
      if (res.ok && data.groups) {
        setGroups(data.groups);
      }
    } catch {
      // Ignored
    }
  };

  // Load requests
  const loadRequests = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/friends/requests?userId=${currentUser.id}`);
      const data = await res.json();
      if (res.ok) {
        setIncomingRequests(data.incoming || []);
        setOutgoingRequests(data.outgoing || []);
      }
    } catch {
      // Ignored
    }
  };

  // Load direct messages
  const loadMessages = async () => {
    if (!currentUser || !selectedFriend) return;
    try {
      const res = await fetch(
        `/api/messages?userId=${currentUser.id}&targetUserId=${selectedFriend.id}`
      );
      const data = await res.json();
      if (res.ok && data.messages) {
        setMessages(data.messages);
      }
    } catch {
      // Ignored
    }
  };

  // Load group messages
  const loadGroupMessages = async () => {
    if (!currentUser || !selectedGroup) return;
    try {
      const res = await fetch(`/api/groups/${selectedGroup.id}/messages`);
      const data = await res.json();
      if (res.ok && data.messages) {
        setGroupMessages(data.messages);
      }
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    loadFriends();
    loadGroups();
    loadRequests();
  }, [currentUser]);

  useEffect(() => {
    if (selectedFriend && activeTab === 'chats') {
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedFriend, activeTab]);

  useEffect(() => {
    if (selectedGroup && activeTab === 'groups') {
      loadGroupMessages();
      const interval = setInterval(loadGroupMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedGroup, activeTab]);

  const showStatus = (text: string, type: 'success' | 'error') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  // Send Direct Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedFriend || !messageInput.trim() || loading) return;

    const content = messageInput.trim();
    setMessageInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: currentUser.id,
          toUserId: selectedFriend.id,
          content,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showStatus(data.error || 'Failed to send message.', 'error');
      } else {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err: any) {
      showStatus(err.message || 'Error communicating with server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Send Group Message
  const handleSendGroupMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedGroup || !groupMessageInput.trim() || loading) return;

    const content = groupMessageInput.trim();
    setGroupMessageInput('');
    setLoading(true);

    try {
      const res = await fetch(`/api/groups/${selectedGroup.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: currentUser.id,
          content,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showStatus(data.error || 'Failed to send group message.', 'error');
      } else {
        setGroupMessages((prev) => [...prev, data.message]);
      }
    } catch (err: any) {
      showStatus(err.message || 'Network error sending group message.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Send Friend Request
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !addUsernameInput.trim() || loading) return;

    const username = addUsernameInput.trim();
    setLoading(true);

    try {
      const res = await fetch('/api/friends/request/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: currentUser.id,
          toUsername: username,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showStatus(data.error || 'Failed to send friend request.', 'error');
      } else {
        showStatus(`Friend request sent to @${username}!`, 'success');
        setAddUsernameInput('');
        loadRequests();
      }
    } catch (err: any) {
      showStatus(err.message || 'Error sending friend request.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Respond to Friend Request
  const handleRespondRequest = async (requestId: string, action: 'accept' | 'decline') => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/friends/request/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          action,
          userId: currentUser.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showStatus(`Request ${action}ed!`, 'success');
        loadRequests();
        loadFriends();
      } else {
        showStatus(data.error || 'Failed to respond.', 'error');
      }
    } catch (err: any) {
      showStatus(err.message || 'Network error.', 'error');
    }
  };

  // Create New Group Chat
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newGroupName.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/groups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGroupName.trim(),
          description: newGroupDesc.trim(),
          createdBy: currentUser.id,
          memberIds: selectedGroupMemberIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showStatus(data.error || 'Failed to create group.', 'error');
      } else {
        showStatus(`Group "${data.group.name}" created!`, 'success');
        setNewGroupName('');
        setNewGroupDesc('');
        setSelectedGroupMemberIds([]);
        setShowCreateGroup(false);
        loadGroups();
        setSelectedGroup(data.group);
        setActiveTab('groups');
      }
    } catch (err: any) {
      showStatus(err.message || 'Error creating group.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = (newVals: Partial<FriendsSettings>) => {
    const updated = { ...friendsSettings, ...newVals };
    setFriendsSettings(updated);
    localStorage.setItem('alxx_friends_settings', JSON.stringify(updated));
    showStatus('Settings updated!', 'success');
  };

  const toggleUnblur = (id: string) => {
    setUnblurredIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter((f) =>
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-stone-900 dark:text-stone-100">
        <div className="p-8 rounded-3xl liquid-card space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black">Social & Study Lounges</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            Connect with classmates, collaborate in group study chats, and share bookmarks. Sign in to start messaging!
          </p>
          <button
            onClick={onOpenAuth}
            className="px-6 py-2.5 rounded-2xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md"
          >
            Sign In or Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-28 text-stone-900 dark:text-stone-100 flex flex-col h-[calc(100vh-6rem)] min-h-[620px]">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl liquid-glass text-amber-500 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Friends & Social</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Direct chats, group lounges, friend requests, and student-safe slurs blur.
            </p>
          </div>
        </div>

        {/* Top Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl liquid-glass shadow-sm self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chats'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chats ({friends.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'groups'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Groups ({groups.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'requests'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Requests</span>
            {incomingRequests.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`p-1.5 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Friends Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Global Status Banner */}
      {statusMsg && (
        <div
          className={`mt-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="text-xs opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Trust Notice if user is unverified */}
      {!isTrusted && (
        <div className="mt-2 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-500 font-medium">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            <span>
              Messaging locked for new accounts. Admin (<span className="font-bold">alxx</span>) must grant trust access before you can send messages.
            </span>
          </div>
        </div>
      )}

      {/* ================= TAB 1: 1-ON-1 DIRECT CHATS ================= */}
      {activeTab === 'chats' && (
        <div className="flex-1 flex flex-col md:flex-row gap-4 mt-3 overflow-hidden">
          {/* Left: Friends & Search List */}
          <div className="w-full md:w-72 flex flex-col liquid-card rounded-3xl p-3 shrink-0">
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search friends..."
                className="w-full bg-black/5 dark:bg-white/5 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Friends Scroll Feed */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredFriends.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFriend(f)}
                  className={`w-full p-2 rounded-2xl text-left flex items-center justify-between transition-all ${
                    selectedFriend?.id === f.id
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                      {f.username[0]?.toUpperCase()}
                      <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 border border-white dark:border-stone-900" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs truncate">{f.username}</div>
                      <div className="text-[10px] opacity-70 truncate">
                        {f.role === 'admin' ? 'Administrator' : 'Classmate'}
                      </div>
                    </div>
                  </div>
                  {f.role === 'admin' && (
                    <span className="px-1.5 py-0.5 rounded-md bg-stone-900 text-amber-400 text-[9px] font-mono">
                      ADMIN
                    </span>
                  )}
                </button>
              ))}

              {filteredFriends.length === 0 && (
                <div className="text-center py-8 text-stone-400 text-xs">
                  {friends.length === 0 ? 'No friends added yet. Open Requests to add!' : 'No match found.'}
                </div>
              )}
            </div>
          </div>

          {/* Right: Active Conversation Deck */}
          <div className="flex-1 flex flex-col liquid-card rounded-3xl p-4 overflow-hidden">
            {selectedFriend ? (
              <>
                {/* Chat Top Banner */}
                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-black flex items-center justify-center text-sm shadow-md">
                      {selectedFriend.username[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">
                        @{selectedFriend.username}
                      </h3>
                      <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
                        <Circle className="w-1.5 h-1.5 fill-current" /> Active now
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-500 text-[10px] font-bold">
                    🛡️ Slurs Blur Active
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
                  {messages.map((m) => {
                    const isMe = m.fromUserId === currentUser.id;
                    const isBlurred = m.isBlurred && !unblurredIds.includes(m.id);

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                      >
                        <div className="text-[10px] text-stone-400 px-1 font-semibold">
                          {isMe ? 'You' : m.fromUsername} · {m.timestamp}
                        </div>

                        <div
                          className={`relative max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-xs shadow-md'
                              : 'bg-black/5 dark:bg-white/10 text-stone-900 dark:text-stone-100 rounded-tl-xs shadow-sm'
                          }`}
                        >
                          {/* Content with Blur or Reveal */}
                          {isBlurred ? (
                            <div className="flex items-center gap-2">
                              <span className="filter blur-sm select-none">
                                {m.maskedContent || m.content}
                              </span>
                              <button
                                onClick={() => toggleUnblur(m.id)}
                                className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-white flex items-center gap-1 font-bold shrink-0 hover:bg-black/60"
                                title="Click to reveal flagged content"
                              >
                                <Eye className="w-2.5 h-2.5" /> Unblur
                              </button>
                            </div>
                          ) : (
                            <span>{m.content}</span>
                          )}

                          {m.isBlurred && unblurredIds.includes(m.id) && (
                            <button
                              onClick={() => toggleUnblur(m.id)}
                              className="ml-2 text-[10px] opacity-70 hover:opacity-100 underline"
                              title="Re-blur"
                            >
                              Blur
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {messages.length === 0 && (
                    <div className="text-center py-20 text-stone-400 text-xs">
                      Say hello to @{selectedFriend.username}! Messages are end-to-end moderated.
                    </div>
                  )}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendMessage} className="pt-2 shrink-0">
                  <div className="flex items-center gap-2 liquid-glass rounded-2xl p-1.5 border border-black/10 dark:border-white/10">
                    <input
                      type="text"
                      disabled={!isTrusted}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder={
                        isTrusted
                          ? `Message @${selectedFriend.username}...`
                          : 'Messaging locked (requires admin trust)...'
                      }
                      className="flex-1 bg-transparent px-3 py-1.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!isTrusted || !messageInput.trim() || loading}
                      className="p-2 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 disabled:opacity-40 transition-all shadow-md shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400 text-xs">
                <Users className="w-10 h-10 mb-2 opacity-50" />
                <span>Select a friend on the left to start chatting.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: GROUP CHATS ================= */}
      {activeTab === 'groups' && (
        <div className="flex-1 flex flex-col md:flex-row gap-4 mt-3 overflow-hidden">
          {/* Left: Groups List & Create Button */}
          <div className="w-full md:w-72 flex flex-col liquid-card rounded-3xl p-3 shrink-0">
            <button
              onClick={() => setShowCreateGroup(true)}
              className="w-full py-2 px-3 rounded-2xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-amber-400 transition-colors mb-3"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Group Lounge</span>
            </button>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroup(g)}
                  className={`w-full p-2.5 rounded-2xl text-left flex items-center justify-between transition-all ${
                    selectedGroup?.id === g.id
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-xl bg-stone-800 text-amber-400 font-black flex items-center justify-center text-xs shrink-0">
                      #
                    </div>
                    <div className="truncate">
                      <div className="text-xs truncate font-bold">{g.name}</div>
                      <div className="text-[10px] opacity-70 truncate">
                        {g.memberIds.length} members
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {groups.length === 0 && (
                <div className="text-center py-10 text-stone-400 text-xs">
                  No groups yet. Click "Create Group Lounge" to invite classmates!
                </div>
              )}
            </div>
          </div>

          {/* Right: Active Group Chat */}
          <div className="flex-1 flex flex-col liquid-card rounded-3xl p-4 overflow-hidden">
            {selectedGroup ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm shadow-md">
                      #
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-stone-900 dark:text-white">
                        {selectedGroup.name}
                      </h3>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400">
                        {selectedGroup.description || `${selectedGroup.memberIds.length} members`}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-500 text-[10px] font-bold">
                    Group Lounge
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
                  {groupMessages.map((m) => {
                    const isMe = m.fromUserId === currentUser.id;
                    const isBlurred = m.isBlurred && !unblurredIds.includes(m.id);

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                      >
                        <div className="text-[10px] text-stone-400 px-1 font-semibold">
                          {isMe ? 'You' : `@${m.fromUsername}`} · {m.timestamp}
                        </div>

                        <div
                          className={`relative max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-xs shadow-md'
                              : 'bg-black/5 dark:bg-white/10 text-stone-900 dark:text-stone-100 rounded-tl-xs shadow-sm'
                          }`}
                        >
                          {isBlurred ? (
                            <div className="flex items-center gap-2">
                              <span className="filter blur-sm select-none">
                                {m.maskedContent || m.content}
                              </span>
                              <button
                                onClick={() => toggleUnblur(m.id)}
                                className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-white flex items-center gap-1 font-bold shrink-0 hover:bg-black/60"
                              >
                                <Eye className="w-2.5 h-2.5" /> Unblur
                              </button>
                            </div>
                          ) : (
                            <span>{m.content}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {groupMessages.length === 0 && (
                    <div className="text-center py-20 text-stone-400 text-xs">
                      First message in #{selectedGroup.name}! Drop a note for your study squad.
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendGroupMessage} className="pt-2 shrink-0">
                  <div className="flex items-center gap-2 liquid-glass rounded-2xl p-1.5 border border-black/10 dark:border-white/10">
                    <input
                      type="text"
                      disabled={!isTrusted}
                      value={groupMessageInput}
                      onChange={(e) => setGroupMessageInput(e.target.value)}
                      placeholder={
                        isTrusted
                          ? `Message #${selectedGroup.name}...`
                          : 'Messaging locked (requires admin trust)...'
                      }
                      className="flex-1 bg-transparent px-3 py-1.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!isTrusted || !groupMessageInput.trim() || loading}
                      className="p-2 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 disabled:opacity-40 transition-all shadow-md shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400 text-xs">
                <Hash className="w-10 h-10 mb-2 opacity-50" />
                <span>Select a group on the left or create one to chat.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: FRIEND REQUESTS & ADD ================= */}
      {activeTab === 'requests' && (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 overflow-y-auto pr-1">
          {/* Section 1: Send Friend Request */}
          <div className="liquid-card rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-sm">Send Friend Request</h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Enter the exact username of your friend or classmate to send them an invitation.
            </p>
            <form onSubmit={handleSendRequest} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={addUsernameInput}
                  onChange={(e) => setAddUsernameInput(e.target.value)}
                  placeholder="Enter username (e.g. alex, student99)..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                disabled={!addUsernameInput.trim() || loading}
                className="w-full py-2.5 rounded-2xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-40 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Invitation Request</span>
              </button>
            </form>

            {/* Outgoing pending requests */}
            <div className="pt-3 border-t border-black/10 dark:border-white/10">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                Pending Outgoing Requests ({outgoingRequests.length})
              </h4>
              <div className="space-y-1.5">
                {outgoingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold">@{req.toUsername}</span>
                    <span className="text-[10px] text-amber-500 font-bold">Pending Approval</span>
                  </div>
                ))}
                {outgoingRequests.length === 0 && (
                  <span className="text-xs text-stone-400">No outgoing requests.</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Incoming Requests */}
          <div className="liquid-card rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="font-extrabold text-sm">Incoming Requests ({incomingRequests.length})</h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              People who sent you an invitation to connect:
            </p>

            <div className="space-y-2">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-between"
                >
                  <div className="truncate">
                    <h4 className="text-xs font-bold truncate">@{req.fromUsername}</h4>
                    <span className="text-[10px] text-stone-400">{req.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRespondRequest(req.id, 'accept')}
                      className="p-1.5 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs hover:bg-emerald-400 shadow-sm flex items-center gap-1"
                      title="Accept Request"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Accept</span>
                    </button>
                    <button
                      onClick={() => handleRespondRequest(req.id, 'decline')}
                      className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs"
                      title="Decline Request"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {incomingRequests.length === 0 && (
                <div className="text-center py-12 text-stone-400 text-xs">
                  No incoming requests at this time.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: FRIENDS & PRIVACY SETTINGS ================= */}
      {activeTab === 'settings' && (
        <div className="flex-1 max-w-2xl mx-auto w-full mt-3 overflow-y-auto pr-1 space-y-4">
          <div className="liquid-card rounded-3xl p-5 space-y-4">
            <h3 className="font-extrabold text-sm">Social Safety & Moderation Settings</h3>

            {/* Setting 1: Profanity / Slurs Filtering */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <h4 className="text-xs font-bold">Slurs & Explicit Language Filtering</h4>
                <p className="text-[11px] text-stone-400">
                  Configure how sensitive terms are rendered in direct and group chats.
                </p>
              </div>
              <div className="flex gap-1.5 p-1 rounded-xl liquid-glass">
                {(['blur', 'mask', 'hide'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleUpdateSettings({ filterMode: mode })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                      friendsSettings.filterMode === mode
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-black/10 dark:bg-white/10" />

            {/* Setting 2: Allow Incoming Friend Requests */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold">Allow Incoming Friend Requests</h4>
                <p className="text-[11px] text-stone-400">
                  Allow other registered students to search for you and send requests.
                </p>
              </div>
              <input
                type="checkbox"
                checked={friendsSettings.allowRequests}
                onChange={(e) => handleUpdateSettings({ allowRequests: e.target.checked })}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="h-px bg-black/10 dark:bg-white/10" />

            {/* Setting 3: Online Presence */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold">Online Status Visibility</h4>
                <p className="text-[11px] text-stone-400">
                  Show green online indicator next to your avatar in friends list.
                </p>
              </div>
              <div className="flex gap-1.5 p-1 rounded-xl liquid-glass">
                <button
                  onClick={() => handleUpdateSettings({ onlineStatus: 'online' })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    friendsSettings.onlineStatus === 'online'
                      ? 'bg-emerald-500 text-stone-950 shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Visible
                </button>
                <button
                  onClick={() => handleUpdateSettings({ onlineStatus: 'invisible' })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    friendsSettings.onlineStatus === 'invisible'
                      ? 'bg-stone-700 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Incognito
                </button>
              </div>
            </div>

            <div className="h-px bg-black/10 dark:bg-white/10" />

            {/* Setting 4: Audio Notification alerts */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold">Chat Notification Chimes</h4>
                <p className="text-[11px] text-stone-400">
                  Play subtle ambient tone upon incoming direct message.
                </p>
              </div>
              <input
                type="checkbox"
                checked={friendsSettings.soundAlerts}
                onChange={(e) => handleUpdateSettings({ soundAlerts: e.target.checked })}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Group Chat Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl liquid-card border border-white/20 text-stone-900 dark:text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Hash className="w-4 h-4 text-amber-500" />
                <span>New Group Lounge</span>
              </h3>
              <button
                onClick={() => setShowCreateGroup(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase">Group Name</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. AP Calc Study Squad, Gaming Team..."
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase">Topic / Description</label>
                <input
                  type="text"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="e.g. Exam prep notes and homework answers"
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase">
                  Add Friends ({selectedGroupMemberIds.length} selected)
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1 mt-1 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                  {friends.map((f) => (
                    <label
                      key={f.id}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-xs"
                    >
                      <span>@{f.username}</span>
                      <input
                        type="checkbox"
                        checked={selectedGroupMemberIds.includes(f.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGroupMemberIds((prev) => [...prev, f.id]);
                          } else {
                            setSelectedGroupMemberIds((prev) =>
                              prev.filter((id) => id !== f.id)
                            );
                          }
                        }}
                        className="accent-amber-500"
                      />
                    </label>
                  ))}
                  {friends.length === 0 && (
                    <div className="text-center py-4 text-[11px] text-stone-400">
                      Add friends first to invite them to groups!
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroup(false)}
                  className="flex-1 py-2 rounded-xl bg-black/10 dark:bg-white/10 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newGroupName.trim() || loading}
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold hover:bg-amber-400 disabled:opacity-40 shadow-md"
                >
                  Create Lounge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
