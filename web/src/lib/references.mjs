// Build a single browsing collection without changing source verification or winner statistics.
export function mergeReferences(corpus, hall, media, hallMedia) {
  const safe = value => typeof value === 'string' && /^https?:\/\//.test(value) ? value : null;
  const canonical = value => { try { const u = new URL(value); return u.origin + u.pathname.replace(/\/$/, ''); } catch { return null; } };
  const projects = new Map(corpus.projects.map(p => [p.slug, p]));
  const records = corpus.items.map(item => {
    const project = projects.get(item.slug);
    return {...item, origin:'corpus', roster:!item.analyzed, eventLabel:`${item.event} ${String(item.event).includes(String(item.year)) ? '' : item.year}`.trim(),
      eventId:item.hackathon, url:item.analyzed ? `/projects/${item.slug}/` : `/hackathons/${item.hackathon}/#roster`,
      summary:{en:item.tagline}, lesson:project?.analysis?.lessons?.[0] || '',
      sourceUrl:safe(project?.sources?.[0]?.url) || safe(item.links?.submission),
      links:Object.fromEntries(Object.entries(item.links || {}).filter(([,v])=>safe(v))),
      variants:media[item.slug]?.variants || [], hall:null};
  });
  for (const p of hall) {
    const duplicate = records.find(r=>canonical(r.links.devpost || r.links.submission) && canonical(r.links.devpost || r.links.submission)===canonical(p.links.devpost));
    if (duplicate) {
      duplicate.hall=p; duplicate.variants=duplicate.variants.length ? duplicate.variants : (hallMedia[p.slug]?.variants || []);
      duplicate.links={...p.links,...duplicate.links};
      continue;
    }
    const rawEvent=p.event.split(' · ')[0]+' '+p.event.match(/\b20\d{2}\b/)?.[0];
    const matchingEvent=records.find(r=>r.eventLabel.toLowerCase()===rawEvent.toLowerCase());
    const eventLabel=matchingEvent?.eventLabel || rawEvent;
    records.push({slug:`hall-${p.slug}`,name:p.name,origin:'hall',roster:false,analyzed:false,event:eventLabel,eventLabel,eventId:matchingEvent?.eventId || eventLabel,
      year:Number(p.event.match(/\b20\d{2}\b/)?.[0]),status:'reported-winner',reportedAward:p.reportedAward,
      domains:[],mechanisms:[],lenses:[],event_kind:'',summary:p.summary,lesson:p.lesson,sourceUrl:p.sourceUrl,url:p.sourceUrl,
      links:Object.fromEntries(Object.entries(p.links).filter(([,v])=>safe(v))),variants:hallMedia[p.slug]?.variants || [],hall:p});
  }
  // Media-backed references lead the gallery; source order is stable within each group.
  return records.sort((a,b)=>Number(b.variants.length>0)-Number(a.variants.length>0));
}
