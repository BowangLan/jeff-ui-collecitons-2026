import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Circle,
  Command,
  Filter,
  GitBranch,
  Globe,
  Inbox,
  Layers3,
  ListTodo,
  MessagesSquare,
  MoonStar,
  PanelLeftClose,
  Plus,
  Search,
  Settings2,
  Sparkles,
  TriangleAlert,
  UserCircle2,
  Users,
} from "lucide-react";
import type { CollectionConfig } from "../../types/collection";

export const config = {
  name: "Linear Design System",
  description:
    "A token map and component library study of Linear's dark desktop interface, with recreated issue-management surfaces.",
  author: "OpenAI Codex",
  version: "0.1.0",
  url: "https://linear.app",
  license: "Reference study",
  tags: ["linear", "design-system", "tokens", "components", "dark-ui"],
  category: "design-systems",
} satisfies CollectionConfig;

type ColorToken = {
  name: string;
  value: string;
  usage: string;
};

type SpecToken = {
  name: string;
  value: string;
  note: string;
};

type NavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  count?: string;
};

type Issue = {
  id: string;
  title: string;
  state: "In Review" | "In Progress" | "Todo";
  team: string;
  labels: { name: string; color: string }[];
  project: string;
  estimate: string;
  age: string;
  date: string;
  assignee: string;
};

const colorTokens: ColorToken[] = [
  { name: "canvas", value: "#08090b", usage: "Window frame and app chrome" },
  { name: "surface-0", value: "#0f1013", usage: "Main panel background" },
  { name: "surface-1", value: "#131417", usage: "Elevated cards and toolbars" },
  { name: "surface-2", value: "#1a1b1f", usage: "Hovered rows and active tabs" },
  { name: "surface-3", value: "#22242a", usage: "Inputs, pills, segmented tabs" },
  { name: "border-subtle", value: "#24262c", usage: "Hairline separators" },
  { name: "border-strong", value: "#31343c", usage: "Active outlines and focus" },
  { name: "text-primary", value: "#f3f4f6", usage: "Primary content" },
  { name: "text-secondary", value: "#b4b7c2", usage: "Meta labels and icons" },
  { name: "text-tertiary", value: "#7d828f", usage: "Disabled and passive chrome" },
  { name: "accent-blue", value: "#5e6ad2", usage: "Brand accents and selected states" },
  { name: "accent-green", value: "#32d074", usage: "Success and review status" },
  { name: "accent-yellow", value: "#f5c451", usage: "In-progress status" },
  { name: "accent-red", value: "#ff6b6b", usage: "Bug tags and destructive feedback" },
];

const typeTokens: SpecToken[] = [
  { name: "font-family", value: "Inter / system sans", note: "Tight, compact desktop UI rhythm" },
  { name: "display", value: "32 / 40 / 600", note: "Section-leading headlines" },
  { name: "title", value: "20 / 28 / 600", note: "Surface headers and dialog titles" },
  { name: "body", value: "14 / 20 / 500", note: "Default row content" },
  { name: "meta", value: "12 / 16 / 500", note: "Secondary chrome and pills" },
];

const layoutTokens: SpecToken[] = [
  { name: "radius-xs", value: "6px", note: "Tags, badges, compact pills" },
  { name: "radius-sm", value: "8px", note: "Buttons, tabs, input shells" },
  { name: "radius-md", value: "10px", note: "Panels and popovers" },
  { name: "space-1", value: "4px", note: "Icon gutters and tiny offsets" },
  { name: "space-2", value: "8px", note: "Dense row spacing" },
  { name: "space-3", value: "12px", note: "Default control padding" },
  { name: "space-4", value: "16px", note: "Panel padding and layout gaps" },
  { name: "space-6", value: "24px", note: "Section separation" },
  { name: "shadow-floating", value: "0 18px 48px rgba(0,0,0,0.45)", note: "Menus and dialogs" },
  { name: "motion-fast", value: "120ms ease-out", note: "Hover and press feedback" },
  { name: "motion-base", value: "180ms ease-out", note: "Filters, tabs, panel swaps" },
];

const primaryNav: NavItem[] = [
  { label: "Inbox", icon: Inbox, count: "4" },
  { label: "My issues", icon: ListTodo, active: true },
  { label: "Initiatives", icon: Sparkles },
  { label: "Projects", icon: Layers3 },
  { label: "Views", icon: PanelLeftClose },
];

