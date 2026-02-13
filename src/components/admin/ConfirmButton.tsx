'use client';

export function ConfirmButton({ text, confirmText }: { text: string; confirmText: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(confirmText)) {
          event.preventDefault();
        }
      }}
      className="rounded-lg border border-rose-400/40 px-3 py-2 text-sm text-rose-300"
    >
      {text}
    </button>
  );
}
