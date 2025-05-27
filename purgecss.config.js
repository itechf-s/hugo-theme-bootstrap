const fs = require('fs');
const purgecssModule = require('@fullhuman/postcss-purgecss');

const stats = './hugo_stats.json';

if (!fs.existsSync(stats)) {
  throw new Error('Hugo stats file not found, please turn on the "build.writeStats".');
}

const purgecss = purgecssModule({
  content: [stats, './extra_stats.json'],
  defaultExtractor: (content) => {
    const els = JSON.parse(content).htmlElements;
    return els.tags.concat(els.classes, els.ids);
  },
  safelist: {
    standard: [
      'active', 'badge', 'bg-secondary', 'bottom-0', 'btn-link', 'btn-primary',
      'btn-outline-primary', 'collapse', 'col-xxl-10', 'd-flex', 'end-0',
      'flex-column', 'fs-lg', 'fs-sm', 'fs-xl', 'fs-xs', 'fst-italic',
      'justify-content-center', 'm-1', 'mb-0', 'mb-1', 'my-1', 'my-2', 'mx-2', 'mb-2',
      'list-unstyled', 'offcanvas-backdrop', 'opacity-0', 'opacity-50', 'opacity-100',
      'overflow-hidden', 'p-1', 'pb-0', 'pe-3', 'pt-0', 'pt-1', 'px-2', 'py-1',
      'px-3', 'py-2', 'p-2', 'position-absolute', 'position-fixed', 'position-relative',
      'position-sticky', 'rounded', 'rounded-top', 'show', 'sidebar-none', 'start-50',
      'text-nowrap', 'text-pre-wrap', 'text-uppercase', 'text-white', 'top-0', 'top-50',
      'text-bg-secondary', 'text-success', 'text-truncate', 'user-select-all', 'w-100', 'was-validated'
    ],
    greedy: [/carousel-indicators$/],
  },
  dynamicAttributes: [
    'data-bs-popper', 'data-bs-theme', 'data-palette', 'role', 'placeholder-shown'
  ]
});

module.exports = purgecss;
