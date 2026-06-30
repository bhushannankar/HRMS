import type { ReactNode } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const GENDER_COLORS = ['#2563eb', '#ec4899', '#8b5cf6', '#f59e0b', '#94a3b8'];
const BAR_BLUE = '#2563eb';
const BAR_PURPLE = '#7c3aed';
const BAR_TEAL = '#0d9488';

export function formatCtc(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

const barOptions = (yLabel?: string): ChartOptions<'bar'> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 10,
      cornerRadius: 6,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#64748b', font: { size: 11 }, maxRotation: 45 },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#f1f5f9' },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        callback: yLabel ? undefined : (v) => String(v),
      },
      title: yLabel ? { display: true, text: yLabel, color: '#94a3b8', font: { size: 11 } } : undefined,
    },
  },
});

function ChartBox({ children, empty }: { children: ReactNode; empty?: boolean }) {
  if (empty) return <p className="empty-widget chart-empty">No data available.</p>;
  return <div className="chart-canvas-wrap">{children}</div>;
}

export function DepartmentChart({ data }: { data: { departmentName: string; count: number }[] }) {
  const chartData = {
    labels: data.map((d) => d.departmentName),
    datasets: [{
      label: 'Employees',
      data: data.map((d) => d.count),
      backgroundColor: BAR_BLUE,
      borderRadius: 4,
      maxBarThickness: 48,
    }],
  };

  return (
    <ChartBox empty={data.length === 0}>
      <Bar data={chartData} options={barOptions('Employees')} />
    </ChartBox>
  );
}

export function CtcByLocationChart({ data }: { data: { location: string; annualCtc: number }[] }) {
  const chartData = {
    labels: data.map((d) => d.location),
    datasets: [{
      label: 'Annual CTC',
      data: data.map((d) => d.annualCtc),
      backgroundColor: BAR_PURPLE,
      borderRadius: 4,
      maxBarThickness: 48,
    }],
  };

  const options: ChartOptions<'bar'> = {
    ...barOptions(),
    plugins: {
      ...barOptions().plugins,
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (ctx: TooltipItem<'bar'>) => ` ${formatCtc(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      ...barOptions().scales,
      y: {
        ...barOptions().scales?.y,
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: (v) => formatCtc(Number(v)),
        },
      },
    },
  };

  return (
    <ChartBox empty={data.length === 0}>
      <Bar data={chartData} options={options} />
    </ChartBox>
  );
}

export function AgeDistributionChart({ data }: { data: { label: string; count: number }[] }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [{
      label: 'Employees',
      data: data.map((d) => d.count),
      backgroundColor: BAR_TEAL,
      borderRadius: 4,
      maxBarThickness: 48,
    }],
  };

  return (
    <ChartBox empty={data.length === 0}>
      <Bar data={chartData} options={barOptions('Employees')} />
    </ChartBox>
  );
}

export function AdditionsAttritionChart({ data }: { data: { month: string; additions: number; attrition: number }[] }) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Additions',
        data: data.map((d) => d.additions),
        backgroundColor: '#2563eb',
        borderRadius: 3,
        maxBarThickness: 20,
      },
      {
        label: 'Attrition',
        data: data.map((d) => d.attrition),
        backgroundColor: '#dc2626',
        borderRadius: 3,
        maxBarThickness: 20,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { boxWidth: 12, boxHeight: 12, color: '#64748b', font: { size: 11 } },
      },
      tooltip: { backgroundColor: '#1e293b', padding: 10, cornerRadius: 6 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } },
      y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#64748b', font: { size: 11 }, stepSize: 1 } },
    },
  };

  return (
    <ChartBox empty={data.every((d) => d.additions === 0 && d.attrition === 0)}>
      <Bar data={chartData} options={options} />
    </ChartBox>
  );
}

export function GenderDistributionChart({ data }: { data: { label: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [{
      data: data.map((d) => d.count),
      backgroundColor: data.map((_, i) => GENDER_COLORS[i % GENDER_COLORS.length]),
      borderWidth: 2,
      borderColor: '#fff',
      hoverOffset: 6,
    }],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: { boxWidth: 12, boxHeight: 12, color: '#475569', font: { size: 12 }, padding: 14 },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (ctx: TooltipItem<'doughnut'>) => {
            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0';
            return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <ChartBox empty={data.length === 0 || total === 0}>
      <Doughnut data={chartData} options={options} />
    </ChartBox>
  );
}

export function AttendanceOverviewChart({ data }: { data: { label: string; count: number; type: string }[] }) {
  const colors: Record<string, string> = {
    absent: '#dc2626',
    present: '#16a34a',
    leave: '#ea580c',
    wfh: '#0ea5e9',
  };

  const chartData = {
    labels: data.map((d) => d.label.replace('Employee ', '')),
    datasets: [{
      data: data.map((d) => d.count),
      backgroundColor: data.map((d) => colors[d.type] ?? '#94a3b8'),
      borderWidth: 2,
      borderColor: '#fff',
      hoverOffset: 6,
    }],
  };

  const total = data.reduce((s, d) => s + d.count, 0);

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, boxHeight: 12, color: '#475569', font: { size: 11 }, padding: 12 },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        callbacks: {
          label: (ctx: TooltipItem<'doughnut'>) => {
            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0';
            return ` ${ctx.parsed} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <ChartBox empty={total === 0}>
      <Doughnut data={chartData} options={options} />
    </ChartBox>
  );
}
