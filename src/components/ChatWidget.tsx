'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ChatRole = 'user' | 'bot';
type Step = 'location' | 'purpose' | 'size' | 'size-custom' | 'timeline' | 'contact' | 'submitted';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

type Answers = {
  location: string;
  purpose: string;
  size: string;
  timeline: string;
  contact: string;
};

type ChatState = {
  step: Step;
  messages: ChatMessage[];
  answers: Answers;
  updatedAt: number;
  submittedAt: number | null;
};

const STORAGE_KEY = 'sapphire-alsu-chat-state-v1';
const SUBMITTED_TTL_MS = 20 * 60 * 1000;

const faqEntries: Array<{ check: RegExp; reply: string }> = [
  {
    check: /\b(p1|p2|p3)\b/i,
    reply: 'P1/P2/P3 — это шаг пикселя в миллиметрах. Чем меньше число, тем выше детализация на близком расстоянии.'
  },
  {
    check: /\b(cob|gob|smd)\b/i,
    reply: 'SMD — классическая технология модулей. COB и GOB обычно дают дополнительную защиту поверхности и устойчивость в эксплуатации.'
  },
  {
    check: /(цен|стоим)/i,
    reply: 'Стоимость зависит от параметров проекта: размера, шага пикселя, яркости, конструкции и условий монтажа. Инженер рассчитает точнее.'
  },
  {
    check: /(улиц|помещени|indoor|outdoor)/i,
    reply: 'Для улицы важны высокая яркость, герметичность и климатическая устойчивость. Для помещений — комфортная яркость и детализация.'
  },
  {
    check: /(срок\s*служб|ресурс|наработк)/i,
    reply: 'При корректной эксплуатации LED-экран обычно рассчитан на длительный ресурс. Срок службы зависит от режима работы, охлаждения и качества компонентов.'
  }
];

const stepOptions: Record<Exclude<Step, 'size-custom' | 'submitted'>, string[]> = {
  location: ['В помещении', 'На улице', 'Пока не знаю / нужна консультация'],
  purpose: ['Реклама', 'Информационное табло', 'Сцена / мероприятие', 'Диспетчерская / мониторинг', 'Другое'],
  size: ['До 3 метров', '3–6 метров', 'Более 6 метров', 'Указать точный размер'],
  timeline: ['Срочно', 'В течение месяца', 'Планирую позже / изучаю'],
  contact: []
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour <= 11) return 'Доброе утро';
  if (hour >= 12 && hour <= 16) return 'Добрый день';
  if (hour >= 17 && hour <= 22) return 'Добрый вечер';
  return 'Доброй ночи';
}

function initialMessages(): ChatMessage[] {
  return [
    {
      id: makeId(),
      role: 'bot',
      text: `${getTimeGreeting()}!\nМеня зовут Алсу, я искусственный помощник Sapphire LED 🤖\nПомогу подобрать LED-решение и передам заявку инженеру.`
    },
    { id: makeId(), role: 'bot', text: 'Где будет использоваться экран?' }
  ];
}

function getStepPrompt(step: Step) {
  if (step === 'purpose') return 'Подскажите, какое основное назначение экрана?';
  if (step === 'size') return 'Какой примерный размер экрана нужен?';
  if (step === 'timeline') return 'Какие сроки проекта?';
  if (step === 'contact') return 'Укажите любой удобный способ связи: телефон, Telegram, WhatsApp, e-mail или текстом.';
  return '';
}

const doneText =
  'Спасибо!\nЯ передала вашу заявку настоящему инженеру 👨‍💻\n\nСпециалист свяжется с вами в ближайшее рабочее время, чтобы:\n— уточнить детали\n— подобрать оптимальное LED-решение\n— рассчитать стоимость и сроки\n\nЕсли появятся дополнительные вопросы — можете написать их здесь.';

const postSubmitPrompt = `${getTimeGreeting()} 👌 Я передала заявку инженеру. Что сделать дальше?`;

const initialAnswers: Answers = { location: '', purpose: '', size: '', timeline: '', contact: '' };

function createInitialState(): ChatState {
  return {
    step: 'location',
    messages: initialMessages(),
    answers: initialAnswers,
    updatedAt: Date.now(),
    submittedAt: null
  };
}

function isKnownStep(step: unknown): step is Step {
  return typeof step === 'string' && ['location', 'purpose', 'size', 'size-custom', 'timeline', 'contact', 'submitted'].includes(step);
}

function isValidAnswers(answers: unknown): answers is Answers {
  if (!answers || typeof answers !== 'object') return false;
  const maybeAnswers = answers as Record<keyof Answers, unknown>;
  return (
    typeof maybeAnswers.location === 'string' &&
    typeof maybeAnswers.purpose === 'string' &&
    typeof maybeAnswers.size === 'string' &&
    typeof maybeAnswers.timeline === 'string' &&
    typeof maybeAnswers.contact === 'string'
  );
}

function hasCompletedLead(answers: Answers) {
  return Boolean(answers.location && answers.purpose && answers.size && answers.timeline && answers.contact);
}

