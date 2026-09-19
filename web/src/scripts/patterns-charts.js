// Charts for /patterns/. Every number is computed at build time (patterns.astro) and read from JSON;
// this script only draws them. Series colours come from CSS custom properties so each theme uses its
// own validated steps, labels go through the site's translation layer, and the tables under each
// chart remain the accessible, colour-free source of the same numbers.
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { translateInterface } from './language.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSpanish = () => document.documentElement.lang === 'es';
const tr = (text) => (isSpanish() ? translateInterface(text) : text);
const cssVar = (el, name) => getComputedStyle(el).getPropertyValue(name).trim();

// --ink and --bg are plain hex; greys are mixed here because canvas cannot resolve color-mix().
const rgb = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};
const mix = (a, b, weight) => `rgb(${rgb(a).map((x, i) => Math.round(x * weight + rgb(b)[i] * (1 - weight))).join(',')})`;
const alpha = (a, value) => `rgba(${rgb(a).join(',')},${value})`;

// Long category names (especially in Spanish) would be clipped at the left edge of a narrow canvas;
// Chart.js draws an array label as several lines, so wrap them on small screens.
const narrowChart = (canvas) => (canvas.parentElement?.clientWidth ?? 600) < 520;
function wrap(text, max) {
  if (text.length <= max) return text;
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && `${line} ${word}`.length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}
const axisLabel = (canvas, text) => wrap(tr(text), narrowChart(canvas) ? 16 : 44);

function palette(root) {
  const ink = cssVar(root, '--ink') || '#f0efea';
  const bg = cssVar(root, '--bg') || '#100e0b';
  return {
    ink,
    muted: mix(ink, bg, 0.74),
    grid: alpha(ink, 0.1),
    axis: alpha(ink, 0.28),
    series: [1, 2, 3, 4].map((i) => cssVar(root, `--series-${i}`)),
  };
}

// Thin 95% range whiskers over each horizontal bar.
const whiskers = {
  id: 'whiskers',
  afterDatasetsDraw(chart, _args, options) {
    const { ctx, scales } = chart;
    ctx.save();
    ctx.strokeStyle = options.color;
    ctx.lineWidth = 1.5;
    chart.data.datasets.forEach((dataset, d) => {
      const meta = chart.getDatasetMeta(d);
      if (meta.hidden) return;
      meta.data.forEach((bar, i) => {
        const range = dataset.ranges?.[i];
        if (!range) return;
        const x1 = scales.x.getPixelForValue(range[0]);
        const x2 = scales.x.getPixelForValue(range[1]);
        const cap = Math.max(2, Math.min(5, bar.height / 2 - 1));
        ctx.beginPath();
        ctx.moveTo(x1, bar.y); ctx.lineTo(x2, bar.y);
        ctx.moveTo(x1, bar.y - cap); ctx.lineTo(x1, bar.y + cap);
        ctx.moveTo(x2, bar.y - cap); ctx.lineTo(x2, bar.y + cap);
        ctx.stroke();
      });
    });
    ctx.restore();
  },
};

function tooltipLine(name, cell) {
  const [k, n] = cell.counts;
  const [lo, hi] = cell.range;
  return isSpanish()
    ? `${name}: ${cell.value}% (${k} de ${n}) · rango del 95 %: ${lo}–${hi}%`
    : `${name}: ${cell.value}% (${k} of ${n}) · 95% range ${lo}–${hi}%`;
}

function options(pal) {
  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: reducedMotion() ? false : { duration: 350 },
    interaction: { mode: 'index', axis: 'y', intersect: false },
    layout: { padding: { right: 10 } },
    scales: {
      x: {
        min: 0, max: 100,
        grid: { color: pal.grid },
        border: { color: pal.axis },
        ticks: { color: pal.muted, stepSize: 25, callback: (v) => `${v}%` },
        title: { display: true, text: tr("Share of the kind's winners"), color: pal.muted },
      },
      y: { grid: { display: false }, border: { color: pal.axis }, ticks: { color: pal.ink, font: { size: 12 } } },
    },
    plugins: { legend: { display: false }, whiskers: { color: pal.ink } },
  };
}

