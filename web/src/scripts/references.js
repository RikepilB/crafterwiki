export function initReferences() {
  const form=document.querySelector('#explore');
  if (!(form instanceof HTMLFormElement)) return;

  let cards=[...document.querySelectorAll('.reference-card')];
  const grid=document.querySelector('#results');
  const count=document.querySelector('#count');
  const more=document.querySelector('#more-results');
  const empty=document.querySelector('#empty-results');
  const activeFilters=document.querySelector('#active-filters');
  const drawer=document.querySelector('.filter-drawer');
  const eventSearch=document.querySelector('[data-event-search]');
  const eventEmpty=document.querySelector('[data-event-empty]');
  const fields=['q','event','topic','year','status','mechanism','lens','kind'];
  const toggles=['videos','analyzed','winners','entries'];
  const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const control=name=>form.elements.namedItem(name);
  const visibleText=element=>{
    const language=document.documentElement.lang || 'en';
    return element?.querySelector?.(`[lang="${language}"]`)?.textContent?.trim() || element?.textContent?.trim() || '';
  };

  const selectBrowsePanel=name=>{
    for(const button of document.querySelectorAll('[data-browse-tab]'))button.setAttribute('aria-selected',String(button.dataset.browseTab===name));
    for(const panel of document.querySelectorAll('[data-browse-panel]'))panel.hidden=panel.dataset.browsePanel!==name;
  };

  const params=new URLSearchParams(location.search);
  for(const key of fields){const item=control(key);if(params.has(key)&&item)item.value=params.get(key);}
  for(const key of toggles){const item=control(key);if(item)item.checked=params.get(key)==='1';}
  if(params.get('event'))selectBrowsePanel('events');
  if(matchMedia('(max-width: 900px)').matches&&drawer instanceof HTMLDetailsElement)drawer.open=false;

  let limit=18;
  let timer;

  // Roster cards are a separate static fragment, fetched the first time other submissions are included,
  // then slotted back into explorer order. Until it arrives (or if it fails) the results are incomplete,
  // so the page says so instead of reporting a partial count or "no matches".
  let roster;
  let rosterReady=false;
  let rosterState='idle';
  const rosterStatus=document.querySelector('#roster-status');
  const loadRoster=()=>roster??=fetch(grid.dataset.rosterSrc).then(response=>{
    if(!response.ok)throw new Error(`roster ${response.status}`);
    return response.text();
  }).then(html=>{
    const extra=[...new DOMParser().parseFromString(html,'text/html').querySelectorAll('.reference-card')].map(card=>document.importNode(card,true));
    extra.forEach(card=>card.hidden=true);
    cards=[...cards,...extra].sort((a,b)=>Number(a.dataset.order)-Number(b.dataset.order));
    grid.append(...cards);
    rosterReady=true;
  }).catch(error=>{roster=undefined;throw error;});

  const filterLabel=(key,value)=>{
    if(key==='q')return `“${value}”`;
    const item=control(key);
    if(item instanceof HTMLSelectElement)return item.selectedOptions[0]?.textContent?.trim() || value;
    if(item instanceof RadioNodeList){
      const selected=[...form.querySelectorAll(`[name="${key}"]`)].find(input=>input.value===value);
      return visibleText(selected?.closest('label')?.querySelector(':scope > span')) || value;
    }
    if(item instanceof HTMLInputElement)return visibleText(item.closest('label')) || value;
    return value;
  };

  const renderActiveFilters=data=>{
    if(!activeFilters)return;
    activeFilters.replaceChildren();
    for(const key of [...fields,...toggles]){
      const value=data.get(key);
      if(!value)continue;
      const button=document.createElement('button');
      button.type='button';
      button.dataset.clearFilter=key;
      button.textContent=`${filterLabel(key,value)} ×`;
      button.setAttribute('aria-label',`Remove ${filterLabel(key,value)} filter`);
      activeFilters.append(button);
    }
  };

  const render=()=>{
    const data=new FormData(form);
    if(data.get('entries')&&rosterState==='idle'&&grid?.dataset.rosterSrc){
      rosterState='loading';
      loadRoster().then(()=>{rosterState='ready';render();},error=>{console.error(error);rosterState='error';render();});
    }
    const incomplete=Boolean(data.get('entries'))&&!rosterReady&&Boolean(grid?.dataset.rosterSrc);
    if(rosterStatus){
      rosterStatus.hidden=!incomplete;
      rosterStatus.querySelector('[data-roster-loading]').hidden=rosterState==='error';
      rosterStatus.querySelector('[data-roster-error]').hidden=rosterState!=='error';
    }
    const terms=normalize(data.get('q') || '').trim().split(/\s+/).filter(Boolean);
    const matches=cards.filter(card=>{
      if(card.dataset.roster==='true'&&!data.get('entries'))return false;
      if(data.get('winners')&&card.dataset.winner!=='true')return false;
      if(data.get('videos')&&card.dataset.video!=='true')return false;
      if(data.get('analyzed')&&card.dataset.analyzed!=='true')return false;
      if(!terms.every(term=>normalize(card.dataset.search).includes(term)))return false;
      return fields.filter(key=>key!=='q').every(key=>{
        const value=data.get(key);
        if(!value)return true;
        return ['topic','mechanism','lens'].includes(key)
          ? (card.dataset[key] || '').split(' ').includes(value)
          : card.dataset[key]===value;
      });
    });

    cards.forEach(card=>card.hidden=true);
    matches.slice(0,limit).forEach(card=>card.hidden=false);
    if(count)count.textContent=`${matches.length} result${matches.length===1?'':'s'} · showing ${Math.min(limit,matches.length)}`;
    if(more)more.hidden=limit>=matches.length;
    if(empty)empty.hidden=matches.length>0||incomplete;
    renderActiveFilters(data);

    const qs=new URLSearchParams();
    for(const key of fields)if(data.get(key))qs.set(key,data.get(key));
    for(const key of toggles)if(data.get(key))qs.set(key,'1');
    history.replaceState(null,'',qs.size?`?${qs}`:location.pathname);
    timer=undefined;
  };

  const localizeInputs=()=>{
    const spanish=document.documentElement.lang==='es';
    const query=control('q');
    if(query instanceof HTMLInputElement)query.placeholder=spanish?'Proyecto, problema, tecnología…':'Project, problem, technology…';
    if(eventSearch instanceof HTMLInputElement)eventSearch.placeholder=spanish?'Escribe el nombre del evento…':'Type an event name…';
  };

  const filterEvents=()=>{
    const term=normalize(eventSearch?.value || '');
    let shown=0;
    for(const option of document.querySelectorAll('.event-option')){
      option.hidden=!normalize(option.dataset.eventLabel).includes(term);
      if(!option.hidden)shown+=1;
    }
    for(const group of document.querySelectorAll('[data-event-year]'))group.hidden=![...group.querySelectorAll('.event-option')].some(option=>!option.hidden);
    if(eventEmpty)eventEmpty.hidden=shown>0;
  };

  for(const button of document.querySelectorAll('[data-browse-tab]'))button.addEventListener('click',()=>selectBrowsePanel(button.dataset.browseTab));
  eventSearch?.addEventListener('input',filterEvents);
  activeFilters?.addEventListener('click',event=>{
    const button=event.target.closest('[data-clear-filter]');
    if(!button)return;
    const item=control(button.dataset.clearFilter);
    if(item instanceof RadioNodeList){
      for(const input of form.querySelectorAll(`[name="${button.dataset.clearFilter}"]`))input.checked=input.value==='';
    }
    else if(item instanceof HTMLInputElement&&['checkbox','radio'].includes(item.type))item.checked=false;
    else if(item)item.value='';
    limit=18;render();
  });
  form.addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);limit=18;render();});
  form.addEventListener('input',event=>{
    if(event.target===eventSearch)return;
    clearTimeout(timer);limit=18;
    if(event.target.name==='q')timer=setTimeout(render,180);else render();
  });
  form.addEventListener('reset',()=>{
    clearTimeout(timer);limit=18;
    if(eventSearch)eventSearch.value='';
    selectBrowsePanel('topics');
    setTimeout(()=>{filterEvents();render();},0);
  });
  more?.addEventListener('click',()=>{if(timer){clearTimeout(timer);limit=18;}else limit+=18;render();});
  rosterStatus?.querySelector('[data-roster-retry]')?.addEventListener('click',()=>{rosterState='idle';render();});
  window.addEventListener('crafter-language-applied',()=>{localizeInputs();render();});
  localizeInputs();filterEvents();render();
}
