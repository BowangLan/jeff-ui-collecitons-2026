import { useState } from "react";
import { cn } from "../../../lib/utils";
import { Box, BoxVariant } from "./box";
import { Column } from "./column";
import { reportingPeriods } from "./reporting-periods";
import { Row } from "./row";

export const GlassPanel1 = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const period = reportingPeriods[selectedPeriod]!;

  return (
    <Column
      className="flex w-full max-w-[440px] flex-1 flex-col overflow-auto min-h-0 bg-black/50 backdrop-blur-sm font-extralight text-gray-200"
      style={{
        gap: 8,
        padding: 8,
        borderRadius: 30,
      }}
    >
      <div
        className="flex shrink-0 items-center justify-between gap-4"
        style={{ padding: "12px 16px" }}
      >
        <div>
          <h1 className="text-base font-normal">Transit operations</h1>
          <p className="mt-1 text-xs text-gray-400">
            Demo snapshot · Oct 3, 2026
          </p>
        </div>
        <time dateTime="2026-10-03T22:58:00" className="text-xs text-gray-400">
          22:58
        </time>
      </div>

      <Row>
        {reportingPeriods.map(({ label }, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={selectedPeriod === index}
            aria-label={`Show metrics for ${label}`}
            onClick={() => setSelectedPeriod(index)}
            style={{
              height: 48,
              borderRadius: 22,
            }}
            className={cn(
              "min-w-0 flex-1 border text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70",
              "hover:bg-white/10",
              selectedPeriod === index
                ? BoxVariant.highlight
                : "border-transparent text-gray-400",
            )}
          >
            {label}
          </button>
        ))}
      </Row>

      <Row>
        <Box style={{ minHeight: 112 }} className="gap-2">
          <h2 className="text-xs text-gray-400">Completed trips</h2>
          <p className="text-3xl tabular-nums">{period.trips}</p>
          <p className="text-xs text-gray-400">Across 18 routes</p>
        </Box>
        <Box style={{ minHeight: 112 }} className="gap-2">
          <h2 className="text-xs text-gray-400">Average delay</h2>
          <p className="text-3xl tabular-nums">
            {period.delay} <span className="text-sm text-gray-400">min</span>
          </p>
          <p className="text-xs text-gray-400">Target: under 3 min</p>
        </Box>
      </Row>

      <Row>
        <Box style={{ minHeight: 256 }}>
          <div className="flex w-full items-baseline justify-between gap-2">
            <h2 className="text-lg">On-time performance</h2>
            <span className="text-xs text-gray-400">Goal 95%</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1 tabular-nums">
            <span className="text-4xl">{period.onTime}</span>
            <span className="text-sm text-gray-400">%</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            <span
              className={
                period.change.startsWith("+")
                  ? "text-emerald-300"
                  : "text-amber-300"
              }
            >
              {period.change} pts
            </span>{" "}
            vs. {period.comparison}
          </p>
          <div
            role="img"
            aria-label={`On-time trips in six consecutive intervals, oldest first: ${period.trend.join(", ")} percent. Goal: 95 percent.`}
            className="relative mt-4 flex h-16 w-full items-end gap-2 border-b border-white/10"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 z-10 border-t border-dashed border-white/40"
              style={{ bottom: "95%" }}
            />
            {period.trend.map((value, index) => (
              <div
                key={index}
                className={cn(
                  "flex-1 rounded-t-md",
                  value >= 95 ? "bg-emerald-300/50" : "bg-white/20",
                )}
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex w-full justify-between text-[10px] text-gray-400">
            {period.ticks.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-gray-400">
            On time = within 5 min of schedule
          </p>
        </Box>
      </Row>

      <Row>
        <Box style={{ minHeight: 288 }}>
          <h2 className="text-lg">Bus 4120</h2>
          <p className="mt-1 text-xs text-gray-400">Route 24 · Inbound</p>
          <span className="mt-3 rounded-full bg-emerald-300/10 px-2 py-1 text-xs text-emerald-300">
            On schedule
          </span>
          <dl className="mt-4 w-full space-y-3 text-xs">
            <div>
              <dt className="text-gray-400">Next stop</dt>
              <dd className="mt-1">Central Station · 23:02</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-gray-400">Passengers</dt>
              <dd className="tabular-nums">32 / 60</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-gray-400">Battery</dt>
              <dd className="tabular-nums">68%</dd>
            </div>
          </dl>
          <p className="mt-4 text-[11px] text-gray-400">
            Last telemetry · 22:58
          </p>
        </Box>
        <Box style={{ minHeight: 288 }}>
          <h2 className="text-lg">Service alerts</h2>
          <p className="mt-1 text-xs text-gray-400">2 active at snapshot</p>
          <div className="mt-4 w-full space-y-4">
            <div>
              <h3 className="text-xs text-amber-300">Route 08 · Delays</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">
                Roadworks on Market St. Allow 6–8 extra minutes until 23:30.
              </p>
            </div>
            <div className="border-t border-white/5 pt-3">
              <h3 className="text-xs">Bus 4106 · Out of service</h3>
              <p className="mt-1 text-xs leading-relaxed text-gray-400">
                Battery inspection. Replacement bus 4122 assigned to Route 12.
              </p>
            </div>
          </div>
        </Box>
      </Row>
    </Column>
  );
};
