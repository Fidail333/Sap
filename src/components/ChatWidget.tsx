'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ChatRole = 'user' | 'bot';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

type LeadStatus = 'idle' | 'loading' | 'success' | 'error';

type QuickReply = {
  id: string;
  label: string;
  reply: string;
};

const quickReplies: QuickReply[] = [
  {
    id: 'timeline',
    label: 'Сроки поставки',
    reply: 'Чаще всего под заказ; инженер уточнит срок под конкретную модель и объём.'
  },
  {
    id: 'pixel',
    label: 'Как выбрать шаг пикселя?',
    reply:
      'Чем ближе расстояние просмотра, тем меньше нужен шаг пикселя. Для точного подбора инженер учтёт дистанцию, сценарий и бюджет.'
  },
  {
    id: 'outdoor-indoor',
    label: 'Уличный или indoor?',
    reply:
      'Для улицы важны IP-защита, повышенная яркость и устойчивость к погоде. Для помещений важнее комфортная яркость и детализация под близкий просмотр.'
  },
  {
    id: 'cob-gob',
    label: 'COB vs GOB',
    reply:
      'COB обычно даёт более цельную картинку и высокую защиту поверхности. GOB часто выбирают, когда нужен дополнительный защитный слой и практичность в эксплуатации.'
  },
  {
    id: 'commercial',
    label: 'Хочу коммерческое предложение',
    reply: 'Оставьте контакты — подготовим предложение под задачу.'
  }
];

const keywords: Array<{ check: RegExp; reply: string }> = [
  { check: /(срок|поставк|доставк)/i, reply: quickReplies[0].reply },
  { check: /(шаг|пиксел|pixel|ppi|разреш)/i, reply: quickReplies[1].reply },
  { check: /(улиц|outdoor|indoor|ip|ярк)/i, reply: quickReplies[2].reply },
  { check: /(cob|gob)/i, reply: quickReplies[3].reply },
  { check: /(кп|коммерч|предложени|цена|стоим)/i, reply: quickReplies[4].reply }
];

