// FAQ par thèmes, portée d'Aave (Details, aave-05ea01) : une question ouverte par thème,
// hauteur, opacité et plus/moins animés par ressorts (mêmes masse, raideur, amortissement
// que Framer Motion chez Aave), index des thèmes qui suit le défilement.
// Sans JavaScript, les <details> natifs restent utilisables.

type Spring = { mass: number; stiffness: number; damping: number };

const HEIGHT: Spring = { mass: 0.2, damping: 18, stiffness: 280 };
const OPACITY: Spring = { mass: 0.5, damping: 18, stiffness: 200 };
const ICON: Spring = { mass: 0.5, damping: 20, stiffness: 220 };
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

type Motion = { value: number; velocity: number; frame: number; timer: number };
const motions = new Map<string, Motion>();
const keys = new WeakMap<Element, string>();
let nextKey = 0;

// Intègre le ressort pas à pas et garde la vitesse quand une animation en remplace une autre.
function animate(
  element: Element,
  prop: string,
  to: number,
  spring: Spring,
  apply: (value: number) => void,
  { from, delay = 0, restDelta = 0.001, done }: { from?: number; delay?: number; restDelta?: number; done?: () => void } = {},
) {
  if (!keys.has(element)) keys.set(element, String((nextKey += 1)));
  const key = `${keys.get(element)}:${prop}`;
  const motion = motions.get(key) ?? { value: from ?? to, velocity: 0, frame: 0, timer: 0 };
  if (from !== undefined) motion.value = from;
  cancelAnimationFrame(motion.frame);
  window.clearTimeout(motion.timer);
  motions.set(key, motion);

  if (REDUCED.matches) {
    motion.value = to;
    motion.velocity = 0;
    apply(to);
    done?.();
    return;
  }

  const run = () => {
    let last = performance.now();
    const step = (now: number) => {
      let elapsed = Math.min((now - last) / 1000, 0.064);
      last = now;
      while (elapsed > 0) {
        const dt = Math.min(elapsed, 1 / 240);
        const force = -spring.stiffness * (motion.value - to) - spring.damping * motion.velocity;
        motion.velocity += (force / spring.mass) * dt;
        motion.value += motion.velocity * dt;
        elapsed -= dt;
      }
      if (Math.abs(motion.value - to) < restDelta && Math.abs(motion.velocity) < restDelta * 10) {
        motion.value = to;
        motion.velocity = 0;
        apply(to);
        done?.();
        return;
      }
      apply(motion.value);
      motion.frame = requestAnimationFrame(step);
    };
    motion.frame = requestAnimationFrame(step);
  };
  if (delay) motion.timer = window.setTimeout(run, delay * 1000);
  else run();
}

function setOpen(question: HTMLDetailsElement, open: boolean) {
  const panel = question.querySelector<HTMLElement>('.faq-panel');
  const content = question.querySelector<HTMLElement>('.faq-content');
  const [line, bar] = question.querySelectorAll<SVGPathElement>('.faq-icon path');
  const summary = question.querySelector('summary');
  if (!panel || !content || !line || !bar) return;

  question.dataset.open = String(open);
  summary?.setAttribute('aria-expanded', String(open));
  animate(line, 'rotate', open ? 180 : 0, ICON, (v) => (line.style.transform = `rotate(${v}deg)`), { restDelta: 0.05 });
  animate(bar, 'scale', open ? 0 : 1, ICON, (v) => (bar.style.scale = String(Math.max(0, v))));
  animate(bar, 'rotate', open ? 80 : 0, ICON, (v) => (bar.style.rotate = `${v}deg`), { restDelta: 0.05 });

  if (open) {
    question.open = true;
    panel.inert = false;
    const current = panel.getBoundingClientRect().height;
    animate(panel, 'height', panel.scrollHeight, HEIGHT, (v) => (panel.style.height = `${v}px`), {
      from: current,
      restDelta: 0.5,
      done: () => (panel.style.height = 'auto'),
    });
    animate(content, 'opacity', 1, OPACITY, (v) => (content.style.opacity = String(v)), { delay: 0.1 });
  } else {
    panel.inert = true;
    const current = panel.getBoundingClientRect().height;
    animate(panel, 'height', 0, HEIGHT, (v) => (panel.style.height = `${Math.max(0, v)}px`), {
      from: current,
      restDelta: 0.5,
      done: () => {
        if (question.dataset.open === 'false') question.open = false;
      },
    });
    animate(content, 'opacity', 0, OPACITY, (v) => (content.style.opacity = String(v)));
  }
}

export function initFaq(root: Document) {
  const accordions = [...root.querySelectorAll<HTMLElement>('[data-faq-accordion]')];

  accordions.forEach((accordion) => {
    const questions = [...accordion.querySelectorAll<HTMLDetailsElement>('.faq-question')];
    questions.forEach((question) => {
      const panel = question.querySelector<HTMLElement>('.faq-panel');
      const content = question.querySelector<HTMLElement>('.faq-content');
      if (panel && content && !question.open) {
        panel.style.height = '0px';
        content.style.opacity = '0';
      }
      question.querySelector('summary')?.addEventListener('click', (event) => {
        event.preventDefault();
        const opening = question.dataset.open !== 'true';
        // Un seul index ouvert par thème : ouvrir une question referme l'autre.
        if (opening) questions.forEach((other) => other !== question && other.dataset.open === 'true' && setOpen(other, false));
        setOpen(question, opening);
      });
    });
  });

  // Une adresse #question ouvre la question correspondante.
  const openFromHash = () => {
    const target = root.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!(target instanceof HTMLDetailsElement) || !target.matches('.faq-question')) return;
    const siblings = target.parentElement?.querySelectorAll<HTMLDetailsElement>('.faq-question') ?? [];
    siblings.forEach((other) => other !== target && other.dataset.open === 'true' && setOpen(other, false));
    setOpen(target, true);
  };
  window.addEventListener('hashchange', openFromHash);
  openFromHash();

  // Index des thèmes : le dernier titre dépassé (défilement + 128 px) est actif.
  const headings = [...root.querySelectorAll<HTMLElement>('.faq-article h2')];
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-faq-link]')];
  let active = '';
  const track = () => {
    let next = '';
    const body = document.body.getBoundingClientRect();
    if (document.body.clientHeight < -body.top + window.innerHeight + 24) next = headings.at(-1)?.id ?? '';
    else headings.forEach((heading) => {
      if (window.scrollY + 128 > heading.getBoundingClientRect().top + window.scrollY) next = heading.id;
    });
    if (next === active) return;
    active = next;
    links.forEach((link) => (link.dataset.active = String(link.dataset.faqLink === active)));
  };
  links.forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      root.getElementById(link.dataset.faqLink ?? '')?.scrollIntoView({ behavior: REDUCED.matches ? 'auto' : 'smooth' });
    }),
  );
  window.addEventListener('scroll', track, { passive: true });
  window.addEventListener('resize', track);
  track();
}
