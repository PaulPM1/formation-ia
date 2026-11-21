// Les deux jeux des slides. Tout est délégué au document : avec le
// ClientRouter, le <body> change à chaque slide mais `document` reste.

document.addEventListener('click', (event) => {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>('.slide-game button');
  if (!button) return;

  const quiz = button.closest<HTMLElement>('[data-quiz]');
  if (quiz) {
    for (const option of quiz.querySelectorAll<HTMLButtonElement>('.slide-game__options button')) {
      const correct = option.dataset.correct === 'true';
      option.dataset.state = correct ? 'right' : option === button ? 'wrong' : 'dim';
    }
    quiz.querySelector('[data-quiz-why]')!.textContent = button.dataset.why ?? '';
    return;
  }

  const sort = button.closest<HTMLElement>('[data-sort]');
  if (!sort) return;
  const items = JSON.parse(sort.dataset.items ?? '[]') as { label: string; bucket: number; why?: string }[];
  const dots = [...sort.querySelectorAll<HTMLElement>('[data-sort-dots] i')];
  const card = sort.querySelector<HTMLElement>('[data-sort-card]')!;
  const why = sort.querySelector<HTMLElement>('[data-sort-why]')!;
  const score = sort.querySelector<HTMLElement>('[data-sort-score]')!;
  const replay = sort.querySelector<HTMLButtonElement>('[data-sort-replay]')!;
  const buckets = [...sort.querySelectorAll<HTMLButtonElement>('[data-bucket]')];

  const showCard = (index: number) => {
    sort.dataset.index = String(index);
    card.textContent = items[index].label;
    // Rejoue l'animation d'entrée de la carte.
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';
    for (const bucket of buckets) {
      bucket.disabled = false;
      delete bucket.dataset.state;
    }
  };

  if (button === replay) {
    for (const dot of dots) delete dot.dataset.state;
    sort.dataset.right = '0';
    score.textContent = '';
    why.textContent = '';
    replay.hidden = true;
    showCard(0);
    return;
  }

  const index = Number(sort.dataset.index ?? 0);
  const item = items[index];
  const right = Number(button.dataset.bucket) === item.bucket;
  const total = Number(sort.dataset.right ?? 0) + (right ? 1 : 0);
  sort.dataset.right = String(total);
  dots[index].dataset.state = right ? 'right' : 'wrong';
  for (const bucket of buckets) {
    bucket.disabled = true;
    bucket.dataset.state = Number(bucket.dataset.bucket) === item.bucket ? 'right' : bucket === button ? 'wrong' : 'dim';
  }
  why.textContent = item.why ?? '';

  window.setTimeout(() => {
    if (!sort.isConnected) return;
    if (index + 1 < items.length) {
      why.textContent = '';
      showCard(index + 1);
    } else {
      score.textContent = `${total} sur ${items.length}`;
      replay.hidden = false;
    }
  }, 1900);
});
