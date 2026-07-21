import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axisStyle = {
  fontSize: 11,
  fill: "oklch(0.62 0.022 260)",
  fontWeight: 500,
};

/* Premium glassmorphism tooltip */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "oklch(0.16 0.022 265 / 0.92)",
        backdropFilter: "blur(20px)",
        border: "1px solid oklch(0.72 0.20 280 / 0.25)",
        borderRadius: "12px",
        padding: "10px 14px",
        boxShadow: "0 8px 32px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(0.72 0.20 280 / 0.10) inset",
      }}
    >
      {label && (
        <p style={{ marginBottom: 6, fontSize: 12, fontWeight: 600, color: "oklch(0.97 0.004 260)" }}>
          {label}
        </p>
      )}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "oklch(0.72 0.022 260)", marginBottom: 2 }}>
          <span style={{
            display: "inline-block", width: 8, height: 8, borderRadius: "50%",
            background: p.color || p.fill,
            boxShadow: `0 0 6px ${p.color || p.fill}`,
          }} />
          <span style={{ textTransform: "capitalize" }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: "oklch(0.97 0.004 260)" }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* Shared grid style */
const gridProps = {
  strokeDasharray: "4 4",
  stroke: "oklch(0.28 0.022 265 / 0.4)",
  vertical: false as const,
};

/* ── Revenue Area Chart ───────────────────────────────────── */
export function RevenueAreaChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="rev-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="oklch(0.72 0.20 280)" stopOpacity={0.55} />
            <stop offset="60%"  stopColor="oklch(0.72 0.20 280)" stopOpacity={0.15} />
            <stop offset="100%" stopColor="oklch(0.72 0.20 280)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fc-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="oklch(0.72 0.17 215)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="oklch(0.72 0.17 215)" stopOpacity={0} />
          </linearGradient>
          {/* Glow filter for lines */}
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="oklch(0.72 0.20 280)"
          strokeWidth={2.5}
          fill="url(#rev-gradient)"
          filter="url(#line-glow)"
        />
        <Area
          type="monotone"
          dataKey="forecast"
          stroke="oklch(0.72 0.17 215)"
          strokeWidth={2}
          strokeDasharray="5 4"
          fill="url(#fc-gradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── Growth Line Chart ───────────────────────────────────── */
export function GrowthLineChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <filter id="line-glow-2">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="users"
          stroke="oklch(0.72 0.20 280)"
          strokeWidth={2.5}
          dot={false}
          filter="url(#line-glow-2)"
        />
        <Line
          type="monotone"
          dataKey="leads"
          stroke="oklch(0.76 0.17 155)"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ── Channel Donut ──────────────────────────────────────── */
export function ChannelDonut({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <defs>
          <filter id="donut-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={62}
          outerRadius={92}
          paddingAngle={4}
          stroke="none"
          filter="url(#donut-glow)"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          formatter={(v) => (
            <span style={{ fontSize: 11, color: "oklch(0.62 0.022 260)" }}>{v}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ── Funnel Bar Chart ───────────────────────────────────── */
export function FunnelBarChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 12, bottom: 0 }}>
        <defs>
          <linearGradient id="bar-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="oklch(0.72 0.20 280)" />
            <stop offset="100%" stopColor="oklch(0.72 0.17 215)" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="oklch(0.28 0.022 265 / 0.4)" horizontal={false} />
        <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="stage"
          tick={axisStyle}
          axisLine={false}
          tickLine={false}
          width={72}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "oklch(0.22 0.020 265 / 0.4)" }} />
        <Bar
          dataKey="value"
          radius={[0, 8, 8, 0]}
          fill="url(#bar-gradient)"
          barSize={22}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ── Mini Area Chart ────────────────────────────────────── */
export function MiniAreaChart({ data, color = "oklch(0.72 0.20 280)" }: { data: any[]; color?: string }) {
  const gradId = `mini-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <ResponsiveContainer width="100%" height={56}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.5} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
