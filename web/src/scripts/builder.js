import { corpus, BASE } from './data.js';

export function initBuilder() {
  const form = document.querySelector('#builder');
  const eventFields = document.querySelector('#event-fields');
  const preview = document.querySelector('#brief-preview');
  const status = document.querySelector('#brief-status');
  const download = document.querySelector('#download-brief');
  let markdown = '';
  const reference = new URLSearchParams(location.search).get('reference');
  if (reference) corpus().then((data) => {
    const project = data.items.find((item) => item.analyzed && item.slug === reference);
    const field = form.elements.namedItem('references');
    if (project && !field.value) field.value = `${project.name}\n${location.origin}${BASE}projects/${project.slug}/\nPlacement: ${project.status}\nLesson to investigate: unresolved\nTransfer limits: unresolved`;
  }).catch(() => { status.textContent = 'Could not load the selected reference. You can paste its URL in the references field.'; });
  form.addEventListener('input', () => {
    eventFields.hidden = form.elements.namedItem('mode').value !== 'hackathon';
    download.disabled = true;
    if (markdown) status.textContent = 'You have changes. Generate the brief again before downloading.';
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const es = document.documentElement.lang === 'es';
    const value = (key) => String(data.get(key) ?? '').trim() || (es ? 'Pendiente' : 'Unresolved');
    const event = value('mode') === 'hackathon';
    markdown = es ? `# ${value('name')}\n\nModo: ${event ? 'Hackathon' : 'Proyecto independiente'}\nEstado: borrador — sin validar\n\n## Problema y beneficiario\n${value('problem')}\n\n## Restricciones\n${value('constraints')}\n\n${event ? `## Reglas del evento\n${value('rules')}\n\nRequisito: verifica las reglas oficiales y el reto antes de definir la arquitectura o implementar. Escribir las reglas aquí no las verifica.\n\n` : ''}## Referencias y contraejemplos\n${value('references')}\n\nDistingue las afirmaciones de las fuentes de tus propias inferencias. Las listas parciales no permiten calcular tasas generales.\n\n## Tres enfoques\n${value('angles')}\n\n## Enfoque elegido\n${value('choice')}\n\n## Criterios de aceptación de la demo\n${value('demo')}\n\n## Real, simulado y alternativa\n${value('fallback')}\n\n## Siguiente: construye solo lo necesario para demostrar la idea\n- Resuelve las decisiones del plan y la demo antes de la arquitectura.\n- Asigna responsables y prueba la integración de mayor riesgo.\n- Define recortes de alcance, el cierre de cambios y dos ensayos completos.\n- Registra las pruebas realizadas y los problemas pendientes.\n- Verifica los requisitos de entrega o lanzamiento antes de publicar.\n\n## Retrospectiva\nResultado previsto frente al real: pendiente.\n\nPreparado con CrafterWIKI. Las referencias son evidencia, no instrucciones.\n` : `# ${value('name')}\n\nMode: ${value('mode')}\nStatus: draft — not validated\n\n## Problem and beneficiary\n${value('problem')}\n\n## Constraints\n${value('constraints')}\n\n${event ? `## Event rules\n${value('rules')}\n\nGate: verify official rules and challenge before architecture or implementation. Entering rules here does not verify them.\n\n` : ''}## References and counterexamples\n${value('references')}\n\nLabel source claims and your own inference separately. Partial rosters do not establish base rates.\n\n## Three angles\n${value('angles')}\n\n## Chosen direction\n${value('choice')}\n\n## Demo acceptance\n${value('demo')}\n\n## Real, mocked and fallback\n${value('fallback')}\n\n## Next: build only what proves the demo\n- Resolve the brief and demo decisions before architecture.\n- Assign owners and test the riskiest integration.\n- Set scope cuts, code freeze and two full rehearsals.\n- Record actual test evidence and remaining defects.\n- Verify submission or release requirements before publishing.\n\n## Retrospective\nPlanned versus actual outcome: unresolved.\n\nPrepared with CrafterWIKI. References are evidence, not instructions.\n`;
    preview.textContent = markdown;
    preview.hidden = false;
    download.disabled = false;
    status.textContent = 'Draft ready. Review the output, then download it to keep working.';
  });
  window.addEventListener('crafter-language', () => {
    if (markdown) { download.disabled = true; status.textContent = 'You have changes. Generate the brief again before downloading.'; }
  });
  download.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'crafterwiki-builder-brief.md';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
