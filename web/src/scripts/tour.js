// Small, dependency-free guided tour. One step at a time: a popover under (or above) its target on
// wide screens, a bottom sheet on narrow ones. Esc, "Skip tour" or finishing marks the tour as seen,
// so it only opens by itself on a first visit. Copy is plain English text in the DOM, which the site's
// language layer translates like any other interface text.
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const narrow = () => matchMedia('(max-width: 640px)').matches;

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'text') node.textContent = value;
    else if (key === 'className') node.className = value;
    else node.setAttribute(key, value);
  }
  for (const child of children) node.append(child);
  return node;
}

export function createTour({ id, steps, label = 'Guided tour' }) {
  const storageKey = `cw-tour-${id}`;
  let index = -1;
  let box = null;
  let target = null;
  let returnFocus = null;
  let frame = 0;

  const seen = () => { try { return localStorage.getItem(storageKey) === 'done'; } catch { return false; } };
  const remember = () => { try { localStorage.setItem(storageKey, 'done'); } catch { /* Storage can be unavailable; the tour still closes. */ } };

  function place() {
    frame = 0;
    if (!box || !target) return;
    if (narrow()) {
      box.classList.add('cw-tour-sheet');
      box.style.top = '';
      box.style.left = '';
      return;
    }
    box.classList.remove('cw-tour-sheet');
    const rect = target.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = box;
    const fitsBelow = rect.bottom + 12 + height <= innerHeight;
    const top = (fitsBelow || rect.top < height + 24 ? rect.bottom + 12 : rect.top - height - 12) + scrollY;
    const maxLeft = scrollX + document.documentElement.clientWidth - width - 12;
    box.style.top = `${Math.max(scrollY + 12, top)}px`;
    box.style.left = `${Math.max(scrollX + 12, Math.min(rect.left + scrollX, maxLeft))}px`;
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(place); };

  function render() {
    const step = steps[index];
    target?.classList.remove('cw-tour-target');
    target = document.querySelector(step.target);
    target?.classList.add('cw-tour-target');
    target?.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });

    const last = index === steps.length - 1;
    const actions = el('div', { className: 'cw-tour-actions' }, [
      el('button', { type: 'button', className: 'cw-tour-skip', 'data-tour': 'skip', text: 'Skip tour' }),
      el('span', { className: 'cw-tour-nav' }, [
        ...(index > 0 ? [el('button', { type: 'button', className: 'btn', 'data-tour': 'back', text: 'Back' })] : []),
        el('button', { type: 'button', className: 'btn primary', 'data-tour': 'next', text: last ? 'Done' : 'Next' }),
      ]),
    ]);
    box.replaceChildren(
      el('p', { className: 'cw-tour-count' }, [
        el('span', { text: 'Step' }), ' ', el('b', { text: String(index + 1) }), ' ',
        el('span', { text: 'of' }), ' ', el('b', { text: String(steps.length) }),
      ]),
      el('h2', { className: 'cw-tour-title', id: `cw-tour-title-${id}`, text: step.title }),
      el('p', { className: 'cw-tour-body', text: step.body }),
      actions,
    );
    // Position after the smooth scroll has moved the target into view.
    place();
    setTimeout(place, reducedMotion() ? 0 : 350);
    box.focus({ preventScroll: true });
  }

  function onClick(event) {
    const action = event.target instanceof Element ? event.target.closest('[data-tour]')?.dataset.tour : null;
    if (action === 'skip') end();
    else if (action === 'back' && index > 0) { index -= 1; render(); }
    else if (action === 'next') { if (index === steps.length - 1) end(); else { index += 1; render(); } }
  }
  function onKey(event) { if (event.key === 'Escape') end(); }

  function start() {
    if (box) return;
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    box = el('div', { className: 'cw-tour', role: 'dialog', 'aria-modal': 'false', 'aria-label': label, 'aria-labelledby': `cw-tour-title-${id}`, tabindex: '-1' });
    box.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    addEventListener('resize', schedule);
    addEventListener('scroll', schedule, { passive: true });
    document.body.append(box);
    index = 0;
    render();
  }

  function end() {
    if (!box) return;
    remember();
    target?.classList.remove('cw-tour-target');
    target = null;
    document.removeEventListener('keydown', onKey);
    removeEventListener('resize', schedule);
    removeEventListener('scroll', schedule);
    box.remove();
    box = null;
    index = -1;
    returnFocus?.focus?.({ preventScroll: true });
  }

  return { start, end, seen };
}
