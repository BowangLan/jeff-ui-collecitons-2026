import {
  ArrowRight,
  ExternalLink,
  FileDiff,
  GitBranch,
  GitPullRequest,
  RefreshCw,
} from "lucide-react";
import type { RecreationConfig } from "../../types/recreation";

export const config = {
  name: "Git Project Summary Card",
  description:
    "A compact local repository card that makes working-tree diff status the first thing you see.",
  author: "Jeff UI Collections",
  version: "1.0.0",
  url: "",
  license: "MIT",
  tags: ["experiment", "git", "status", "card"],
  category: "experiments",
} satisfies RecreationConfig;

type GitProjectSummaryCardProps = {
  repoName: string;
  path: string;
  branch: string;
  prNumber: number;
  prUrl: string;
  prState: string;
  ci: {
    name: string;
    statuses: {
      status: string;
      variant: "running" | "success" | "skip" | "failed";
      subtitle: string;
    }[];
  }[];
  lastFetched: string;
  baseBranch: string;
  changedFiles: number;
  additions: number;
  deletions: number;
  stagedFiles: number;
  unstagedFiles: number;
  untrackedFiles: number;
  files: {
    path: string;
    additions: number;
    deletions: number;
  }[];
};

type CiStatusVariant =
  GitProjectSummaryCardProps["ci"][number]["statuses"][number]["variant"];

const ciStatusVariants = {
  running: {
    text: "text-amber-700 dark:text-amber-300",
    progress: "bg-amber-500",
  },
  success: {
    text: "text-emerald-700 dark:text-emerald-300",
    progress: "bg-emerald-500",
  },
  skip: {
    text: "text-neutral-500 dark:text-neutral-400",
    progress: "bg-neutral-400 dark:bg-neutral-700",
  },
  failed: {
    text: "text-red-700 dark:text-red-300",
    progress: "bg-red-500",
  },
} satisfies Record<CiStatusVariant, { text: string; progress: string }>;

