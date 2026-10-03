import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  className?: string;
  /** Hide the wordmark and show only the mark. */
  markOnly?: boolean;
};

/** CodeLens brand mark + wordmark. */
export function Logo({ href = "/", className, markOnly = false }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="CodeLens home"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
        <MagnifyingGlass weight="bold" className="size-4" />
      </span>
      {markOnly ? null : (
        <span className="font-display text-xl tracking-tight">CodeLens</span>
      )}
    </Link>
  );
}
