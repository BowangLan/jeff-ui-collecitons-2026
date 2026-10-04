import { cn } from "../../../lib/utils";

export const BoxVariant = {
  default: "bg-white/4",
  highlight: "bg-white/10 border border-white/5",
} as const;

export const Box = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={cn(
      "min-w-0 flex-1 flex flex-col items-start justify-stretch text-sm",
      BoxVariant.default,
      className,
    )}
    style={{ borderRadius: 22, padding: 16, ...style }}
  >
    {children}
  </div>
);
