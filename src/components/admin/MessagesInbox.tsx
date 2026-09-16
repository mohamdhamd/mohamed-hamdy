// صندوق رسائل واستفسارات الزوار (Messages Inbox)
import React, { useState, useEffect } from 'react';
import { ContactMessage } from '../../types';
import { useData } from '../../context/DataContext';
import { soundFX } from '../../utils/audio';
import {
  Mail,
  MailOpen,
  Trash2,
  Reply,
  CheckCircle,
  RefreshCw,
  Search,
  Calendar,
  User,
  ExternalLink,
  Database,
  Copy,
  Check,
} from 'lucide-react';

export const MessagesInbox: React.FC = () => {
  const {
    messages,
    unreadCount,
    refreshMessages,
    markMessageRead,
    markAllMessagesRead,
    deleteMessage,
    settings,
  } = useData();

  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    refreshMessages();
  }, [refreshMessages]);

  useEffect(() => {
    if (messages.length > 0 && !selectedMessage) {
      setSelectedMessage(messages[0]);
    } else if (selectedMessage) {
      const current = messages.find((m) => m._id === selectedMessage._id);
      if (current) {
        setSelectedMessage(current);
      } else if (messages.length > 0) {
        setSelectedMessage(messages[0]);
      } else {
        setSelectedMessage(null);
      }
    }
  }, [messages, selectedMessage]);

  const handleRefresh = async () => {
    setLoading(true);
    soundFX.playClick();
    await refreshMessages();
    setLoading(false);
  };

  const handleToggleRead = async (msg: ContactMessage) => {
    soundFX.playClick();
    try {
      await markMessageRead(msg._id, !msg.read);
    } catch (err) {
      console.error('Error toggling read status:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!window.confirm('هل تريد بالتأكيد تحديد جميع الرسائل كمقروءة؟')) return;
    soundFX.playClick();
    try {
      await markAllMessagesRead();
      soundFX.playChime();
    } catch (err: any) {
      alert('تعذر تحديث حالة الرسائل: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذه الرسالة؟')) return;
    soundFX.playClick();
    try {
      await deleteMessage(id);
      soundFX.playChime();
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } catch (err: any) {
      alert('تعذر حذف الرسالة: ' + err.message);
    }
  };

  const handleCopyEmail = (emailStr: string) => {
    navigator.clipboard.writeText(emailStr);
    soundFX.playClick();
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const filteredMessages = messages.filter((m) => {
    const matchesFilter = filter === 'all' || !m.read;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* الترويسة وأدوات التحكم */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-moonlight flex items-center gap-2">
            <span>صندوق رسائل التواصل</span>
            {unreadCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full bg-brass text-void text-[11px] font-mono font-bold animate-pulse">
                {unreadCount} غير مقروءة
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-void border border-ink text-emerald-400 text-[11px] font-mono">
                مقروءة بالكامل
              </span>
            )}
            <span className="text-xs text-dust/60 font-mono">({messages.length} إجمالاً)</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-dust mt-0.5">
            <span>الرسائل الواردة مباشرة من نموذج تواصل الموقع</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <Database className="w-3 h-3" />
              <span>مربوط بـ MongoDB Atlas</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* زر فتح بريد Gmail مباشرة */}
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl text-xs font-mono bg-void border border-ink hover:border-brass/50 text-dust hover:text-brass flex items-center gap-1.5 transition-colors"
            title={`فتح صندوق بريد Gmail (${settings.email || 'mohamed.hamdy.fawzy0@gmail.com'})`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">فتح بريد Gmail</span>
          </a>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-2 rounded-xl text-xs font-mono bg-void border border-brass/30 text-brass hover:bg-brass/10 flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>تحديد الكل كمقروء</span>
            </button>
          )}

          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className={`px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
              filter === 'unread'
                ? 'bg-brass text-void font-bold'
                : 'bg-deep border border-ink text-dust hover:text-moonlight'
            }`}
          >
            {filter === 'unread' ? 'عرض الكل' : 'الغير مقروءة فقط'}
          </button>

          <button
            onClick={handleRefresh}
            title="تحديث الرسائل"
            className="p-2 rounded-xl bg-deep border border-ink hover:border-brass text-dust hover:text-brass transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* تخطيط صندوق الوارد: قائمة جهة اليمين وتفاصيل جهة اليسار */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* قائمة الرسائل */}
        <div className="lg:col-span-5 bg-deep/50 border border-ink rounded-2xl overflow-hidden flex flex-col">
          {/* شريط البحث */}
          <div className="p-3 border-b border-ink bg-void/30">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث في الرسائل أو المرسلين..."
                className="w-full bg-void border border-ink focus:border-brass rounded-lg ps-8 pe-3 py-1.5 text-xs text-moonlight outline-none"
              />
              <Search className="w-3.5 h-3.5 text-dust/60 absolute start-2.5 top-2.5" />
            </div>
          </div>

          {/* قائمة العناصر */}
          <div className="flex-1 overflow-y-auto divide-y divide-ink/60">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-dust/60 text-xs font-mono">
                لا توجد رسائل مطابقة.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.read) handleToggleRead(msg);
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedMessage?._id === msg._id
                      ? 'bg-deep border-s-2 border-brass'
                      : 'hover:bg-deep/70'
                  } ${!msg.read ? 'font-bold' : 'opacity-85'}`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-moonlight truncate">{msg.name}</span>
                    <span className="text-[10px] font-mono text-dust/70 flex-shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  <p className="text-xs text-dust line-clamp-1 mb-1 font-normal">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-dust/60">
                    <span className="truncate">{msg.email}</span>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-brass flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* استعراض الرسالة المحددة */}
        <div className="lg:col-span-7 bg-deep/50 border border-ink rounded-2xl p-6 flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* ترويسة الرسالة */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink">
                <div>
                  <h3 className="font-bold font-display text-moonlight text-base sm:text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-brass" />
                    <span>{selectedMessage.name}</span>
                  </h3>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs font-mono text-dust hover:text-brass transition-colors"
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    title={selectedMessage.read ? 'تحديد كغير مقروءة' : 'تحديد كمقروءة'}
                    className="p-2 rounded-lg bg-void border border-ink text-dust hover:text-brass transition-colors"
                  >
                    {selectedMessage.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4 text-brass" />}
                  </button>

                  <button
                    onClick={() => handleCopyEmail(selectedMessage.email)}
                    title="نسخ بريد المرسل"
                    className="p-2 rounded-lg bg-void border border-ink text-dust hover:text-brass transition-colors"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <a
                    href={`mailto:${selectedMessage.email}?subject=رد من محمد حمدي بخصوص استفسارك&body=مرحباً ${encodeURIComponent(selectedMessage.name)}،%0D%0A%0D%0Aشكراً لتواصلك معي.%0D%0A%0D%0A`}
                    className="px-3 py-2 rounded-lg bg-brass text-void font-bold hover:bg-brass-light text-xs flex items-center gap-1.5 transition-colors shadow-astral"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>رد عبر الإيميل</span>
                  </a>

                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    title="حذف الرسالة"
                    className="p-2 rounded-lg bg-void border border-ink hover:border-red-500 text-dust hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* التاريخ والوقت */}
              <div className="flex items-center gap-2 text-xs font-mono text-dust/70">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  تم الإرسال في:{' '}
                  {new Date(selectedMessage.createdAt).toLocaleString('ar-EG', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </span>
              </div>

              {/* نص الرسالة */}
              <div className="bg-void/80 border border-ink rounded-xl p-5 text-xs sm:text-sm text-moonlight whitespace-pre-wrap leading-relaxed font-sans min-h-[160px]">
                {selectedMessage.message}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-dust/60">
              <Mail className="w-12 h-12 text-ink mb-3" />
              <p className="text-xs font-mono">اختر رسالة من القائمة لعرض تفاصيلها والرد عليها.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