function winsChart(canvas, data, view, pal) {
  const rows = data.views[view];
  const base = options(pal);
  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: rows.map((r) => axisLabel(canvas, r.label)),
      datasets: data.kinds.map((kind, k) => ({
        label: tr(kind.label),
        data: rows.map((r) => r.cells[k].p),
        ranges: rows.map((r) => [r.cells[k].lo, r.cells[k].hi]),
        counts: rows.map((r) => [r.cells[k].k, r.cells[k].n]),
        backgroundColor: pal.series[kind.slot - 1],
        borderRadius: 4,
        borderSkipped: 'start',
        barPercentage: 0.84,
        categoryPercentage: 0.82,
      })),
    },
    options: {
      ...base,
      plugins: {
        ...base.plugins,
        tooltip: {
          callbacks: {
            label: (ctx) => tooltipLine(ctx.dataset.label, {
              value: ctx.parsed.x, counts: ctx.dataset.counts[ctx.dataIndex], range: ctx.dataset.ranges[ctx.dataIndex],
            }),
          },
        },
      },
    },
    plugins: [whiskers],
  });
}

function traitChart(canvas, data, trait, pal) {
  const base = options(pal);
  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: data.kinds.map((kind) => axisLabel(canvas, kind.label)),
      datasets: [{
        data: trait.cells.map((c) => c.p),
        ranges: trait.cells.map((c) => [c.lo, c.hi]),
        counts: trait.cells.map((c) => [c.k, c.n]),
        backgroundColor: data.kinds.map((kind) => pal.series[kind.slot - 1]),
        borderRadius: 4,
        borderSkipped: 'start',
        barPercentage: 0.7,
      }],
    },
    options: {
      ...base,
      scales: { ...base.scales, x: { ...base.scales.x, title: { display: false } } },
      plugins: {
        ...base.plugins,
        tooltip: {
          callbacks: {
            // The axis label may be wrapped into lines; name the kind from the data instead.
            label: (ctx) => tooltipLine(tr(data.kinds[ctx.dataIndex].label), {
              value: ctx.parsed.x, counts: ctx.dataset.counts[ctx.dataIndex], range: ctx.dataset.ranges[ctx.dataIndex],
            }),
          },
        },
      },
    },
    plugins: [whiskers],
  });
}

export function initPatternCharts() {
  const source = document.querySelector('#patterns-data');
  const root = document.querySelector('.viz-root');
  if (!source || !root) return;
  const data = JSON.parse(source.textContent);
  let view = 'mechanisms';
  let charts = [];

  const render = () => {
    for (const chart of charts) chart.destroy();
    charts = [];
    const pal = palette(root);
    Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
    const wins = document.querySelector('#chart-wins');
    if (wins) charts.push(winsChart(wins, data, view, pal));
    for (const trait of data.traits) {
      const canvas = document.querySelector(`#chart-${trait.id}`);
      if (canvas) charts.push(traitChart(canvas, data, trait, pal));
    }
  };

  // Only the table matching the chart's current view is shown; without JavaScript both stay visible.
  const tables = [...document.querySelectorAll('[data-table]')];
  const showTable = () => { for (const table of tables) table.hidden = table.dataset.table !== view; };
  const buttons = [...document.querySelectorAll('[data-view]')];
  for (const button of buttons) {
    button.addEventListener('click', () => {
      view = button.dataset.view;
      for (const b of buttons) b.setAttribute('aria-pressed', String(b === button));
      showTable();
      render();
    });
  }

  showTable();
  render();
  document.fonts?.ready.then(render);
  // Re-wrap axis labels only when the layout crosses the narrow breakpoint, not on every resize.
  let narrow = narrowChart(document.querySelector('#chart-wins') ?? root);
  let timer;
  addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const now = narrowChart(document.querySelector('#chart-wins') ?? root);
      if (now !== narrow) { narrow = now; render(); }
    }, 150);
  });
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  addEventListener('crafter-language-applied', render);
}