const teamNav: NavItem[] = [
  { label: "Triage", icon: TriangleAlert, count: "25" },
  { label: "Issues", icon: Circle },
  { label: "Cycles", icon: Bell },
  { label: "Projects", icon: Globe },
];

const issues: Issue[] = [
  {
    id: "ENG-1064",
    title: "[Frontend/Backend/Database] Add Trips Management to Crew Timeline",
    state: "In Review",
    team: "GeoSpatios",
    labels: [
      { name: "Feature", color: "#8f5cf7" },
      { name: "Operations", color: "#4da8ff" },
    ],
    project: "Spirit Airline Demo",
    estimate: "8",
    age: "1d 2h",
    date: "Apr 10",
    assignee: "AL",
  },
  {
    id: "GEO-52",
    title: "[Frontend] Crew Ops Scheduler UX Refactor",
    state: "In Review",
    team: "GeoSpatios",
    labels: [{ name: "#167", color: "#2ec27e" }],
    project: "Spirit Airline Demo V2",
    estimate: "5",
    age: "1d 2h",
    date: "Apr 7",
    assignee: "JW",
  },
  {
    id: "ENG-1016",
    title: "[Frontend/Backend/Database] Introduce AircraftType Table & Add Support",
    state: "In Review",
    team: "GeoSpatios",
    labels: [{ name: "#1", color: "#f5c451" }],
    project: "Spirit Airline",
    estimate: "3",
    age: "1d 2h",
    date: "Apr 3",
    assignee: "PL",
  },
  {
    id: "GEO-53",
    title: "[Frontend/Backend/Database] Crew Ops PRD",
    state: "In Progress",
    team: "GeoSpatios",
    labels: [{ name: "PRD", color: "#5e6ad2" }],
    project: "Spirit Airline Demo V2",
    estimate: "1",
    age: "1w",
    date: "Apr 16",
    assignee: "MJ",
  },
  {
    id: "ENG-1079",
    title: "[Frontend/Backend/Database] Aircraft Type Crew Composition Verification",
    state: "Todo",
    team: "GeoSpatios",
    labels: [
      { name: "Backend", color: "#f5c451" },
      { name: "Frontend", color: "#23c1e6" },
    ],
    project: "Spirit Airline Demo",
    estimate: "6",
    age: "5d",
    date: "Apr 14",
    assignee: "NN",
  },
  {
    id: "GEO-48",
    title: "[Frontend] Add Multi-Select Support to Crew Timeline / Gantt View",
    state: "Todo",
    team: "GeoSpatios",
    labels: [],
    project: "Spirit Airline Demo V2",
    estimate: "6",
    age: "6d",
    date: "Apr 7",
    assignee: "RC",
  },
  {
    id: "ENG-1025",
    title: "[Frontend/Backend] Export button in CrewList is non-functional",
    state: "Todo",
    team: "GeoSpatios",
    labels: [{ name: "Bug", color: "#ff6b6b" }],
    project: "Spirit Airline Demo",
    estimate: "6",
    age: "6d",
    date: "Apr 4",
    assignee: "AL",
  },
];

const groupedIssues = [
  { title: "In Review", tone: "green", items: issues.filter((issue) => issue.state === "In Review") },
  { title: "In Progress", tone: "yellow", items: issues.filter((issue) => issue.state === "In Progress") },
  { title: "Todo", tone: "neutral", items: issues.filter((issue) => issue.state === "Todo") },
] as const;

function clsx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function TokenCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[10px] border border-white/8 bg-white/[0.035] p-4">
      <div className="text-[11px] uppercase tracking-[0.14em] text-[#767b87]">{title}</div>
      <div className="mt-3 text-sm font-medium text-[#f3f4f6]">{value}</div>
      <div className="mt-1 text-xs leading-5 text-[#989daa]">{note}</div>
    </div>
  );
}

