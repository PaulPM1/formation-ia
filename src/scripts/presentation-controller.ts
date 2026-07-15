const interactiveSelector =
  'a, button, input, textarea, select, [contenteditable="true"], dialog';

document.addEventListener('keydown', (event) => {
  const target = event.target as Element | null;
  if (target?.closest(interactiveSelector)) return;

  const previous = document.querySelector<HTMLAnchorElement>('[data-previous]');
  const next = document.querySelector<HTMLAnchorElement>('[data-next]');

  if (event.key === 'ArrowLeft' && previous) location.assign(previous.href);
  if ((event.key === 'ArrowRight' || event.key === ' ') && next) {
    event.preventDefault();
    location.assign(next.href);
  }
});

const dialogTriggers = document.querySelectorAll<HTMLElement>('[data-dialog-target]');
const triggerByDialog = new WeakMap<HTMLDialogElement, HTMLElement>();

dialogTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const selector = trigger.dataset.dialogTarget;
    if (!selector) return;

    const dialog = document.querySelector<HTMLDialogElement>(selector);
    if (!dialog) return;

    triggerByDialog.set(dialog, trigger);
    dialog.showModal();
  });
});

document.querySelectorAll<HTMLDialogElement>('dialog').forEach((dialog) => {
  dialog.querySelector<HTMLElement>('[data-dialog-close]')?.addEventListener('click', () => {
    dialog.close();
  });

  dialog.addEventListener('close', () => {
    triggerByDialog.get(dialog)?.focus();
    triggerByDialog.delete(dialog);
  });
});

const fullscreenButton = document.querySelector<HTMLElement>('[data-presenter-fullscreen]');

fullscreenButton?.addEventListener('click', async () => {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
});