const phoneDigitsMin = 10;

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getBotWelcome(): ChatMessage {
  return {
    id: makeId(),
    role: 'bot',
    text: 'Здравствуйте! Я помогу с базовыми вопросами по LED-экранам. Могу подключить инженера, если оставите заявку.'
  };
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([getBotWelcome()]);
  const [input, setInput] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [leadMessage, setLeadMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('idle');

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const appendBotMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: makeId(), role: 'bot', text }]);
  }, []);

  const openFormWithPrefill = useCallback(
    (prefillText = '') => {
      setShowLeadForm(true);
      if (prefillText && !leadMessage.trim()) {
        setLeadMessage(prefillText);
      }
    },
    [leadMessage]
  );

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const trigger = target.closest('[data-chat-open]');
      if (!trigger) return;
      event.preventDefault();
      openChat();
    };

    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  }, [openChat]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeChat();
      }

      if (event.key !== 'Tab' || !modalRef.current) return;
      const focusables = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled])'
        )
      ).filter((item) => !item.hasAttribute('aria-hidden'));

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeChat]);

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, showLeadForm]);

  const quickReplyButtons = useMemo(() => quickReplies, []);

  function onQuickReplyClick(item: QuickReply) {
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role: 'user', text: item.label },
      { id: makeId(), role: 'bot', text: `${item.reply} Если хотите, передам запрос инженеру.` }
    ]);
    openFormWithPrefill(item.label);
  }

  function handleUserInputSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    setInput('');
    setMessages((prev) => [...prev, { id: makeId(), role: 'user', text }]);

    const found = keywords.find((entry) => entry.check.test(text));
    if (found) {
      appendBotMessage(`${found.reply} Если хотите, передам запрос инженеру — оставьте контакты.`);
      openFormWithPrefill(text);
      return;
    }

    appendBotMessage('Передам инженеру. Оставьте контакты.');
    openFormWithPrefill(text);
  }

  async function submitLead(event: React.FormEvent) {
    event.preventDefault();
    setFieldError('');

    const normalizedPhone = normalizePhone(phone);
    if (normalizedPhone.length < phoneDigitsMin) {
      setFieldError('Введите телефон: минимум 10 цифр.');
      return;
    }

    if (!consent) {
      setFieldError('Необходимо согласие на обработку персональных данных.');
      return;
    }

    setLeadStatus('loading');

    const history = messages.slice(-6).map((msg) => ({ role: msg.role, text: msg.text }));

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          phone: phone.trim(),
          message: leadMessage.trim() || input.trim() || undefined,
          pageUrl: window.location.href,
          pageTitle: document.title,
          history,
          source: 'chat-widget',
          consent: true,
          hp: ''
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setLeadStatus('success');
        setPhone('');
        setName('');
        setLeadMessage('');
        setConsent(false);
        setShowLeadForm(false);
        appendBotMessage('Заявка отправлена. Инженер свяжется с вами.');
        return;
      }

      if (response.status === 429 || data.error === 'too_many_requests') {
        setLeadStatus('error');
        setFieldError('Пожалуйста, попробуйте позже.');
        return;
      }

      setLeadStatus('error');
      setFieldError('Не удалось отправить, попробуйте ещё раз.');
    } catch {
      setLeadStatus('error');
      setFieldError('Не удалось отправить, попробуйте ещё раз.');
    }
  }

  const isLeadSubmitDisabled = normalizePhone(phone).length < phoneDigitsMin || !consent || leadStatus === 'loading';

  return (
    <>
      <button
        type="button"
        data-chat-open
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-slate-900/95 px-4 py-3 text-sm font-medium text-cyan-100 shadow-[0_12px_36px_rgba(14,116,144,0.35)] transition hover:bg-slate-800 sm:right-5 sm:px-5"
        aria-label="Открыть чат с инженером"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/20 text-cyan-200" aria-hidden="true">
          💬
        </span>
        <span className="hidden sm:inline">Связаться с инженером</span>
        <span className="sm:hidden">Чат</span>
      </button>

      {isOpen ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === overlayRef.current) closeChat();
          }}
          aria-hidden="true"
        >
          <div className="flex h-full items-end justify-end p-2 sm:p-4">
            <section
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label="Чат с инженером Sapphire LED"
              className="flex h-[min(90vh,760px)] w-full max-w-[460px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-slate-950 shadow-2xl"
            >
              <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-cyan-200">Sapphire LED • Чат</p>
                  <p className="text-xs text-slate-400">Ответы и передача заявки инженеру</p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeChat}
                  className="rounded-lg border border-white/20 px-2.5 py-1.5 text-sm text-slate-300 hover:bg-white/10"
                  aria-label="Закрыть чат"
                >
                  ✕
                </button>
              </header>

              <div ref={messagesRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3 sm:px-4">
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed sm:max-w-[88%] ${
                      message.role === 'bot'
                        ? 'mr-auto border border-cyan-400/25 bg-cyan-400/10 text-cyan-50'
                        : 'ml-auto border border-white/15 bg-white/10 text-slate-100'
                    }`}
                  >
                    {message.text}
                  </article>
                ))}

                {!showLeadForm ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="mb-2 text-xs text-slate-400">Быстрые вопросы:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplyButtons.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onQuickReplyClick(item)}
                          className="rounded-full border border-cyan-300/30 px-3 py-1.5 text-xs text-cyan-100 transition hover:bg-cyan-300/15"
                        >
                          {item.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => openFormWithPrefill(input)}
                        className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10"
                      >
                        Оставить заявку
                      </button>
                    </div>
                  </div>
                ) : null}

                {showLeadForm ? (
                  <form onSubmit={submitLead} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-slate-400">Оставьте контакты, и инженер свяжется с вами.</p>
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Имя (опционально)"
                      className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="Телефон *"
                      className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                      required
                    />
                    <textarea
                      value={leadMessage}
                      onChange={(event) => setLeadMessage(event.target.value)}
                      placeholder="Сообщение (опционально)"
                      rows={3}
                      className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                    />
                    <input type="text" name="hp" autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />
                    <label className="flex items-start gap-2 text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        className="mt-0.5"
                      />
                      <span>
                        Согласен на обработку персональных данных ({' '}
                        <Link href="/privacy" className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200">
                          Политика
                        </Link>
                        )
                      </span>
                    </label>
                    {fieldError ? <p className="text-xs text-rose-300">{fieldError}</p> : null}
                    <button
                      type="submit"
                      disabled={isLeadSubmitDisabled}
                      className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {leadStatus === 'loading' ? 'Отправка...' : 'Передать инженеру'}
                    </button>
                  </form>
                ) : null}
              </div>

              <form onSubmit={handleUserInputSubmit} className="border-t border-white/10 p-3 sm:p-4">
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Введите вопрос"
                    rows={1}
                    className="max-h-24 min-h-[42px] flex-1 resize-y rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-xl border border-cyan-300/35 bg-cyan-300/20 px-3 py-2 text-sm text-cyan-100 transition hover:bg-cyan-300/30"
                  >
                    Отправить
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      ) : null}
    </>
  );
}