function StatusDot({ tone }: { tone: "green" | "yellow" | "neutral" }) {
  const classes = {
    green: "border-[#28c76f] text-[#28c76f]",
    yellow: "border-[#f2c94c] text-[#f2c94c]",
    neutral: "border-[#d7dae0] text-[#d7dae0]",
  };

  return (
    <span
      className={clsx(
        "inline-flex h-4 w-4 items-center justify-center rounded-full border",
        classes[tone]
      )}
    >
      {tone === "green" ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : tone === "yellow" ? (
        <Circle className="h-2.5 w-2.5 fill-current" />
      ) : (
        <Circle className="h-2.5 w-2.5" />
      )}
    </span>
  );
}

function LinearButton({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "primary" | "ghost";
}) {
  const classes = {
    default: "border-white/8 bg-white/[0.045] text-[#f3f4f6] hover:bg-white/[0.08]",
    primary: "border-[#6d78e8] bg-[#5e6ad2] text-white hover:bg-[#6a76e0]",
    ghost: "border-transparent bg-transparent text-[#b4b7c2] hover:bg-white/[0.05] hover:text-white",
  };

  return (
    <button
      type="button"
      className={clsx(
        "inline-flex h-9 items-center gap-2 rounded-[8px] border px-3 text-[13px] font-medium transition-colors duration-150",
        classes[tone]
      )}
    >
      {children}
    </button>
  );
}

function SidebarItem({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      className={clsx(
        "flex h-10 w-full items-center gap-3 rounded-[8px] px-3 text-left text-[14px] transition-colors duration-150",
        item.active
          ? "bg-white/[0.08] text-white"
          : "text-[#989daa] hover:bg-white/[0.04] hover:text-white"
      )}
      style={{ paddingLeft: 12 + depth * 12 }}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.count ? <span className="text-[12px] text-[#737887]">{item.count}</span> : null}
    </button>
  );
}

function IssueRow({ issue }: { issue: Issue }) {
  return (
    <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,2.7fr)_minmax(0,1.65fr)_auto_auto_auto] items-center gap-4 border-t border-white/[0.045] px-6 py-4 first:border-t-0">
      <div className="flex min-w-0 items-center gap-3 text-[#9a9fab]">
        <div className="flex h-5 w-5 items-center justify-center text-[#6f7480]">
          <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
            <rect x="1.5" y="8.5" width="2.5" height="6" rx="0.8" />
            <rect x="6.75" y="5.5" width="2.5" height="9" rx="0.8" />
            <rect x="12" y="2.5" width="2.5" height="12" rx="0.8" />
          </svg>
        </div>
        <span className="truncate">{issue.id}</span>
      </div>

      <div className="min-w-0 text-[14px] font-medium text-[#f3f4f6]">
        <div className="truncate">{issue.title}</div>
      </div>

      <div className="flex min-w-0 items-center gap-2 overflow-hidden">
        {issue.labels.map((label) => (
          <span
            key={`${issue.id}-${label.name}`}
            className="inline-flex h-8 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 text-[12px] text-[#b4b7c2]"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: label.color }}
            />
            <span className="truncate">{label.name}</span>
          </span>
        ))}
        <span className="truncate rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12px] text-[#9ea3af]">
          {issue.project}
        </span>
      </div>

      <div className="flex items-center gap-2 text-[13px] text-[#979ca8]">
        <GitBranch className="h-3.5 w-3.5" />
        {issue.estimate}
      </div>

      <div className="text-[13px] text-[#c6a73d]">{issue.age}</div>

      <div className="flex items-center gap-3 text-[13px] text-[#989daa]">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#f5d29b] to-[#b56f51] text-[10px] font-semibold text-black">
          {issue.assignee}
        </div>
        <span>{issue.date}</span>
      </div>
    </div>
  );
}

