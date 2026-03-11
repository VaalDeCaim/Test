"use client";

import {FileCheckCorner} from "lucide-react";

type StatementFlowLogoProps = {
  /** Optional click handler (e.g. scroll to top or navigate home). Renders as button when set. */
  onClick?: () => void;
  className?: string;
};

export function StatementFlowLogo({
  onClick,
  className = "",
}: StatementFlowLogoProps) {
  const content = (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border-1 border-current text-foreground">
        <FileCheckCorner aria-hidden className="size-4" strokeWidth={2.25} />
      </span>
      <span className="font-bold tracking-tight text-foreground text-sm md:text-base">
        StatementFlow
      </span>
    </>
  );

  const baseClass = "flex items-center gap-2 cursor-pointer text-foreground";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} ${className}`.trim()}
        aria-label="StatementFlow home"
      >
        {content}
      </button>
    );
  }

  return (
    <span
      aria-hidden
      className={`${baseClass} ${className}`.trim()}
    >
      {content}
    </span>
  );
}