const projects: GitProjectSummaryCardProps[] = [
  {
    repoName: "jeff-ui-collections",
    path: "~/Dev/jeff-ui-collecitons-2026",
    branch: "feature/git-project-card",
    prNumber: 42,
    prUrl: "https://github.com/bowanglan/jeff-ui-collecitons-2026/pull/42",
    prState: "Draft",
    ci: [
      {
        name: "GitHub Actions",
        statuses: [
          {
            status: "Checks running",
            variant: "running",
            subtitle: "5 checks passed, 2 running, 1 queued",
          },
          {
            status: "Preview deploy skipped",
            variant: "skip",
            subtitle: "Preview deployment skipped for draft PR",
          },
        ],
      },
      {
        name: "Code review bots",
        statuses: [
          {
            status: "Bot review skipped",
            variant: "skip",
            subtitle: "Bot review skipped until the PR is ready",
          },
        ],
      },
      {
        name: "TypeScript",
        statuses: [
          {
            status: "Typecheck passed",
            variant: "success",
            subtitle: "Project references compiled cleanly",
          },
        ],
      },
      {
        name: "Lint",
        statuses: [
          {
            status: "Lint passed",
            variant: "success",
            subtitle: "ESLint completed with no warnings",
          },
        ],
      },
      {
        name: "Chromatic",
        statuses: [
          {
            status: "Visual review running",
            variant: "running",
            subtitle: "3 snapshots accepted, 2 still rendering",
          },
        ],
      },
      {
        name: "Bundle analysis",
        statuses: [
          {
            status: "Size check skipped",
            variant: "skip",
            subtitle: "Bundle check skipped without production artifact",
          },
        ],
      },
    ],
    lastFetched: "18s ago",
    baseBranch: "main",
    changedFiles: 9,
    additions: 428,
    deletions: 73,
    stagedFiles: 3,
    unstagedFiles: 5,
    untrackedFiles: 1,
    files: [
      {
        path: "apps/web/src/components/experiments/git-project-summary-card.tsx",
        additions: 211,
        deletions: 0,
      },
      { path: "apps/web/src/main.tsx", additions: 12, deletions: 4 },
      { path: "apps/web/src/pages/home.tsx", additions: 28, deletions: 18 },
      { path: "apps/web/src/types/recreation.ts", additions: 2, deletions: 1 },
    ],
  },
  {
    repoName: "linear-design-system",
    path: "~/Dev/linear-design-system",
    branch: "design/tokens-refresh",
    prNumber: 18,
    prUrl: "https://github.com/bowanglan/linear-design-system/pull/18",
    prState: "Ready",
    ci: [
      {
        name: "GitHub Actions",
        statuses: [
          {
            status: "Checks passed",
            variant: "success",
            subtitle: "8 checks passed",
          },
        ],
      },
      {
        name: "Vercel",
        statuses: [
          {
            status: "Preview deployed",
            variant: "success",
            subtitle: "Preview deployment is ready",
          },
        ],
      },
      {
        name: "Percy",
        statuses: [
          {
            status: "Visual diffs approved",
            variant: "success",
            subtitle: "24 snapshots matched baseline",
          },
        ],
      },
      {
        name: "Security",
        statuses: [
          {
            status: "Dependency scan passed",
            variant: "success",
            subtitle: "No vulnerable production dependencies",
          },
        ],
      },
    ],
    lastFetched: "2m ago",
    baseBranch: "develop",
    changedFiles: 14,
    additions: 812,
    deletions: 126,
    stagedFiles: 8,
    unstagedFiles: 6,
    untrackedFiles: 0,
    files: [
      { path: "packages/ui/tokens/colors.ts", additions: 180, deletions: 42 },
      { path: "packages/ui/components/button.tsx", additions: 51, deletions: 18 },
    ],
  },
  {
    repoName: "portfolio-labs",
    path: "~/Dev/portfolio-labs",
    branch: "main",
    prNumber: 7,
    prUrl: "https://github.com/bowanglan/portfolio-labs/pull/7",
    prState: "Open",
    ci: [
      {
        name: "GitHub Actions",
        statuses: [
          {
            status: "Review required",
            variant: "failed",
            subtitle: "3 checks passed, 2 failed, 1 skipped",
          },
        ],
      },
      {
        name: "Vercel",
        statuses: [
          {
            status: "Preview failed",
            variant: "failed",
            subtitle: "Build failed during route generation",
          },
        ],
      },
      {
        name: "CodeQL",
        statuses: [
          {
            status: "Scan passed",
            variant: "success",
            subtitle: "No alerts introduced by this branch",
          },
        ],
      },
      {
        name: "Playwright",
        statuses: [
          {
            status: "E2E retrying",
            variant: "running",
            subtitle: "7 specs passed, 2 specs retrying",
          },
        ],
      },
      {
        name: "Lighthouse",
        statuses: [
          {
            status: "Performance audit skipped",
            variant: "skip",
            subtitle: "Lighthouse skipped after preview build failure",
          },
        ],
      },
    ],
    lastFetched: "9m ago",
    baseBranch: "main",
    changedFiles: 5,
    additions: 96,
    deletions: 44,
    stagedFiles: 0,
    unstagedFiles: 4,
    untrackedFiles: 1,
    files: [
      { path: "apps/site/src/app/page.tsx", additions: 61, deletions: 20 },
      { path: "apps/site/src/app/globals.css", additions: 35, deletions: 24 },
    ],
  },
];

type BranchLabelProps = {
  branch: string;
  muted?: boolean;
};

function BranchLabel({ branch, muted = false }: BranchLabelProps) {
  const textColor = muted
    ? "text-neutral-500 dark:text-neutral-400"
    : "text-neutral-950 dark:text-neutral-50";

  return (
    <div className="flex min-w-0 items-center gap-1.5 text-sm">
      <GitBranch
        aria-hidden
        className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
        strokeWidth={1.8}
      />
      <span className={`truncate ${textColor}`}>{branch}</span>
    </div>
  );
}

