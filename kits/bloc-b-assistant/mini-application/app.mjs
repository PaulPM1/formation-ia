import { notes, stateLabels } from './brief.mjs';

const order = { today: 0, confirm: 1, later: 2 };

export function sortNotes(items, direction = 'priority') {
  return [...items].sort((left, right) => {
    if (direction === 'title') return left.title.localeCompare(right.title, 'fr');
    return order[left.state] - order[right.state] || left.id.localeCompare(right.id);
  });
}

export function renderCard(note) {
  return `<article class="brief-card" data-note="${note.id}">
    <p class="brief-card__state">${stateLabels[note.state]}</p>
    <h2>${note.title}</h2>
    <p>${note.detail}</p>
  </article>`;
}

export function renderBrief(items, direction = 'priority') {
  return sortNotes(items, direction).map(renderCard).join('');
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('[data-brief]');
  const sort = document.querySelector('[data-sort]');
  const update = () => {
    if (root) root.innerHTML = renderBrief(notes, sort?.value ?? 'priority');
  };
  sort?.addEventListener('change', update);
  update();
}
