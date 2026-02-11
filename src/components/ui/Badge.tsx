export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">{children}</span>;
}