function getPrStateTone(state: string) {
  switch (state.toLowerCase()) {
    case "ready":
      return {
        dot: "bg-emerald-400",
        pill:
          "border-emerald-200/70 bg-emerald-50/60 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/25 dark:text-emerald-300",
      };
    case "draft":
      return {
        dot: "bg-amber-400",
        pill:
          "border-amber-200/70 bg-amber-50/60 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/25 dark:text-amber-300",
      };
    default:
      return {
        dot: "bg-sky-400",
        pill:
          "border-sky-200/70 bg-sky-50/60 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/25 dark:text-sky-300",
      };
  }
}

function getProjectPulse({
  hasFailedCi,
  hasRunningCi,
  isDraft,
  isFullyPassed,
}: {
  hasFailedCi: boolean;
  hasRunningCi: boolean;
  isDraft: boolean;
  isFullyPassed: boolean;
}) {
  if (hasFailedCi) {
    return "Needs a closer look";
  }

  if (isFullyPassed) {
    return "All signals green";
  }

  if (hasRunningCi) {
    return "Checks still moving";
  }

  if (isDraft) {
    return "Draft, still shaping up";
  }

  return "Waiting on the last signal";
}

function getCiAggregation(project: GitProjectSummaryCardProps) {
  const ciStatuses = project.ci.flatMap((ci) => ci.statuses);
  const ciStatusCount = ciStatuses.length;
  const ciStatusCounts = ciStatuses.reduce<Record<CiStatusVariant, number>>(
    (counts, status) => {
      counts[status.variant] += 1;
      return counts;
    },
    { success: 0, running: 0, failed: 0, skip: 0 },
  );
  const ciStatusGroups = (
    [
      { variant: "success", label: "passing" },
      { variant: "running", label: "running" },
      { variant: "failed", label: "failing" },
      { variant: "skip", label: "skipped" },
    ] as const
  ).reduce<
    {
      variant: CiStatusVariant;
      label: string;
      count: number;
    }[]
  >((groups, group) => {
    const count = ciStatusCounts[group.variant];

    if (count > 0) {
      groups.push({ ...group, count });
    }

    return groups;
  }, []);
  const passedCiCount = project.ci.filter((ci) =>
    ci.statuses.every((status) => status.variant === "success"),
  ).length;

  return {
    ciStatuses,
    ciStatusCount,
    ciStatusCounts,
    ciStatusGroups,
    passedCiCount,
  };
}

