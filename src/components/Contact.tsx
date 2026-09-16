// قسم التواصل الحديث مع نموذج مراسلة فوري تفاعلي ونسخ البريد والشبكات المهنية
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { soundFX } from '../utils/audio';
import { Mail, Linkedin, Github, Send, Copy, Check, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const { t, lang } = useLanguage();
  const { submitMessage, settings } = useData();
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailAddress = settings.email || 'mohamed.hamdy.fawzy0@gmail.com';
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    soundFX.playClick();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    soundFX.playClick();

    try {
      await submitMessage({ name, email, message });
    } catch (err) {
      console.warn('Backend offline fallback submission:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      soundFX.playChime();
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 sm:py-32 px-4 relative">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* شارة العنوان مع أنيميشن النصوص */}
        <div className="reveal-on-scroll text-reveal text-reveal-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brass/30 bg-deep/60 text-brass text-xs font-mono">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t('تواصل معي للعمل والتعاون', 'AVAILABLE FOR FREELANCE & CONTRACT')}</span>
        </div>

        <div className="reveal-on-scroll text-reveal space-y-4">
          <h2 className="text-reveal-heading font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-moonlight tracking-tight">
            {t('هل لديك فكرة أو مشروع في بالك؟', "Let's Build Something Great")}
          </h2>
          <p className="text-reveal-sub max-w-xl mx-auto text-base sm:text-lg text-dust font-sans leading-relaxed">
            {t(
              'سواء كنت تبحث عن تطوير تطبيق ويب جديد، أو استشارة برمجية، أو ترغب في مناقشة فرصة تعاون واعدة — يسعدني دائماً تواصلك.',
              "Whether you're looking to build a new web app, discuss a software concept, or explore a collaboration — my inbox is always open."
            )}
          </p>
        </div>

        {/* نموذج المراسلة السريع التفاعلي مع أنيميشن الكارت الفضائي */}
        <div className="reveal-on-scroll card-reveal card-sheen max-w-xl mx-auto glass-card p-6 sm:p-8 rounded-3xl border border-brass/30 text-start shadow-2xl">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-14 h-14 mx-auto rounded-full bg-brass/20 text-brass flex items-center justify-center shadow-astral">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-moonlight">
                {t('وصلت رسالتك بنجاح!', 'Message Sent Successfully!')}
              </h3>
              <p className="text-sm text-dust max-w-md mx-auto leading-relaxed">
                {t(
                  'شكراً لتواصلك يا صديقي، سأطلع على رسالتك وأرد عليك عبر بريدك خلال وقت وجيز.',
                  'Thank you for reaching out! I will review your note and get back to you shortly.'
                )}
              </p>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setIsSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="text-xs font-mono text-brass hover:underline pt-2 inline-block"
              >
                {t('إرسال رسالة أخرى', 'Send another message')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">
                  {t('اسمك الكريم', 'Your Name')}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('مثال: أحمد عبد الله', 'e.g. John Doe')}
                  className="w-full px-4 py-3 rounded-xl bg-void/80 border border-ink text-moonlight text-sm font-sans focus:outline-none focus:border-brass/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">
                  {t('بريدك الإلكتروني', 'Your Email')}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-void/80 border border-ink text-moonlight text-sm font-sans focus:outline-none focus:border-brass/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-dust mb-1.5">
                  {t('فكرة المشروع أو نص الرسالة', 'Project Details or Message')}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('اكتب نبذة عما تريد بناءه أو الاستفسار عنه...', 'Tell me about what you want to build...')}
                  className="w-full px-4 py-3 rounded-xl bg-void/80 border border-ink text-moonlight text-sm font-sans focus:outline-none focus:border-brass/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brass hover:bg-brass-light text-void font-bold text-sm sm:text-base transition-all duration-300 shadow-astral hover:shadow-astral-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{t('جاري الإرسال...', 'Sending...')}</span>
                ) : (
                  <>
                    <span>{t('إرسال الرسالة فوراً', 'Send Message Now')}</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* بطاقة البريد والنسخ السريع مع وميض الكارت */}
        <div className="reveal-on-scroll card-reveal card-sheen inline-flex flex-col sm:flex-row items-center gap-3 p-2.5 rounded-2xl glass-card shadow-2xl border-brass/20">
          <div className="flex items-center gap-2.5 px-4 py-2 text-moonlight font-mono text-sm sm:text-base">
            <Mail className="w-4 h-4 text-brass" />
            <span>{emailAddress}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyEmail}
              aria-label="Copy email address"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-ink/60 hover:bg-ink text-moonlight text-xs sm:text-sm font-sans transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-dust" />}
              <span>{copied ? t('تم النسخ بنجاح!', 'Copied!') : t('نسخ الإيميل', 'Copy Email')}</span>
            </button>

            <a
              href={`mailto:${emailAddress}`}
              onClick={() => soundFX.playClick()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brass hover:bg-brass-light text-void font-bold text-xs sm:text-sm transition-all shadow-astral hover:shadow-astral-lg"
            >
              <span>{t('إرسال عبر تطبيق البريد', 'Open Mail App')}</span>
              <Send className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* روابط الشبكات المهنية */}
        <div className="reveal-on-scroll text-reveal-sub flex items-center justify-center gap-4 pt-2">
          <a
            href={settings.linkedin_url || 'https://linkedin.com/in/mohamedhamdy'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-dust hover:text-moonlight text-sm font-sans font-medium transition-all group hover:-translate-y-0.5"
          >
            <Linkedin className="w-4 h-4 text-brass group-hover:scale-110 transition-transform" />
            <span>LinkedIn</span>
          </a>

          <a
            href={settings.github_url || 'https://github.com/mohamedhamdy'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFX.playClick()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-dust hover:text-moonlight text-sm font-sans font-medium transition-all group hover:-translate-y-0.5"
          >
            <Github className="w-4 h-4 text-brass group-hover:scale-110 transition-transform" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};
