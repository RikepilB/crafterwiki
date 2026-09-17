export function initReferences() {
  const form=document.querySelector('#explore');
  if (!(form instanceof HTMLFormElement)) return;
  const cards=[...document.querySelectorAll('.reference-card')];
  const count=document.querySelector('#count');
  const more=document.querySelector('#more-results');
  const empty=document.querySelector('#empty-results');
  const fields=['q','event','year','status','domain','mechanism','lens','kind'];
  const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const params=new URLSearchParams(location.search);
  for(const key of fields) if(params.has(key)) form.elements.namedItem(key).value=params.get(key);
  for(const key of ['winners','entries']) form.elements.namedItem(key).checked=params.get(key)==='1';
  let limit=12;
  let timer;
  const render=()=>{
    const data=new FormData(form);
    const terms=normalize(data.get('q') || '').trim().split(/\s+/).filter(Boolean);
    const matches=cards.filter(card=>{
      if(card.dataset.roster==='true'&&!data.get('entries'))return false;
      if(data.get('winners')&&card.dataset.winner!=='true')return false;
      if(!terms.every(t=>normalize(card.dataset.search).includes(t)))return false;
      return fields.filter(k=>k!=='q').every(k=>!data.get(k)||( ['domain','mechanism','lens'].includes(k)?(card.dataset[k]||'').split(' ').includes(data.get(k)):card.dataset[k]===data.get(k)));
    });
    cards.forEach(card=>card.hidden=true);
    matches.slice(0,limit).forEach(card=>card.hidden=false);
    count.textContent=`${matches.length} result${matches.length===1?'':'s'} · showing ${Math.min(limit,matches.length)}`;
    more.hidden=limit>=matches.length;
    empty.hidden=matches.length>0;
    const qs=new URLSearchParams();
    for(const key of fields)if(data.get(key))qs.set(key,data.get(key));
    for(const key of ['winners','entries'])if(data.get(key))qs.set(key,'1');
    history.replaceState(null,'',qs.size?`?${qs}`:location.pathname);
    timer=undefined;
  };
  form.addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);limit=12;render();});
  form.addEventListener('input',event=>{clearTimeout(timer);limit=12;if(event.target.name==='q')timer=setTimeout(render,180);else render();});
  form.addEventListener('reset',()=>{clearTimeout(timer);limit=12;setTimeout(render,0);});
  more.addEventListener('click',()=>{if(timer){clearTimeout(timer);limit=12;}else limit+=12;render();});
  render();
}
