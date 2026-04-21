export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[color:var(--cream)]">
      <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
  );
}