function GitProjectSummaryCard(project: GitProjectSummaryCardProps) {
  const {
    ciStatuses,
    ciStatusCount,
    ciStatusCounts,
    ciStatusGroups,
    passedCiCount,
  } = getCiAggregation(project);
  const passedCiStatuses = ciStatuses.filter(
    (status) => status.variant === "success",
  );
  const prStateTone = getPrStateTone(project.prState);
  const projectPulse = getProjectPulse({
    hasFailedCi: ciStatusCounts.failed > 0,
    hasRunningCi: ciStatusCounts.running > 0,
    isDraft: project.prState.toLowerCase() === "draft",
    isFullyPassed: passedCiCount === project.ci.length,
  });

  return (
    <section
      className="group/card w-full rounded-xl border border-neutral-200 bg-white p-4 shadow-sm motion-safe:transition-[border-color,box-shadow] motion-safe:duration-200 hover:border-neutral-300 hover:shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-black/10 sm:p-5"
      aria-label={`${project.repoName} repository summary`}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="truncate text-xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50">
            {project.repoName}
          </h1>
          <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
            {project.path}
          </p>
        </div>
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${prStateTone.pill}`}
        >
          <span
            aria-hidden
            className={`h-1.5 w-1.5 rounded-full ${prStateTone.dot}`}
          />
          {project.prState}
        </span>
      </header>

      <div className="mt-5 space-y-5 border-t border-neutral-200 pt-5 dark:border-neutral-800">
        <section className="space-y-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
            <BranchLabel branch={project.branch} />
            <ArrowRight
              aria-hidden
              className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
              strokeWidth={1.8}
            />
            <BranchLabel branch={project.baseBranch} muted />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="min-w-0">
              <div className="text-xl font-medium tracking-tight tabular-nums text-neutral-950 dark:text-neutral-50">
                {project.changedFiles}
              </div>
              <div className="mt-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                changed
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-xl font-medium tracking-tight tabular-nums text-emerald-600 dark:text-emerald-500">
                +{project.additions}
              </div>
              <div className="mt-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                additions
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-xl font-medium tracking-tight tabular-nums text-red-600 dark:text-red-500">
                -{project.deletions}
              </div>
              <div className="mt-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                deletions
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <span className="rounded-full bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
              {project.stagedFiles} staged
            </span>
            <span className="rounded-full bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
              {project.unstagedFiles} unstaged
            </span>
            <span className="rounded-full bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
              {project.untrackedFiles} untracked
            </span>
          </div>
        </section>

        <section className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2 text-sm">
                <GitPullRequest
                  aria-hidden
                  className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
                  strokeWidth={1.8}
                />
                <a
                  href={project.prUrl}
                  className="rounded-sm font-medium text-neutral-950 underline-offset-4 transition-colors hover:text-neutral-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:text-neutral-50 dark:hover:text-neutral-300 dark:focus-visible:outline-neutral-50"
                >
                  #{project.prNumber}
                </a>
                <ArrowRight
                  aria-hidden
                  className="h-4 w-4 text-neutral-500 dark:text-neutral-400"
                  strokeWidth={1.8}
                />
                <span className="truncate text-neutral-500 dark:text-neutral-400">
                  {project.baseBranch}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {projectPulse}
              </p>
            </div>
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {passedCiCount}/{project.ci.length} CI groups passed
            </span>
          </div>
          <div
            className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
            role="progressbar"
            aria-label="CI statuses progress"
            aria-valuemin={0}
            aria-valuemax={ciStatusCount}
            aria-valuenow={passedCiStatuses.length}
          >
            {ciStatusGroups.map((group) => (
              <div
                key={group.variant}
                className={`h-full motion-safe:transition-opacity group-hover/card:opacity-90 ${ciStatusVariants[group.variant].progress} ${group.variant === "running" ? "motion-safe:animate-pulse" : ""
                  }`}
                style={{
                  width: `${(group.count / ciStatusCount) * 100}%`,
                }}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            {ciStatusGroups.map((group) => (
              <span key={group.variant} className="inline-flex items-center gap-1">
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 rounded-full ${ciStatusVariants[group.variant].progress
                    } ${group.variant === "running" ? "motion-safe:animate-pulse" : ""
                    }`}
                />
                <span className="tabular-nums">{group.count}</span>
                <span>{group.label}</span>
              </span>
            ))}
          </div>
        </section>

        <footer className="flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-4 text-xs dark:border-neutral-800">
          <a
            href={project.prUrl}
            className="group/action inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-neutral-100 px-2.5 py-1.5 font-medium text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 active:translate-y-px dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 dark:focus-visible:outline-neutral-50"
          >
            <ExternalLink
              aria-hidden
              className="h-3.5 w-3.5 motion-safe:transition-transform group-hover/action:translate-x-px"
              strokeWidth={1.8}
            />
            Open PR
          </a>
          <a
            href={`${project.prUrl}/files`}
            className="group/action inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1.5 font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 active:translate-y-px dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:focus-visible:outline-neutral-50"
          >
            <FileDiff
              aria-hidden
              className="h-3.5 w-3.5 motion-safe:transition-transform group-hover/action:-translate-y-px"
              strokeWidth={1.8}
            />
            Review files
          </a>
          <button
            type="button"
            title={`Last fetched ${project.lastFetched}`}
            className="group/action inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1.5 font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 active:translate-y-px dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:focus-visible:outline-neutral-50"
          >
            <RefreshCw
              aria-hidden
              className="h-3.5 w-3.5 motion-safe:transition-transform group-hover/action:rotate-45"
              strokeWidth={1.8}
            />
            Fetch
          </button>
          <span className="text-neutral-500 dark:text-neutral-400 sm:ml-auto">
            Synced {project.lastFetched}
          </span>
        </footer>
      </div>
    </section>
  );
}

