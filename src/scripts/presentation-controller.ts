import { navigate } from 'astro:transitions/client';

/* Avec le ClientRouter, le <body> est remplacé à chaque slide mais `document`
   persiste : tout est délégué au document pour survivre aux swaps. */

const interactiveSelector =
  'a, button, input, textarea, select, summary, details, [contenteditable="true"], dialog';

/* Les flèches naviguent même quand le focus est sur un bouton ou un lien
   (comportement attendu d'un présentateur, notamment après le clic sur le
   bouton plein écran). Seuls les champs de saisie et les dialogues ouverts
   conservent leurs touches fléchées. Espace garde le garde complet : il
   active nativement liens, boutons et summary. */
const editingSelector = 'input, textarea, select, [contenteditable="true"], dialog';

document.addEventListener('keydown', (event) => {
  const target = event.target as Element | null;
  if (event.key === ' ' && target?.closest(interactiveSelector)) return;
  if (event.key !== ' ' && target?.closest(editingSelector)) return;

  const previous = document.querySelector<HTMLAnchorElement>('[data-previous]');
  const next = document.querySelector<HTMLAnchorElement>('[data-next]');

  if (event.key === 'ArrowLeft' && previous) void navigate(previous.href);
  if ((event.key === 'ArrowRight' || event.key === ' ') && next) {
    event.preventDefault();
    void navigate(next.href);
  }
});

const triggerByDialog = new WeakMap<HTMLDialogElement, HTMLElement>();

const updateFullscreenButton = () => {
  const fullscreenButton = document.querySelector<HTMLButtonElement>('[data-presenter-fullscreen]');
  if (!fullscreenButton) return;
  const active = Boolean(document.fullscreenElement);
  fullscreenButton.setAttribute('aria-pressed', String(active));
  fullscreenButton.textContent = active ? 'Quitter le plein écran' : 'Entrer le plein écran';
};

const toggleFullscreen = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    const announcer = document.querySelector<HTMLElement>('[data-presenter-announcer]');
    if (announcer) announcer.textContent = 'Le plein écran n’a pas pu être activé. La présentation reste utilisable dans cette fenêtre.';
    updateFullscreenButton();
  }
};

document.addEventListener('click', (event) => {
  const target = event.target as Element | null;

  const trigger = target?.closest<HTMLElement>('[data-dialog-target]');
  if (trigger) {
    const selector = trigger.dataset.dialogTarget;
    const dialog = selector ? document.querySelector<HTMLDialogElement>(selector) : null;
    if (dialog) {
      triggerByDialog.set(dialog, trigger);
      dialog.showModal();
    }
    return;
  }

  const closer = target?.closest<HTMLElement>('[data-dialog-close]');
  if (closer) {
    closer.closest('dialog')?.close();
    return;
  }

  if (target?.closest<HTMLButtonElement>('[data-presenter-fullscreen]')) void toggleFullscreen();
});

/* L'événement close ne bulle pas : capture au niveau du document. */
document.addEventListener(
  'close',
  (event) => {
    const dialog = event.target;
    if (!(dialog instanceof HTMLDialogElement)) return;
    triggerByDialog.get(dialog)?.focus();
    triggerByDialog.delete(dialog);
  },
  true,
);

document.addEventListener('fullscreenchange', updateFullscreenButton);
document.addEventListener('astro:page-load', updateFullscreenButton);
updateFullscreenButton();
