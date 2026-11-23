import type Lenis from 'lenis';

// Workflow des cinq étapes de l'Atelier, porté du code de Ponder (Details, ponder-317708) :
// liste collante qui s'ouvre sur l'étape active, anneaux de progression, scènes en sticky
// dont l'apparition et la frappe des phrases suivent le défilement, règle en bas d'écran.
// GSAP/ScrollTrigger sont remplacés par la lecture directe du défilement (mêmes seuils).

const SCROLL_HEIGHTS = [1.5, 1.5, 1.5, 2, 1.5];
const ANIMATION_DURATION = 0.62;
const CIRC = 2 * Math.PI * 26;
const MOBILE = window.matchMedia('(max-width: 767px)');
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export function initWorkflow(root: HTMLElement, ruler: HTMLElement | null, lenis: Lenis | null = null) {
  const header = document.querySelector<HTMLElement>('.site-header');
  const wrappers = [...root.querySelectorAll<HTMLElement>('.workflow__container[data-step]')];
  const items = [...root.querySelectorAll<HTMLElement>('[data-step-list]')];
  const circles = [...root.querySelectorAll<HTMLElement>('.workflow__circle')];
  const fixedViewportHeight = window.innerHeight;
  let current = '1';
  let manualTarget: string | null = null;
  let frame = 0;

  // La frappe reprend la mécanique du prompt de Ponder : on efface l'indication, puis on tape la phrase.
  const typers = wrappers.map((wrapper) => {
    const box = wrapper.querySelector<HTMLElement>('[data-typewriter]');
    const text = box?.querySelector<HTMLElement>('.ca-field span');
    if (!box || !text) return null;
    text.classList.add('typewriter-text');
    return { box, text, placeholder: text.textContent ?? '', request: box.dataset.request ?? '' };
  });

  const offset = () => (header && getComputedStyle(header).position === 'sticky' ? header.offsetHeight : 0);

  const setHeights = () => {
    const top = offset();
    const viewport = (MOBILE.matches ? fixedViewportHeight : window.innerHeight) - top;
    root.style.setProperty('--wf-top', `${top}px`);
    root.style.setProperty('--wf-scene', `${viewport}px`);
    wrappers.forEach((wrapper, index) => {
      wrapper.style.height = `${viewport * (SCROLL_HEIGHTS[index] ?? 1.5)}px`;
    });
    fitScenes();
  };

  // Les maquettes gardent leur mise en page d'origine et s'agrandissent jusqu'à remplir la scène.
  const fitScenes = () => {
    root.querySelectorAll<HTMLElement>('.workflow__fit').forEach((fit) => {
      fit.style.scale = '1';
      const scene = fit.closest<HTMLElement>('.workflow__scene');
      if (!scene) return;
      const ratio = Math.min(1.5, (scene.clientWidth * 0.96) / fit.offsetWidth, (scene.clientHeight * (MOBILE.matches ? 0.6 : 0.92)) / fit.offsetHeight);
      fit.style.scale = String(ratio);
    });
  };

  const syncVisibility = (step = current) => {
    items.forEach((item) => {
      item.style.display = !MOBILE.matches || item.dataset.stepList === step ? '' : 'none';
    });
  };

  const setAccordion = (step: string) => {
    current = step;
    syncVisibility(step);
    items.forEach((item) => {
      const match = item.dataset.stepList === step;
      item.classList.toggle('is-active', match);
      const wrap = item.querySelector<HTMLElement>('.workflow__desc-wrap');
      if (!wrap) return;
      wrap.style.maxHeight = match ? `${wrap.scrollHeight}px` : '0px';
      wrap.inert = !match;
    });
    circles.forEach((circle) => circle.classList.toggle('is-active', circle.dataset.stepGo === step));
  };

  const animateScene = (wrapper: HTMLElement, progress: number) => {
    const layer = wrapper.querySelector<HTMLElement>('.workflow__layer');
    if (!layer) return;
    if (REDUCED.matches) {
      layer.style.cssText = '';
      return;
    }
    // Entrée des calques de Ponder (flou 12 → 0, opacité, échelle depuis 0.9) ; la maquette reste ensuite
    // en place et sort avec son conteneur sticky, comme le prompt de Ponder.
    const t = clamp(Math.min(1, progress / ANIMATION_DURATION) / 0.5);
    layer.style.opacity = String(t);
    layer.style.filter = `blur(${lerp(12, 0, t)}px)`;
    layer.style.transform = `translateY(${lerp(20, 0, t)}px) scale(${lerp(0.9, 1, t)})`;
  };

  const renderTypewriter = (index: number, progress: number) => {
    const typer = typers[index];
    if (!typer) return;
    const q = Math.min(1, progress / ANIMATION_DURATION);
    if (q <= 0.2) {
      typer.text.textContent = typer.placeholder.slice(0, Math.round(typer.placeholder.length * (1 - clamp(q / 0.2))));
      typer.box.style.setProperty('--typed-opacity', '0.45');
      typer.text.classList.add('is-typing');
    } else if (q < 1) {
      typer.text.textContent = typer.request.slice(0, Math.round(typer.request.length * clamp((q - 0.2) / 0.6)));
      typer.box.style.setProperty('--typed-opacity', '1');
      typer.text.classList.add('is-typing');
    } else {
      typer.text.textContent = typer.request;
      typer.text.classList.remove('is-typing');
    }
  };

  const update = () => {
    frame = 0;
    const top = offset();
    let active: string | null = null;
    wrappers.forEach((wrapper, index) => {
      const rect = wrapper.getBoundingClientRect();
      const progress = clamp((top - rect.top) / rect.height);
      if (rect.top <= top + 1 && rect.bottom > top + 1) active = wrapper.dataset.step ?? null;
      const ring = circles[index]?.querySelector<SVGCircleElement>('.ring-progress');
      if (ring) ring.style.strokeDashoffset = String(CIRC * (1 - progress));
      animateScene(wrapper, progress);
      renderTypewriter(index, progress);
    });
    if (active && active !== current && (!manualTarget || manualTarget === active)) {
      setAccordion(active);
      if (manualTarget === active) manualTarget = null;
    }
    updateRuler();
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const scrollToStep = (step: string) => {
    const target = wrappers.find((wrapper) => wrapper.dataset.step === step);
    if (!target) return;
    manualTarget = step;
    const rect = target.getBoundingClientRect();
    const y = rect.top + window.scrollY + rect.height * (ANIMATION_DURATION / 2) - offset();
    const max = document.documentElement.scrollHeight - window.innerHeight;
    // Ponder : 0.8 s en power2.out (gsap ScrollToPlugin), ici porté par Lenis.
    if (lenis) lenis.scrollTo(Math.min(y, max), { duration: 0.8, easing: (t) => 1 - (1 - t) ** 2 });
    else window.scrollTo({ top: Math.min(y, max), behavior: REDUCED.matches ? 'auto' : 'smooth' });
    window.setTimeout(() => {
      if (manualTarget === step) manualTarget = null;
    }, 1000);
  };

  root.querySelectorAll<HTMLElement>('[data-step-go]').forEach((control) => {
    control.addEventListener('click', () => {
      const step = control.dataset.stepGo;
      if (!step) return;
      setAccordion(step);
      scrollToStep(step);
    });
  });

  // Règle de Ponder : 60 traits, un pic qui suit la progression de la page (à partir de 1024 px).
  const RULER_MARKS = 60;
  const desktop = window.matchMedia('(min-width: 1024px)');
  const marks: HTMLElement[] = [];
  if (ruler) {
    for (let index = 0; index < RULER_MARKS; index += 1) marks.push(ruler.appendChild(document.createElement('span')));
  }
  function updateRuler() {
    if (!marks.length || !desktop.matches) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const peak = (max > 0 ? doc.scrollTop / max : 0) * (RULER_MARKS - 1);
    marks.forEach((mark, index) => {
      const intensity = Math.max(0, 1 - Math.abs(index - peak) / 15);
      mark.style.height = `${12 + intensity * 22}px`;
      mark.style.opacity = String(intensity);
    });
  }

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      setHeights();
      setAccordion(current);
      schedule();
    }, 150);
  });
  MOBILE.addEventListener('change', () => syncVisibility());
  window.addEventListener('scroll', schedule, { passive: true });

  root.classList.add('is-ready');
  setHeights();
  setAccordion('1');
  update();
  window.setTimeout(() => {
    fitScenes();
    schedule();
  }, 200);
}
