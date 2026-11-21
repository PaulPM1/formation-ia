// Pilote les visuels à étapes : [data-stepper] porte data-step, les boutons
// [data-step-to] y sautent, la lecture démarre quand le visuel entre à l'écran.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const init = () => {
for (const root of document.querySelectorAll<HTMLElement>('[data-stepper]:not([data-stepper-ready])')) {
  root.dataset.stepperReady = '';
  const buttons = [...root.querySelectorAll<HTMLElement>('[data-step-to]')];
  const texts = [...root.querySelectorAll<HTMLElement>('[data-step-text]')];
  const replay = root.querySelector<HTMLButtonElement>('[data-step-replay]');
  const last = buttons.length;
  let timer: number | undefined;

  const show = (step: number) => {
    root.dataset.step = String(step);
    for (const button of buttons) {
      button.setAttribute('aria-current', String(Number(button.dataset.stepTo) === step));
    }
    for (const text of texts) text.hidden = Number(text.dataset.stepText) !== step;
  };
  const stop = () => {
    window.clearInterval(timer);
    if (replay) replay.hidden = false;
  };
  const play = () => {
    if (replay) replay.hidden = true;
    show(1);
    timer = window.setInterval(() => {
      if (!root.isConnected) return stop();
      const next = Number(root.dataset.step) + 1;
      if (next > last) stop();
      else show(next);
    }, 3400);
  };

  for (const button of buttons) {
    button.addEventListener('click', () => {
      stop();
      show(Number(button.dataset.stepTo));
    });
  }
  replay?.addEventListener('click', play);

  if (reduced) continue;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        play();
      }
    },
    { threshold: 0.5 },
  );
  observer.observe(root);
}
};

// Sur les slides, le ClientRouter remplace le <body> : on réinitialise à chaque page.
init();
document.addEventListener('astro:page-load', init);
