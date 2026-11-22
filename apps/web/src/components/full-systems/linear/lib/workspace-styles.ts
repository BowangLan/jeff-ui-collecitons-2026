export const workspaceSurface =
  "[--linear-paper:#fcfbf7] [--linear-surface:#f4f2eb] [--linear-rule:#e6e3d9] [--linear-ink:#242b25] [--linear-muted:#60675e] [--linear-accent:#285641] [--linear-selected:#e8efe6] [--linear-side:#253b31] [--linear-side-ink:#f3f3e9] [--linear-side-muted:#bdcbbc] bg-[var(--linear-paper)] text-[var(--linear-ink)] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-[#589b7a]";

const button =
  "inline-flex min-h-8 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-2.5 text-xs font-semibold focus-visible:outline-offset-2";

export const controlButton = `${button} text-[var(--linear-muted)] hover:border-[var(--linear-rule)] hover:bg-[var(--linear-surface)] hover:text-[var(--linear-ink)] aria-pressed:bg-[var(--linear-selected)] aria-pressed:text-[var(--linear-accent)] data-[state=open]:border-[var(--linear-rule)] data-[state=open]:bg-[var(--linear-surface)] data-[state=open]:text-[var(--linear-ink)]`;

export const primaryButton = `${button} bg-[var(--linear-accent)] text-[var(--linear-side-ink)] hover:bg-[var(--linear-side)]`;

export const popup = `${workspaceSurface} z-30 rounded-lg border border-[var(--linear-rule)] shadow-[0_8px_30px_#242b2524]`;

export const field =
  "min-h-9 w-full min-w-0 rounded-md border border-[var(--linear-rule)] bg-[var(--linear-paper)] px-2.5 text-[13px] text-[var(--linear-ink)]";
