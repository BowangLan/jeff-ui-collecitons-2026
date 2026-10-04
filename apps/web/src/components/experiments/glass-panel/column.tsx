import { cn } from "../../../lib/utils";

export const Column = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div className={cn("flex flex-col gap-2", className)} style={style}>
    {children}
  </div>
);
