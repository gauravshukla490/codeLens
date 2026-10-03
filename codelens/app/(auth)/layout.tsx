import { requireUnauth } from "@/features/auth/actions";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUnauth()
  return (
    <div className="bg-navy-hero relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      <div className="animate-fade-up relative w-full max-w-sm">{children}</div>
    </div>
  );
}