function ReferenceCard() {
  return (
    <div className="rounded-[14px] border border-white/8 bg-[#111216] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <img
        src="/references/linear/my-issues-docs.png"
        alt="Linear My Issues reference screenshot"
        className="w-full rounded-[10px] border border-white/6"
      />
      <div className="mt-3 flex items-center justify-between gap-3 px-1 text-[12px] text-[#8d929e]">
        <span>Saved reference</span>
        <a
          href="/references/linear/my-issues-docs.png"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[#c6cad4] transition-colors hover:text-white"
        >
          Open image
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

function IssueBoardRecreation() {
  return (
    <section className="rounded-[18px] border border-white/8 bg-[#0d0e11] p-4 shadow-[0_26px_100px_rgba(0,0,0,0.55)]">
      <div className="rounded-[18px] border border-white/8 bg-[#090a0c]">
        <div className="flex items-center gap-3 border-b border-white/[0.05] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="mx-auto flex w-full max-w-[420px] items-center gap-3 rounded-[10px] border border-white/[0.06] bg-white/[0.04] px-4 py-2 text-[14px] text-[#f3f4f6]">
            <Command className="h-4 w-4 text-[#8e93a0]" />
            <span>My issues</span>
          </div>
          <button type="button" className="text-[#8e93a0]">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="grid min-h-[780px] grid-cols-[300px_minmax(0,1fr)]">
          <aside className="border-r border-white/[0.05] bg-black px-4 py-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111318]">
                  <div className="h-5 w-5 rounded-full border border-white/15" />
                </div>
                <div className="text-[15px] font-medium text-[#f3f4f6]">GeoSpatios</div>
              </div>
              <div className="flex items-center gap-3 text-[#8f95a3]">
                <Search className="h-4 w-4" />
                <SquarePenIcon />
              </div>
            </div>

            <div className="mt-6 space-y-1">
              {primaryNav.map((item) => (
                <SidebarItem key={item.label} item={item} />
              ))}
            </div>

            <div className="mt-7 px-3 text-[12px] font-medium text-[#717683]">Workspace</div>
            <div className="mt-2 space-y-1">
              {[
                { label: "Initiatives", icon: Sparkles },
                { label: "Projects", icon: Layers3 },
                { label: "Views", icon: PanelLeftClose },
                { label: "More", icon: Bell },
              ].map((item) => (
                <SidebarItem key={item.label} item={item} />
              ))}
            </div>

            <div className="mt-7 px-3 text-[12px] font-medium text-[#717683]">Your teams</div>
            <div className="mt-2 rounded-[12px] border border-white/[0.04] bg-white/[0.02] p-2">
              <div className="flex items-center gap-3 px-2 py-2 text-[13px] text-[#b6bac6]">
                <Users className="h-4 w-4 text-[#8f95a3]" />
                <span className="font-medium text-white">Engineering</span>
              </div>
              <div className="mt-1 space-y-1">
                {teamNav.map((item) => (
                  <SidebarItem key={item.label} item={item} depth={1} />
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="rounded-[16px] border border-white/[0.04] bg-[#111216] p-4">
                <div className="text-[12px] text-[#7c8190]">What's new</div>
                <div className="mt-2 text-[14px] text-[#f3f4f6]">Linear for Microsoft Teams</div>
              </div>
            </div>
          </aside>

          <div className="bg-[#0f1013] p-4">
            <div className="rounded-[16px] border border-white/[0.05] bg-[#111214]">
              <div className="border-b border-white/[0.05] px-6 py-5">
                <h2 className="text-[20px] font-semibold text-[#f3f4f6]">My issues</h2>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {["Assigned", "Created", "Subscribed", "Activity"].map((tab, index) => (
                      <button
                        key={tab}
                        type="button"
                        className={clsx(
                          "rounded-full border px-4 py-2 text-[14px] transition-colors duration-150",
                          index === 0
                            ? "border-white/10 bg-white/[0.09] text-white"
                            : "border-white/8 bg-white/[0.03] text-[#9ea3af] hover:text-white"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-[#9196a3]">
                    {[
                      <Filter key="filter" className="h-4 w-4" />,
                      <Settings2 key="settings" className="h-4 w-4" />,
                      <svg
                        key="chart"
                        viewBox="0 0 16 16"
                        className="h-4 w-4 fill-current"
                        aria-hidden="true"
                      >
                        <rect x="1.5" y="8.5" width="2.4" height="6" rx="0.8" />
                        <rect x="6.8" y="5.5" width="2.4" height="9" rx="0.8" />
                        <rect x="12.1" y="2.5" width="2.4" height="12" rx="0.8" />
                      </svg>,
                      <svg
                        key="layout"
                        viewBox="0 0 16 16"
                        className="h-4 w-4 stroke-current"
                        fill="none"
                        aria-hidden="true"
                      >
                        <rect x="2.5" y="2.5" width="11" height="11" rx="2" strokeWidth="1.3" />
                        <path d="M7.8 2.5v11" strokeWidth="1.3" />
                      </svg>,
                    ].map((icon, index) => (
                      <button
                        key={index}
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.035]"
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 py-4">
                {groupedIssues.map((group) => (
                  <div key={group.title} className="mb-4 overflow-hidden rounded-[14px] border border-white/[0.05] bg-[#0e0f12] last:mb-0">
                    <div className="flex items-center justify-between bg-white/[0.035] px-5 py-4">
                      <div className="flex items-center gap-3">
                        <StatusDot tone={group.tone} />
                        <div className="text-[15px] font-medium text-[#f2f3f5]">
                          {group.title}
                          <span className="ml-2 text-[#707581]">{group.items.length}</span>
                        </div>
                      </div>
                      <Plus className="h-4 w-4 text-[#7d828f]" />
                    </div>

                    {group.items.map((issue) => (
                      <IssueRow key={issue.id} issue={issue} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommandMenuRecreation() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="rounded-[16px] border border-white/8 bg-[#0f1013] p-4">
        <div className="overflow-hidden rounded-[14px] border border-white/[0.06] bg-[#121317] shadow-[0_20px_60px_rgba(0,0,0,0.42)]">
          <div className="flex items-center gap-3 border-b border-white/[0.05] px-4 py-3">
            <Search className="h-4 w-4 text-[#8f95a3]" />
            <span className="text-[14px] text-[#7f8491]">Search or jump to…</span>
            <span className="ml-auto rounded-[6px] border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[11px] text-[#8b909d]">
              ⌘K
            </span>
          </div>
          <div className="space-y-1 p-2">
            {[
              { icon: Plus, label: "Create issue", meta: "C" },
              { icon: Bell, label: "Open inbox", meta: "G then I" },
              { icon: UserCircle2, label: "View assigned issues", meta: "G then M" },
              { icon: MessagesSquare, label: "Start triage session", meta: "Shift T" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={clsx(
                    "flex items-center gap-3 rounded-[10px] px-3 py-3 text-[14px]",
                    index === 1 ? "bg-white/[0.08] text-white" : "text-[#a0a5b2]"
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-white/[0.06] bg-white/[0.04]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  <span className="text-[12px] text-[#727784]">{item.meta}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-white/8 bg-[#111216] p-5">
        <div className="text-[12px] uppercase tracking-[0.14em] text-[#737887]">Patterns</div>
        <div className="mt-4 space-y-4">
          {[
            "Command palette rows use dense 8px radii and one-line actions.",
            "Metadata is always de-emphasized but still aligned on the right edge.",
            "Hover states stay subtle: a tone shift, not a bright fill.",
          ].map((line) => (
            <div key={line} className="rounded-[10px] border border-white/[0.06] bg-white/[0.03] p-4 text-[13px] leading-6 text-[#b7bcc8]">
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IssueDetailRecreation() {
  return (
    <div className="border-y border-white/[0.05] bg-[#0f1013]">
      <div className="grid gap-8 px-2 py-2 xl:grid-cols-[minmax(0,1.5fr)_320px] xl:px-0">
        <div className="border-b border-white/[0.05] px-4 py-6 xl:border-b-0 xl:border-r xl:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#2d3139] bg-[#1a1c22] px-3 py-1.5 text-[12px] text-[#f5c451]">
              In Progress
            </span>
            <span className="rounded-full border border-[#2d3139] bg-[#1a1c22] px-3 py-1.5 text-[12px] text-[#9ca2b0]">
              ENG-1064
            </span>
          </div>
          <h3 className="mt-5 max-w-3xl text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#f5f6f7]">
            Add Trips Management to Crew Timeline
          </h3>
          <p className="mt-4 max-w-3xl text-[14px] leading-7 text-[#a8adb9]">
            Expand the crew timeline flow so dispatch can add, reorder, and validate trip
            assignments without leaving the scheduling surface.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { name: "Feature", color: "#8f5cf7" },
              { name: "Frontend", color: "#23c1e6" },
              { name: "Operations", color: "#32d074" },
            ].map((label) => (
              <span
                key={label.name}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12px] text-[#b4b7c2]"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: label.color }} />
                {label.name}
              </span>
            ))}
          </div>
          <div className="mt-10 border-t border-white/[0.05] pt-6">
            <div className="flex items-center gap-3 text-[13px] text-[#8f95a3]">
              <MessagesSquare className="h-4 w-4" />
              Activity
            </div>
            <div className="mt-4 space-y-0">
              {[
                "Alex moved this issue to In Review and linked PR #412.",
                "Nadia updated the PRD with validation requirements for trip overlap.",
                "Jeff asked for a compact table variant for narrow timelines.",
              ].map((entry, index) => (
                <div
                  key={entry}
                  className="flex gap-3 border-t border-white/[0.05] py-4 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.08] text-[10px] font-semibold text-[#f3f4f6]">
                    {["AL", "NN", "JW"][index]}
                  </div>
                  <div className="text-[13px] leading-6 text-[#c0c4ce]">{entry}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-6 xl:px-0">
          <div className="border-b border-white/[0.05] pb-6">
            <div className="text-[12px] uppercase tracking-[0.14em] text-[#737887]">Properties</div>
            <div className="mt-4 space-y-0">
              {[
                ["Assignee", "Jeff"],
                ["Project", "Spirit Airline Demo"],
                ["Cycle", "Apr 14 - Apr 28"],
                ["Estimate", "8 points"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-t border-white/[0.05] py-3 text-[13px] first:border-t-0 first:pt-0 last:pb-0"
                >
                  <span className="text-[#8f95a3]">{label}</span>
                  <span className="text-[#f3f4f6]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <div className="text-[12px] uppercase tracking-[0.14em] text-[#737887]">Actions</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <LinearButton tone="primary">
                <CheckCircle2 className="h-4 w-4" />
                Mark complete
              </LinearButton>
              <LinearButton>
                <GitBranch className="h-4 w-4" />
                Copy branch
              </LinearButton>
              <LinearButton tone="ghost">
                <MoonStar className="h-4 w-4" />
                Snooze
              </LinearButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="text-[12px] uppercase tracking-[0.16em] text-[#737887]">{eyebrow}</div>
      <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[#f3f4f6]">{title}</h2>
      <p className="mt-3 text-[15px] leading-7 text-[#9fa4b1]">{description}</p>
    </div>
  );
}

function SquarePenIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 stroke-current" fill="none" aria-hidden="true">
      <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="2.25" strokeWidth="1.2" />
      <path d="M5.4 10.8 10.95 5.2l1.1 1.1-5.55 5.6-1.9.4.4-1.9Z" strokeWidth="1.2" />
    </svg>
  );
}

export default function LinearDesignSystemPage() {
  return (
    <div className="min-h-full bg-[#07080a] text-white">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-20 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_420px]">
          <div className="rounded-[24px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(94,106,210,0.22),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(50,208,116,0.12),transparent_18%),#0b0c0f] p-8 sm:p-10">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] uppercase tracking-[0.14em] text-[#9fa4b1]">
              Design system study 001
            </div>
            <h1 className="mt-6 max-w-4xl text-[40px] font-semibold leading-[1.02] tracking-[-0.05em] text-[#f5f6f7] sm:text-[56px]">
              Linear’s interface language translated into tokens, components, and reusable
              desktop patterns.
            </h1>
            <p className="mt-6 max-w-3xl text-[16px] leading-8 text-[#a2a8b5]">
              This first design-system entry captures the density, hierarchy, and muted contrast
              that make Linear feel fast. The library below maps the visual rules, distills the
              component set, and recreates key issue-management surfaces for direct reuse.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <LinearButton tone="primary">
                <Layers3 className="h-4 w-4" />
                14 color tokens
              </LinearButton>
              <LinearButton>
                <Command className="h-4 w-4" />
                9 core component patterns
              </LinearButton>
              <LinearButton tone="ghost">
                <Globe className="h-4 w-4" />
                3 recreated product surfaces
              </LinearButton>
            </div>
          </div>

          <ReferenceCard />
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Tokens"
            title="Foundational values"
            description="Linear’s UI depends on quiet neutrals, deliberate spacing, and typography that stays compact without feeling cramped. These token groups capture the ratios that matter most."
          />

          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr_0.9fr]">
            <div className="rounded-[18px] border border-white/8 bg-[#0e0f12] p-6">
              <div className="text-[12px] uppercase tracking-[0.14em] text-[#737887]">Color system</div>
              <div className="mt-5 grid gap-3">
                {colorTokens.map((token) => (
                  <div
                    key={token.name}
                    className="grid grid-cols-[52px_minmax(0,1fr)] items-center gap-4 rounded-[12px] border border-white/[0.05] bg-white/[0.03] p-3"
                  >
                    <div
                      className="h-10 w-10 rounded-[10px] border border-white/10"
                      style={{ backgroundColor: token.value }}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-[13px]">
                        <span className="font-medium text-[#f3f4f6]">{token.name}</span>
                        <span className="text-[#737887]">{token.value}</span>
                      </div>
                      <div className="mt-1 text-[12px] leading-5 text-[#9aa0ad]">{token.usage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {typeTokens.map((token) => (
                <TokenCard key={token.name} title={token.name} value={token.value} note={token.note} />
              ))}
            </div>

            <div className="space-y-4">
              {layoutTokens.map((token) => (
                <TokenCard key={token.name} title={token.name} value={token.value} note={token.note} />
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Components"
            title="Most-used building blocks"
            description="The component layer leans on density, alignment, and low-noise feedback. Controls are small, but every hit target remains stable and readable."
          />

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-[16px] border border-white/8 bg-[#0f1013] p-5">
              <div className="text-[12px] uppercase tracking-[0.14em] text-[#737887]">Buttons</div>
              <div className="mt-5 flex flex-wrap gap-3">
                <LinearButton tone="primary">
                  <Plus className="h-4 w-4" />
                  New issue
                </LinearButton>
                <LinearButton>View details</LinearButton>
                <LinearButton tone="ghost">Dismiss</LinearButton>
              </div>
            </div>

            <div className="rounded-[16px] border border-white/8 bg-[#0f1013] p-5">
              <div className="text-[12px] uppercase tracking-[0.14em] text-[#737887]">Tabs</div>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Assigned", "Created", "Subscribed", "Activity"].map((tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    className={clsx(
                      "rounded-full border px-4 py-2 text-[13px]",
                      index === 0
                        ? "border-white/10 bg-white/[0.09] text-white"
                        : "border-white/[0.08] bg-white/[0.03] text-[#9ba0ad]"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[16px] border border-white/8 bg-[#0f1013] p-5">
              <div className="text-[12px] uppercase tracking-[0.14em] text-[#737887]">Pills & labels</div>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  ["Feature", "#8f5cf7"],
                  ["Frontend", "#23c1e6"],
                  ["Bug", "#ff6b6b"],
                  ["PRD", "#5e6ad2"],
                ].map(([label, color]) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12px] text-[#b4b7c2]"
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[16px] border border-white/8 bg-[#0f1013] p-5 xl:col-span-2">
              <div className="text-[12px] uppercase tracking-[0.14em] text-[#737887]">Sidebar navigation</div>
              <div className="mt-5 grid gap-2 md:grid-cols-2">
                <div className="rounded-[12px] border border-white/[0.05] bg-black/30 p-2">
                  {primaryNav.map((item) => (
                    <SidebarItem key={item.label} item={item} />
                  ))}
                </div>
                <div className="rounded-[12px] border border-white/[0.05] bg-black/30 p-2">
                  <div className="px-3 py-2 text-[12px] text-[#707581]">Engineering</div>
                  {teamNav.map((item) => (
                    <SidebarItem key={item.label} item={item} depth={1} />
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-white/8 bg-[#0f1013] p-5">
              <div className="text-[12px] uppercase tracking-[0.14em] text-[#737887]">Search shell</div>
              <div className="mt-5 flex items-center gap-3 rounded-[10px] border border-white/[0.06] bg-white/[0.04] px-4 py-3 text-[14px] text-[#f3f4f6]">
                <Search className="h-4 w-4 text-[#8f95a3]" />
                <span className="flex-1">Search or jump to…</span>
                <span className="rounded-[6px] border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[11px] text-[#8b909d]">
                  ⌘K
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Recreations"
            title="Product surfaces rebuilt from the system"
            description="These recreations use the token set above instead of one-off styling, so the page works as a first-pass component catalog and as a reproducible Linear UI study."
          />

          <IssueBoardRecreation />
          <CommandMenuRecreation />
          <IssueDetailRecreation />
        </section>
      </div>
    </div>
  );
}
