'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ChatRole = 'user' | 'bot';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

type FormErrors = {
  phone: string;
  consent: string;
  submit: string;
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

function normalizeRuPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('8')) {
    return `+7${digits.slice(1)}`;
  }

  if (digits.length === 11 && digits.startsWith('7')) {
    return `+${digits}`;
  }


  return '';
}

function isValidRuPhone(phone: string) {
  return /^\+7\d{10}$/.test(phone);
}

function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour <= 11) return 'Доброе утро';
  if (hour >= 12 && hour <= 16) return 'Добрый день';
  if (hour >= 17 && hour <= 22) return 'Добрый вечер';
  return 'Доброй ночи';
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getBotWelcome(): ChatMessage {
  return {
    id: makeId(),
    role: 'bot',
    text: 'Привет! Я Алсу, инженер Sapphire LED. Могу подсказать и передать запрос инженеру.'
  };
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M15 6 9 12l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M5 7h14M5 12h14M5 17h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M20 4 3 11l7 2 2 7 8-16Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
  const [formErrors, setFormErrors] = useState<FormErrors>({ phone: '', consent: '', submit: '' });
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('idle');
  const [avatarError, setAvatarError] = useState(false);

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

  const validatePhone = useCallback((value: string) => {
    return value.trim() ? '' : 'Укажите любой удобный способ связи';
  }, []);

  const validateConsent = useCallback((value: boolean) => {
    return value ? '' : 'Необходимо согласие на обработку персональных данных';
  }, []);

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

    const phoneError = validatePhone(phone);
    const consentError = validateConsent(consent);

    if (phoneError || consentError) {
      setFormErrors({ phone: phoneError, consent: consentError, submit: '' });
      return;
    }

    setFormErrors({ phone: '', consent: '', submit: '' });

    setLeadStatus('loading');
    const normalizedPhone = normalizeRuPhone(phone);
    const leadPhoneForApi = isValidRuPhone(normalizedPhone) ? normalizedPhone : '+70000000000';
    const preparedLeadMessage = [
      `Контакт: ${phone.trim()}`,
      leadMessage.trim() || input.trim()
    ]
      .filter(Boolean)
      .join('\n');

    const history = messages.slice(-6).map((msg) => ({ role: msg.role, text: msg.text }));

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          phone: leadPhoneForApi,
          message: preparedLeadMessage || undefined,
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
        setFormErrors({ phone: '', consent: '', submit: '' });
        setShowLeadForm(false);
        appendBotMessage(
          `${getTimeGreeting()}!\nМеня зовут Алсу, я искусственный помощник Sapphire LED 🤖\n\nЯ передала вашу заявку настоящему инженеру Алсу 😊. Специалист свяжется с вами в ближайшее рабочее время, чтобы:\n— уточнить задачу\n— подобрать оптимальное LED-решение\n— рассчитать стоимость и сроки\n\nЕсли у вас появятся дополнительные вопросы — можете написать их здесь.`
        );
        return;
      }

      if (response.status === 429 || data.error === 'too_many_requests') {
        setLeadStatus('error');
        setFormErrors((prev) => ({ ...prev, submit: 'Слишком много запросов. Попробуйте позже.' }));
        return;
      }

      setLeadStatus('error');
      setFormErrors((prev) => ({ ...prev, submit: 'Не удалось отправить, попробуйте ещё раз.' }));
    } catch {
      setLeadStatus('error');
      setFormErrors((prev) => ({ ...prev, submit: 'Не удалось отправить, попробуйте ещё раз.' }));
    }
  }

  const isPhoneValid = !validatePhone(phone);
  const isConsentValid = !validateConsent(consent);
  const isLeadSubmitDisabled = !isPhoneValid || !isConsentValid || leadStatus === 'loading';

  const renderAlsuAvatar = (sizeClass: string) => (
    <span className={`relative inline-flex ${sizeClass} shrink-0 overflow-hidden rounded-full border border-white/65 bg-white shadow-[0_4px_14px_rgba(15,23,42,0.18)]`}>
      {!avatarError ? (
        <Image
          src="/visuals/alsu-bot-avatar.jpg"
          alt="Аватар Алсу"
          fill
          className="object-cover"
          sizes="48px"
          onError={() => setAvatarError(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500 text-base font-semibold text-white">А</span>
      )}
    </span>
  );

  return (
    <>
      <button
        type="button"
        data-chat-open
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-slate-900/95 px-4 py-3 text-sm font-medium text-cyan-100 shadow-[0_12px_36px_rgba(14,116,144,0.35)] transition hover:bg-slate-800 sm:right-5 sm:px-5"
        aria-label="Открыть чат с инженером"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/20 text-cyan-100" aria-hidden="true">
          <SendIcon />
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
              className="relative flex h-[min(calc(100vh-24px),820px)] w-full max-w-[420px] flex-col overflow-hidden rounded-[2.25rem] border border-slate-500/60 bg-[#171b22] p-1.5 shadow-[0_28px_70px_rgba(2,8,23,0.65),0_0_0_1px_rgba(14,165,233,0.2)]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] shadow-[inset_0_0_34px_rgba(45,212,191,0.08)]" aria-hidden="true" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[1.9rem] bg-slate-100">
                <div className="flex justify-center pb-1 pt-2.5" aria-hidden="true">
                  <div className="h-6 w-28 rounded-full bg-black/85" />
                </div>

                <header className="flex items-center justify-between border-b border-slate-200/90 bg-white/90 px-3.5 py-2.5 backdrop-blur">
                  <div className="flex items-center gap-2.5">
                    <button type="button" className="rounded-full p-1 text-slate-500" aria-label="Назад">
                      <BackIcon />
                    </button>
                    <span className="relative h-10 w-10">{renderAlsuAvatar('h-full w-full')}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Алсу</p>
                      <p className="text-[11px] text-slate-500">инженер • ответ в течение рабочего дня</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button type="button" className="rounded-full p-2 text-slate-500" aria-label="Поиск в чате">
                      <SearchIcon />
                    </button>
                    <button type="button" className="rounded-full p-2 text-slate-500" aria-label="Меню чата">
                      <MenuIcon />
                    </button>
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={closeChat}
                      className="rounded-full border border-slate-200 p-2 text-xs text-slate-500 hover:bg-slate-100"
                      aria-label="Закрыть чат"
                    >
                      ✕
                    </button>
                  </div>
                </header>

                <div ref={messagesRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-slate-100 via-slate-50 to-cyan-50/30 px-3 py-3 sm:px-4">
                  {messages.map((message) => (
                    <article
                      key={message.id}
                      className={`flex w-full items-end gap-2 ${message.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                    >
                      {message.role === 'bot' ? <span className="relative h-8 w-8">{renderAlsuAvatar('h-full w-full')}</span> : null}
                      <div
                        className={`max-w-[84%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                          message.role === 'bot'
                            ? 'rounded-bl-md bg-white text-slate-700'
                            : 'rounded-br-md bg-gradient-to-br from-sky-500 to-cyan-500 text-white'
                        }`}
                      >
                        {message.role === 'bot' ? <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Алсу</p> : null}
                        <p>{message.text}</p>
                      </div>
                    </article>
                  ))}

                  {!showLeadForm ? (
                    <div className="ml-10 rounded-2xl border border-slate-200/90 bg-white/80 p-3 shadow-sm">
                      <p className="mb-2 text-xs text-slate-500">Частые вопросы</p>
                      <div className="flex flex-wrap gap-2">
                        {quickReplyButtons.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => onQuickReplyClick(item)}
                            className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs text-cyan-700 transition hover:bg-cyan-100"
                          >
                            {item.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => openFormWithPrefill(input)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-100"
                        >
                          Передать инженеру
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {showLeadForm ? (
                    <form onSubmit={submitLead} className="ml-10 grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="text-xs text-slate-500">Передам инженеру — оставьте контакты.</p>
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Имя (опционально)"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
                      />
                      <input
                        type="text"
                        value={phone}
                        onChange={(event) => {
                          const nextPhone = event.target.value;
                          setPhone(nextPhone);
                          setFormErrors((prev) => ({ ...prev, phone: validatePhone(nextPhone), submit: '' }));
                        }}
                        onBlur={(event) => {
                          setFormErrors((prev) => ({ ...prev, phone: validatePhone(event.target.value) }));
                        }}
                        placeholder="Телефон / Контакт *"
                        className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:ring-1 ${
                          formErrors.phone ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-cyan-400 focus:ring-cyan-400'
                        }`}
                        required
                      />
                      {formErrors.phone ? <p className="text-xs text-rose-600">{formErrors.phone}</p> : null}
                      <textarea
                        value={leadMessage}
                        onChange={(event) => setLeadMessage(event.target.value)}
                        placeholder="Сообщение (опционально)"
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
                      />
                      <input type="text" name="hp" autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />
                      <label
                        className={`grid grid-cols-[auto,1fr] items-start gap-2 text-xs leading-5 ${formErrors.consent ? 'text-rose-600' : 'text-slate-600'}`}
                      >
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(event) => {
                            const nextConsent = event.target.checked;
                            setConsent(nextConsent);
                            setFormErrors((prev) => ({ ...prev, consent: validateConsent(nextConsent), submit: '' }));
                          }}
                          className={`mt-0.5 h-4 w-4 rounded border ${formErrors.consent ? 'border-rose-500 accent-rose-500' : 'border-slate-300 accent-cyan-600'}`}
                        />
                        <span className="min-w-0 break-words">
                          Согласен на обработку персональных данных (
                          <Link href="/privacy" className="text-cyan-700 underline underline-offset-2 hover:text-cyan-600">
                            Политика
                          </Link>
                          )
                        </span>
                      </label>
                      {formErrors.consent ? <p className="text-xs text-rose-600">{formErrors.consent}</p> : null}
                      {formErrors.submit ? <p className="text-xs text-rose-600">{formErrors.submit}</p> : null}
                      <button
                        type="submit"
                        disabled={isLeadSubmitDisabled}
                        className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {leadStatus === 'loading' ? 'Отправка...' : 'Отправить инженеру'}
                      </button>
                    </form>
                  ) : null}
                </div>

                <form onSubmit={handleUserInputSubmit} className="border-t border-slate-200 bg-white p-2.5 sm:p-3">
                  <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                    <button
                      type="button"
                      onClick={() => setShowLeadForm((prev) => !prev)}
                      className="rounded-full p-2 text-slate-500 transition hover:bg-slate-200"
                      aria-label="Показать быстрые действия"
                    >
                      <PlusIcon />
                    </button>
                    <textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault();
                          const form = event.currentTarget.form;
                          if (form) form.requestSubmit();
                        }
                      }}
                      placeholder="Сообщение…"
                      rows={1}
                      className="max-h-28 min-h-[38px] flex-1 resize-y bg-transparent px-1 py-1.5 text-sm text-slate-800 outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-cyan-500 p-2.5 text-white transition hover:bg-cyan-600"
                      aria-label="Отправить сообщение"
                    >
                      <SendIcon />
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </>
  );
}