function normalizeState(raw: unknown): ChatState {
  const fallback = createInitialState();
  if (!raw || typeof raw !== 'object') return fallback;

  const parsed = raw as Partial<ChatState>;
  if (!isKnownStep(parsed.step) || !Array.isArray(parsed.messages) || !isValidAnswers(parsed.answers)) return fallback;

  const validMessages = parsed.messages
    .filter((item): item is ChatMessage => Boolean(item && typeof item.id === 'string' && (item.role === 'user' || item.role === 'bot') && typeof item.text === 'string'))
    .slice(-50);

  if (!validMessages.length) return fallback;

  const updatedAt = typeof parsed.updatedAt === 'number' && Number.isFinite(parsed.updatedAt) ? parsed.updatedAt : Date.now();
  const submittedAt = typeof parsed.submittedAt === 'number' && Number.isFinite(parsed.submittedAt) ? parsed.submittedAt : null;

  if (parsed.step === 'submitted') {
    const isStale = !submittedAt || Date.now() - submittedAt > SUBMITTED_TTL_MS;
    if (isStale || !hasCompletedLead(parsed.answers)) return fallback;
  }

  return {
    step: parsed.step,
    messages: validMessages,
    answers: parsed.answers,
    updatedAt,
    submittedAt
  };
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [contactInput, setContactInput] = useState('');
  const [contactError, setContactError] = useState('');
  const [state, setState] = useState<ChatState>(createInitialState);
  const [isTyping, setIsTyping] = useState(false);
  const [isSendingLead, setIsSendingLead] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as unknown;
      const normalized = normalizeState(parsed);
      setState(normalized);
      setContactInput(normalized.step === 'contact' ? normalized.answers.contact || '' : '');
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setState(createInitialState());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: Date.now() }));
  }, [state]);

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [state.messages, isTyping]);

  const queueBotMessage = useCallback((text: string) => {
    setIsTyping(true);
    const delay = 500 + Math.round(Math.random() * 700);
    typingTimerRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, updatedAt: Date.now(), messages: [...prev.messages, { id: makeId(), role: 'bot', text }] }));
      setIsTyping(false);
    }, delay);
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  const currentOptions = useMemo(() => {
    if (state.step === 'submitted' || state.step === 'size-custom') return [];
    return stepOptions[state.step];
  }, [state.step]);

  const appendUserMessage = (text: string) => {
    setState((prev) => ({ ...prev, updatedAt: Date.now(), messages: [...prev.messages, { id: makeId(), role: 'user', text }] }));
  };

  const handleFaq = (text: string) => {
    const faq = faqEntries.find((entry) => entry.check.test(text));
    if (!faq) return false;
    appendUserMessage(text);
    queueBotMessage(`${faq.reply}\n\nЕсли удобно, продолжим подбор — ${getStepPrompt(state.step)}`);
    return true;
  };

  const goNext = (field: keyof Answers, value: string, nextStep: Step) => {
    appendUserMessage(value);
    setState((prev) => ({ ...prev, updatedAt: Date.now(), step: nextStep, answers: { ...prev.answers, [field]: value } }));
    const prompt = getStepPrompt(nextStep);
    if (prompt) queueBotMessage(prompt);
  };

  const onOptionClick = (option: string) => {
    if (state.step === 'location') return goNext('location', option, 'purpose');
    if (state.step === 'purpose') return goNext('purpose', option, 'size');
    if (state.step === 'size') {
      if (option === 'Указать точный размер') {
        appendUserMessage(option);
        setState((prev) => ({ ...prev, updatedAt: Date.now(), step: 'size-custom' }));
        queueBotMessage('Напишите точный размер, например: 6×3 м.');
        return;
      }
      return goNext('size', option, 'timeline');
    }
    if (state.step === 'timeline') return goNext('timeline', option, 'contact');
  };

  const resetDialog = () => {
    const initial = createInitialState();
    setInput('');
    setContactInput('');
    setContactError('');
    setIsTyping(false);
    setIsSendingLead(false);
    localStorage.removeItem(STORAGE_KEY);
    setState(initial);
  };

  const startNewLead = () => {
    const initial = createInitialState();
    setInput('');
    setContactInput('');
    setContactError('');
    setState(initial);
  };

  const submitLead = async (contact: string) => {
    setIsSendingLead(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'chat-widget',
          location: state.answers.location,
          purpose: state.answers.purpose,
          size: state.answers.size,
          timeline: state.answers.timeline,
          contact,
          pageUrl: window.location.href,
          pageTitle: document.title,
          history: state.messages.slice(-8)
        })
      });

      const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
      if (!response.ok || !result?.ok) {
        queueBotMessage('Не удалось отправить заявку с первого раза. Давайте попробуем ещё раз — нажмите «Передать инженеру».');
        return;
      }

      setState((prev) => ({
        ...prev,
        step: 'submitted',
        updatedAt: Date.now(),
        submittedAt: Date.now(),
        answers: { ...prev.answers, contact },
        messages: [...prev.messages, { id: makeId(), role: 'bot', text: doneText }, { id: makeId(), role: 'bot', text: postSubmitPrompt }]
      }));
    } catch {
      queueBotMessage('Сейчас есть техническая ошибка отправки. Попробуйте ещё раз — нажмите «Передать инженеру».');
    } finally {
      setIsSendingLead(false);
    }
  };

  const onContactSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = contactInput.trim();
    if (!value) {
      setContactError('Укажите любой удобный способ связи');
      return;
    }

    setContactError('');
    appendUserMessage(value);
    setState((prev) => ({ ...prev, updatedAt: Date.now(), answers: { ...prev.answers, contact: value } }));
    await submitLead(value);
  };

  const onTextSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');

    if (handleFaq(text)) return;

    if (state.step === 'submitted') {
      appendUserMessage(text);
      queueBotMessage('Я на связи 👌 Выберите действие кнопкой ниже: новая заявка, продолжить уточнение или перейти в каталог.');
      return;
    }

    if (state.step === 'size-custom') {
      goNext('size', text, 'timeline');
      return;
    }

    appendUserMessage(text);
    queueBotMessage('Приняла 👌 Чтобы передать корректное ТЗ инженеру, давайте продолжим по шагам.');
    const prompt = getStepPrompt(state.step);
    if (prompt) queueBotMessage(prompt);
  };

  return (
    <>
      <button
        type="button"
        data-chat-open
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-slate-900/95 px-4 py-3 text-sm font-medium text-cyan-100 shadow-[0_12px_36px_rgba(14,116,144,0.35)] transition hover:bg-slate-800"
      >
        <span>Чат с Алсу</span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/80 p-2 backdrop-blur-sm sm:p-4">
          <section className="ml-auto flex h-full w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <span className="relative inline-flex h-10 w-10 overflow-hidden rounded-full border border-white/65 bg-white">
                  {!avatarError ? (
                    <Image
                      src="/visuals/alsu-bot-avatar.jpg"
                      alt="Аватар Алсу"
                      fill
                      className="object-cover"
                      sizes="40px"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-cyan-500 text-white">А</span>
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold">Алсу</p>
                  <p className="text-xs text-cyan-100">Искусственный помощник инженера</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg px-2 py-1 text-sm hover:bg-white/10">
                Закрыть
              </button>
            </header>

            <div ref={messagesRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3">
              {state.messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                      message.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-white text-slate-800 shadow-sm'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping ? <p className="text-xs text-slate-500">Алсу печатает…</p> : null}

              {currentOptions.length > 0 && state.step !== 'contact' ? (
                <div className="flex flex-wrap gap-2">
                  {currentOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onOptionClick(option)}
                      className="rounded-full border border-cyan-300 bg-white px-3 py-1.5 text-xs text-cyan-800 transition hover:bg-cyan-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}

              {state.step === 'contact' ? (
                <form onSubmit={onContactSubmit} className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
                  <input
                    type="text"
                    value={contactInput}
                    onChange={(event) => {
                      setContactInput(event.target.value);
                      if (event.target.value.trim()) setContactError('');
                    }}
                    placeholder="Телефон / Telegram / WhatsApp / e-mail / текст"
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none ${
                      contactError ? 'border-rose-500' : 'border-slate-300 focus:border-cyan-500'
                    }`}
                  />
                  {contactError ? <p className="text-xs text-rose-600">{contactError}</p> : null}
                  <button
                    type="submit"
                    disabled={!contactInput.trim() || isSendingLead}
                    className="w-full rounded-xl bg-cyan-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSendingLead ? 'Передаю инженеру...' : 'Передать инженеру'}
                  </button>
                </form>
              ) : null}

              {state.step === 'submitted' ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={startNewLead}
                    className="rounded-full border border-cyan-300 bg-white px-3 py-1.5 text-xs text-cyan-800 transition hover:bg-cyan-50"
                  >
                    Создать новую заявку
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setState((prev) => ({ ...prev, updatedAt: Date.now(), step: 'contact' }));
                      queueBotMessage('Хорошо, давайте уточним контакт или детали. Укажите удобный способ связи и отправим обновление инженеру.');
                    }}
                    className="rounded-full border border-cyan-300 bg-white px-3 py-1.5 text-xs text-cyan-800 transition hover:bg-cyan-50"
                  >
                    Продолжить уточнение
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') window.location.href = '/catalog';
                    }}
                    className="rounded-full border border-cyan-300 bg-white px-3 py-1.5 text-xs text-cyan-800 transition hover:bg-cyan-50"
                  >
                    Перейти в каталог
                  </button>
                </div>
              ) : null}
            </div>

            <form onSubmit={onTextSubmit} className="border-t border-slate-200 bg-white p-2.5">
              <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder="Напишите вопрос..."
                  rows={1}
                  className="max-h-28 min-h-[38px] flex-1 resize-y bg-transparent px-1 py-1.5 text-sm text-slate-800 outline-none"
                />
                <button type="submit" className="rounded-full bg-cyan-500 px-3 py-2 text-sm text-white">
                  Отправить
                </button>
                <button
                  type="button"
                  onClick={resetDialog}
                  className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-700"
                >
                  Сбросить диалог
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