function GitProjectSummaryCardMinified(project: GitProjectSummaryCardProps) {
  const { ciStatuses, ciStatusCount, ciStatusGroups, passedCiCount } =
    getCiAggregation(project);
  const passedCiStatuses = ciStatuses.filter(
    (status) => status.variant === "success",
  );
  const prStateTone = getPrStateTone(project.prState);

  return (
    <section
      className="@container/card-mini group/card-mini w-full rounded-xl border border-neutral-200 bg-white p-3 shadow-sm motion-safe:transition-[border-color,box-shadow] motion-safe:duration-200 hover:border-neutral-300 hover:shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-black/10"
      aria-label={`${project.repoName} repository summary (compact)`}
    >
      <div className="grid min-w-0 gap-3 @2xl/card-mini:grid-cols-[minmax(0,1fr)_auto_minmax(9rem,10rem)] @2xl/card-mini:items-center">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate text-sm font-medium tracking-tight text-neutral-950 dark:text-neutral-50">
              {project.repoName}
            </h2>
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase leading-none tracking-wide ${prStateTone.pill}`}
            >
              <span
                aria-hidden
                className={`h-1 w-1 rounded-full ${prStateTone.dot}`}
              />
              {project.prState}
            </span>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            <GitBranch
              aria-hidden
              className="h-3 w-3 shrink-0 text-neutral-400"
              strokeWidth={1.8}
            />
            <span className="min-w-0 max-w-full truncate font-mono text-[11px] text-neutral-600 dark:text-neutral-300 @2xl/card-mini:max-w-[16rem]">
              {project.branch}
            </span>
            <div className="flex-1"></div>
            <a
              href={project.prUrl}
              className="inline-flex shrink-0 items-center gap-0.5 rounded-sm text-neutral-700 underline-offset-2 hover:text-neutral-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-950 dark:text-neutral-300 dark:hover:text-neutral-50 dark:focus-visible:outline-neutral-50"
            >
              #{project.prNumber}
              {/* <ExternalLink
                aria-hidden
                className="h-2.5 w-2.5 opacity-70"
                strokeWidth={1.8}
              /> */}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 overflow-hidden text-left text-base tabular-nums @2xl/card-mini:w-46">
          <span className="font-medium text-emerald-600">+{project.additions}</span>
          <span className="font-medium text-red-600">- {project.deletions}</span>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <div
            className="flex h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
            role="progressbar"
            aria-label="CI statuses (compact)"
            aria-valuemin={0}
            aria-valuemax={ciStatusCount}
            aria-valuenow={passedCiStatuses.length}
          >
            {ciStatusGroups.map((group) => (
              <div
                key={group.variant}
                className={`h-full ${ciStatusVariants[group.variant].progress} ${group.variant === "running"
                  ? "motion-safe:animate-pulse"
                  : ""
                  }`}
                style={{
                  width: `${(group.count / ciStatusCount) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-56px)] w-full bg-neutral-50 px-4 py-8 dark:bg-neutral-950 sm:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 sm:gap-10">
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Full card
          </h2>
          <article className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
            {projects.map((project) => (
              <GitProjectSummaryCard key={project.repoName} {...project} />
            ))}
          </article>
        </section>
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Minified
          </h2>
          <article className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
            {projects.map((project) => (
              <GitProjectSummaryCardMinified
                key={`mini-${project.repoName}`}
                {...project}
              />
            ))}
          </article>
        </section>
      </div>
    </div>
  );
}
