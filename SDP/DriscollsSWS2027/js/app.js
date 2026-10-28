(function(){
  const BERRIES=['b-straw','b-blue','b-rasp','b-black'];
  const IW_PRIZES=["a Driscoll's t-shirt","a pair of berry socks","a pickleball set","a $100 gift card","a market tote"];
  const SOCIAL=['instagram','tiktok','x','facebook'];
  const CH_LABEL={text:'Text',email:'Email',copy:'Copy link',instagram:'Instagram',tiktok:'TikTok',x:'X',facebook:'Facebook'};
  const DEMO_PEOPLE=[
    {first:'Jamie',last:'Rivera',email:'jamie.rivera@example.com',street:'742 Orchard Lane',apt:'',city:'Milwaukee',state:'WI',zip:'53202'},
    {first:'Taylor',last:'Brooks',email:'taylor.brooks@example.com',street:'1820 Berry Court',apt:'Apt 3B',city:'Chicago',state:'IL',zip:'60614'},
    {first:'Morgan',last:'Lee',email:'morgan.lee@example.com',street:'315 Garden Row',apt:'',city:'Minneapolis',state:'MN',zip:'55401'},
    {first:'Avery',last:'Patel',email:'avery.patel@example.com',street:'2400 Meadow Avenue',apt:'Unit 12',city:'Detroit',state:'MI',zip:'48201'},
    {first:'Riley',last:'Chen',email:'riley.chen@example.com',street:'101 Harvest Way',apt:'',city:'Indianapolis',state:'IN',zip:'46204'}
  ];
  const STATES=[['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming']];
  let S;
  function fresh(){return {users:[],current:null,pendingRef:null,events:[],blocked:{dup:0,self:0,zip:0},visits:0,outcome:'win',dataset:'live'};}
  S=fresh();

  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const cur=()=>S.users.find(u=>u.id===S.current);
  const code=n=>n.toUpperCase().slice(0,5)+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
  const linkFor=u=>'driscolls.com/sweetness/r/'+u.code;
  const now=()=>new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  function log(type,detail){S.events.push({t:now(),type,detail});}

  /* ---------- views ---------- */
  function show(view){
    ['landing','spin','share'].forEach(v=>$('#v-'+v).classList.toggle('hidden',v!==view));
    const u=cur();
    $('#entryPill').classList.toggle('hidden',!u);
    $('#hdrJoin').classList.toggle('hidden',!!u && view!=='landing');
    if(u){$('#pillN').textContent=entries(u).total;}
    if(view!=='landing') window.scrollTo({top:0,behavior:'instant'});
    renderSides();
  }
  function mode(m){
    $('#consumer').classList.toggle('hidden',m!=='consumer');
    $('#insights').classList.toggle('hidden',m!=='insights');
    $$('.demobar .seg button').forEach(b=>b.classList.toggle('on',b.dataset.mode===m));
    if(m==='insights') renderInsights();
    window.scrollTo({top:0,behavior:'instant'});
  }
  $$('.demobar .seg button').forEach(b=>b.onclick=()=>mode(b.dataset.mode));

  /* ---------- entries ---------- */
  function entries(u){
    const social=Math.min(u.socialEarned.length,4);
    const refs=Math.min(u.validated.length,10);
    return {base:1,social,refs,total:1+social+refs};
  }

  /* ---------- view-as select ---------- */
  function renderViewAs(){
    const sel=$('#viewAs');
    let h='<option value="new">New visitor</option>';
    S.users.forEach(u=>h+=`<option value="${u.id}">${u.first} ${u.last[0]}.${u.referredBy?' (referred)':''}</option>`);
    sel.innerHTML=h; sel.value=S.current||'new';
  }
  $('#viewAs').onchange=e=>{
    const v=e.target.value;
    mode('consumer');
    if(v==='new'){S.current=null;S.pendingRef=null;setInvite(null);show('landing');}
    else{S.current=+v;const u=cur();show(u.spun?'share':'spin');if(!u.spun)buildReels();else renderShare();}
  };

  /* ---------- registration ---------- */
  function setInvite(refUser){
    S.pendingRef=refUser?refUser.id:null;
    $('#inviteBanner').classList.toggle('hidden',!refUser);
    if(refUser){$('#invName').textContent=refUser.first;$('#invAv').textContent=refUser.first[0];}
  }
  $('#autofill').onclick=()=>{
    const used=S.users.map(u=>u.email);
    const p=DEMO_PEOPLE.find(p=>!used.includes(p.email))||{first:'Casey',last:'Nguyen',email:'casey'+Date.now()%1000+'@example.com',street:'55 Garden Way',apt:'',city:'Madison',state:'WI',zip:'53703'};
    $('#fFirst').value=p.first;$('#fLast').value=p.last;$('#fEmail').value=p.email;$('#fStreet').value=p.street;$('#fApt').value=p.apt;$('#fCity').value=p.city;$('#fState').value=p.state;$('#fZip').value=p.zip;$('#fRules').checked=true;
    $('#regErr').textContent='';
  };
  $('#regForm').onsubmit=e=>{
    e.preventDefault();
    const f={first:$('#fFirst').value.trim(),last:$('#fLast').value.trim(),email:$('#fEmail').value.trim().toLowerCase(),street:$('#fStreet').value.trim(),apt:$('#fApt').value.trim(),city:$('#fCity').value.trim(),state:$('#fState').value,zip:$('#fZip').value.trim()};
    Object.keys(f).forEach(k=>f[k]=f[k].replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c])));
    $$('#regForm input, #regForm select').forEach(i=>i.classList.remove('bad'));
    const err=m=>{$('#regErr').textContent=m;};
    const miss=[['fFirst',f.first],['fLast',f.last],['fEmail',f.email],['fStreet',f.street],['fCity',f.city],['fState',f.state],['fZip',f.zip]].filter(x=>!x[1]);
    if(miss.length){miss.forEach(x=>$('#'+x[0]).classList.add('bad'));return err('Please complete all required fields.');}
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)){$('#fEmail').classList.add('bad');return err('Please enter a valid email address.');}
    if(!/^\d{5}$/.test(f.zip)){$('#fZip').classList.add('bad');S.blocked.zip++;return err('Please enter a valid 5 digit U.S. ZIP code.');}
    if(!$('#fRules').checked) return err('Please agree to the Official Rules to enter.');
    const ref=S.pendingRef?S.users.find(u=>u.id===S.pendingRef):null;
    if(ref && ref.email===f.email){S.blocked.self++;log('referral_blocked',`self referral ref=${ref.code}`);return err("Looks like this is the same email that sent the invite. Self referrals aren't eligible.");}
    if(S.users.some(u=>u.email===f.email)){S.blocked.dup++;log('registration_blocked',`duplicate email ${f.email}`);return err('This email is already registered. One registration per person.');}
    const u={id:S.users.length+1,...f,optin:$('#fOptin').checked,code:code(f.first),referredBy:ref?ref.id:null,shares:{},socialEarned:[],validated:[],spun:false,prize:null,feed:[]};
    S.users.push(u);S.current=u.id;
    log('registration',`${f.first} ${f.last[0]}. ${f.city}, ${f.state} code=${u.code}${ref?' ref='+ref.code:''}${u.optin?' optin=yes':''}`);
    u.feed.push({plus:true,txt:'Registered: 1 sweepstakes entry'});
    if(ref){
      ref.validated.push(u.id);
      log('referral_validated',`credited to ${ref.first} (${ref.code}) +1 entry`);
      ref.feed.push({plus:true,txt:`${f.first} joined through your link: +1 entry`});
      setTimeout(()=>toast(`<b>Referral validated.</b> ${ref.first} just earned +1 entry because ${f.first} joined.`),500);
    }
    $('#regForm').reset();setInvite(null);
    renderViewAs();buildReels();
    $('#spinName').textContent=u.first;
    show('spin');
  };

  /* ---------- spin ---------- */
  function cellHTML(id){return `<div class="cell"><svg viewBox="0 0 100 100"><use href="#${id}"/></svg></div>`;}
  function buildReels(){
    const u=cur(); if(u) $('#spinName').textContent=u.first;
    $('#reels').innerHTML=[0,1,2].map(i=>`<div class="reel"><div class="strip" id="strip${i}">${cellHTML(BERRIES[(i+1)%4])}</div></div>`).join('');
    $('#spinResult').className='result';$('#spinResult').innerHTML='';
    $('#spinBtn').disabled=false;$('#spinBtn').classList.remove('hidden');
  }
  $('#spinBtn').onclick=()=>{
    const u=cur(); if(!u||u.spun) return;
    $('#spinBtn').disabled=true;
    let final;
    const o=S.outcome==='random'?(Math.random()<.25?'win':'lose'):S.outcome;
    if(o==='win'){const b=BERRIES[Math.floor(Math.random()*4)];final=[b,b,b];}
    else{final=[0,1,2].map(()=>BERRIES[Math.floor(Math.random()*4)]);if(final[0]===final[1]&&final[1]===final[2])final[2]=BERRIES[(BERRIES.indexOf(final[2])+1)%4];}
    const h=$('.reel').offsetHeight;
    final.forEach((fb,i)=>{
      const strip=$('#strip'+i);
      const n=14+i*5;let html='';
      for(let k=0;k<n;k++)html+=cellHTML(BERRIES[(k+i)%4]);
      html+=cellHTML(fb);
      strip.innerHTML=html;strip.style.transition='none';strip.style.transform='translateY(0)';
      strip.offsetHeight;
      strip.style.transition=`transform ${1.4+i*.55}s cubic-bezier(.15,.75,.25,1)`;
      strip.style.transform=`translateY(-${n*h}px)`;
    });
    setTimeout(()=>finishSpin(o),1400+2*550+250);
  };
  function finishSpin(o){
    const u=cur();u.spun=true;
    const r=$('#spinResult');
    if(o==='win'){
      u.prize=IW_PRIZES[Math.floor(Math.random()*IW_PRIZES.length)];
      log('instant_win',`${u.first} won ${u.prize} (pending verification)`);
      u.feed.push({plus:true,txt:'Instant win: '+u.prize});
      r.className='result win show';
      r.innerHTML=`<h3>Sweet! You won ${u.prize}.</h3><p>We'll email you at ${u.email} to verify, then ship it to ${u.street}${u.apt?', '+u.apt:''}, ${u.city}, ${u.state}. Your sweepstakes entry is in too.</p><button class="btn" data-next>Share some sweetness</button>`;
    }else{
      log('instant_win',`${u.first} no prize`);
      r.className='result lose show';
      r.innerHTML=`<h3>Not this time, but you're still in!</h3><p>Your grand prize entry is locked in. Share the sweetness to earn extra entries.</p><button class="btn" data-next>Share some sweetness</button>`;
    }
    $('#spinBtn').classList.add('hidden');
    r.querySelector('[data-next]').onclick=()=>{renderShare();show('share');};
    renderSides();
  }

  /* ---------- share ---------- */
  function renderShare(){
    const u=cur(); if(!u) return;
    $('#refLink').textContent='https://'+linkFor(u);
    const step=u.validated.length?5:3;
    $$('#v-share .progress').forEach(p=>setProgress(p,step));
    $('#shareEyebrow').textContent=u.validated.length?'Keep sharing':'Share a little sweetness';
    $('#shareTitle').innerHTML=u.validated.length?`${u.validated.length} friend${u.validated.length>1?'s':''} joined. <span class="script">Keep sharing!</span>`:'Share some <span class="script">sweetness</span>';
    Object.keys(CH_LABEL).forEach(ch=>{
      const m=$(`[data-meta="${ch}"]`);const n=u.shares[ch]||0;
      if(SOCIAL.includes(ch)){m.textContent=u.socialEarned.includes(ch)?'+1 entry earned':'+1 entry';m.classList.toggle('earned',u.socialEarned.includes(ch));}
      else m.textContent=n?`Shared ${n}x`:'';
    });
    renderSides();
  }
  function setProgress(p,step){[...p.children].forEach((s,i)=>{s.className=i+1<step?'done':(i+1===step?'on':'');});}
  $$('#v-spin .progress').forEach(p=>setProgress(p,2));

  function recordShare(ch){
    const u=cur();u.shares[ch]=(u.shares[ch]||0)+1;
    log('share_initiated',`${u.first} channel=${ch} code=${u.code}`);
    u.feed.push({txt:`Shared via ${CH_LABEL[ch]}`});
  }
  $('#copyTop').onclick=()=>doCopy();
  function doCopy(){
    const u=cur();const l='https://'+linkFor(u);
    try{navigator.clipboard&&navigator.clipboard.writeText(l).catch(()=>{});}catch(e){}
    recordShare('copy');renderShare();
    toast('<b>Link copied.</b> Paste it anywhere. You earn an entry when a friend signs up.');
  }
  $$('.sbtn').forEach(b=>b.onclick=()=>{
    const ch=b.dataset.ch,u=cur();
    if(ch==='copy') return doCopy();
    if(ch==='text'||ch==='email') return personalSheet(ch);
    socialSheet(ch);
  });

  function personalSheet(ch){
    const u=cur();const l='https://'+linkFor(u);
    const msg=`A little sweetness for you! Join me for a chance to win. ${'<a>'+l+'</a>'}`;
    const prev=ch==='text'
      ? `<div class="phone-msg"><div class="bubble">A little sweetness for you! &#127827; Join me for a chance to win: <a>${l}</a></div></div>`
      : `<div class="email-prev" style="margin:16px 0"><div class="h">To: a friend<br>Subject: ${u.first} sent you a little sweetness</div><div class="b">Hi! I just joined Driscoll's Sweetness Worth Sharing and thought of you. Join me for a chance to win a New York trip with the Berry Mobile, plus an instant win berry spin.<br><br><a>${l}</a><br><br>${u.first}</div></div>`;
    openSheet(`<div class="eyebrow">Simulated ${ch==='text'?'text message':'email'}</div><h3>A sweet invitation</h3>${prev}
      <p class="note-sm" style="margin:0">In the live program this opens the device's native ${ch==='text'?'messages':'email'} app with the message prefilled.</p>
      <div class="row"><button class="btn" data-a="send">Send</button></div>
      <div class="row"><button class="btn line" data-a="friend">Send and open as your friend</button></div>`,
      a=>{recordShare(ch);renderShare();closeSheet();
        if(a==='friend') openAsFriend(u,ch); else toast(`<b>Sent.</b> We'll credit you +1 entry when your friend signs up.`);});
  }
  function socialSheet(ch){
    const u=cur();const already=u.socialEarned.includes(ch);
    openSheet(`<div class="eyebrow">Simulated ${CH_LABEL[ch]} share</div><h3>Share on ${CH_LABEL[ch]}</h3>
      <div class="social-prev"><div class="img"></div><div class="cap"><b>@${u.first.toLowerCase()}</b> Sweetness is better shared &#127827;&#129752; Join me for a chance to win with @driscollsberries #SweetnessWorthSharing #Sweepstakes</div></div>
      <p class="note-sm" style="margin:0">${already?'You already earned the social entry for this platform. Proposed limit: one bonus entry per platform.':'Earn one additional sweepstakes entry for this eligible share.'} The demo simulates the share; it does not confirm publication on ${CH_LABEL[ch]}.</p>
      <div class="row"><button class="btn berry" data-a="post">Share to ${CH_LABEL[ch]}</button></div>`,
      ()=>{recordShare(ch);
        if(!already){u.socialEarned.push(ch);log('bonus_entry',`${u.first} social share ${ch} +1`);u.feed.push({plus:true,txt:`Social share on ${CH_LABEL[ch]}: +1 entry`});}
        renderShare();closeSheet();
        toast(already?`<b>Shared again.</b> Thanks for spreading the sweetness!`:`<b>+1 entry!</b> Thanks for sharing on ${CH_LABEL[ch]}.`);});
  }
  function openAsFriend(ref,ch){
    S.visits++;
    log('referral_visit',`code=${ref.code} channel=${ch}`);
    S.current=null;setInvite(ref);renderViewAs();
    $('#viewAs').value='new';
    show('landing');
    setTimeout(()=>{document.getElementById('join').scrollIntoView({behavior:'smooth'});},120);
    toast(`<b>Now viewing as the friend.</b> You opened ${ref.first}'s invitation link.`);
  }

  /* ---------- side panel ---------- */
  function renderSides(){
    const u=cur(); if(!u) return;
    const e=entries(u);
    $('#pillN').textContent=e.total;
    const feed=u.feed.slice().reverse().map(f=>`<div class="it ${f.plus?'plus':''}"><i></i><span>${f.txt}</span></div>`).join('');
    const html=`<div class="entries"><div class="lbl">${u.first}'s sweepstakes entries</div><div class="big">${e.total}</div>
        <div class="ebreak"><div><span>Registration</span><b>${e.base}</b></div><div><span>Social shares</span><b>${e.social}</b></div><div><span>Validated referrals</span><b>${e.refs}</b></div></div></div>
      ${u.prize?`<div class="won"><svg width="26" height="26"><use href="#i-gift"/></svg><span>Instant win: <b>${u.prize}</b></span></div>`:''}
      <div class="mini"><h4>Your referral link</h4><div style="font-size:13px;word-break:break-all;color:var(--green);font-weight:600">${linkFor(u)}</div></div>
      <div class="mini"><h4>Activity</h4><div class="feed">${feed||'<div class="empty">Nothing yet.</div>'}</div></div>`;
    $$('[data-side]').forEach(s=>s.innerHTML=html);
  }

  /* ---------- sheet + toast ---------- */
  let sheetCb=null;
  function openSheet(html,cb){$('#sheet').innerHTML=html+'<div class="row"><button class="btn line sm" data-close style="flex:none;margin:0 auto">Cancel</button></div>';sheetCb=cb;$('#scrim').classList.add('show');}
  function closeSheet(){$('#scrim').classList.remove('show');}
  $('#scrim').onclick=e=>{
    if(e.target.id==='scrim'||e.target.closest('[data-close]')) return closeSheet();
    const a=e.target.closest('[data-a]'); if(a&&sheetCb) sheetCb(a.dataset.a);
  };
  let tt;function toast(h){const t=$('#toast');t.innerHTML=h;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),3800);}

  /* ---------- nav ---------- */
  $$('[data-go="landing"]').forEach(a=>a.addEventListener('click',()=>{if($('#v-landing').classList.contains('hidden'))show('landing');}));

  /* ---------- insights ---------- */
  $$('[data-ds]').forEach(b=>b.onclick=()=>{S.dataset=b.dataset.ds;$$('[data-ds]').forEach(x=>x.classList.toggle('on',x===b));renderInsights();});
  function liveMetrics(){
    const U=S.users;
    const sharers=U.filter(u=>Object.keys(u.shares).length).length;
    const actions=U.reduce((a,u)=>a+Object.values(u.shares).reduce((x,y)=>x+y,0),0);
    const validated=U.filter(u=>u.referredBy).length;
    const referredSharing=U.filter(u=>u.referredBy&&Object.keys(u.shares).length).length;
    const ch={};Object.keys(CH_LABEL).forEach(c=>ch[c]=U.reduce((a,u)=>a+(u.shares[c]||0),0));
    return {reg:U.length,sharers,actions,visits:S.visits,validated,referredSharing,ch,blocked:S.blocked,optin:U.filter(u=>u.optin).length};
  }
  function sampleMetrics(){
    return {reg:2400,sharers:1010,actions:1680,visits:1150,validated:410,referredSharing:118,
      ch:{text:520,email:210,copy:300,instagram:290,tiktok:150,x:60,facebook:150},blocked:{dup:37,self:12,zip:9},optin:1380};
  }
  const pct=(a,b)=>b?Math.round(a/b*100)+'%':'0%';
  function renderInsights(){
    const m=S.dataset==='sample'?sampleMetrics():liveMetrics();
    $('#dataLabel').textContent=S.dataset==='sample'?'Illustrative pilot numbers to show the reporting format. Not a forecast or a target.':'Live data from this demo session. Register, share and refer in the consumer site to see it update.';
    $('#k1').textContent=pct(m.sharers,m.reg);
    $('#k2').textContent=pct(m.validated,m.visits);
    $('#k3').textContent=pct(m.referredSharing,m.validated);
    const rows=[['Registrations',m.reg],['Participants initiating sharing',m.sharers],['Observable share or link actions',m.actions],['Referral visits',m.visits],['Validated referral registrations',m.validated],['Referred participants sharing again',m.referredSharing]];
    const max=Math.max(1,...rows.map(r=>r[1]));
    $('#funnel').innerHTML=rows.map(r=>`<div class="frow"><span>${r[0]}</span><div class="bar"><i style="width:${r[1]/max*100}%"></i></div><span class="n">${r[1].toLocaleString()}</span></div>`).join('');
    const totalCh=Object.values(m.ch).reduce((a,b)=>a+b,0);
    $('#chans').innerHTML='<div class="chan" style="color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.08em"><span>Personal</span><span></span></div>'+
      ['text','email','copy'].map(c=>`<div class="chan"><span>${CH_LABEL[c]}</span><b>${m.ch[c].toLocaleString()} <span style="color:var(--muted);font-weight:400">(${pct(m.ch[c],totalCh)})</span></b></div>`).join('')+
      '<div class="chan" style="color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.08em;margin-top:6px"><span>Social</span><span></span></div>'+
      SOCIAL.map(c=>`<div class="chan"><span>${CH_LABEL[c]}</span><b>${m.ch[c].toLocaleString()} <span style="color:var(--muted);font-weight:400">(${pct(m.ch[c],totalCh)})</span></b></div>`).join('')+
      `<p class="caveat">Copy link and platform share initiations are reported separately. Neither confirms delivery or publication. Marketing opt ins: <b>${m.optin.toLocaleString()}</b>.</p>`;
    $('#ctrls').innerHTML=[
      ['Unique referral code per participant','Active'],
      ['Duplicate email registrations blocked',m.blocked.dup],
      ['Self referrals blocked',m.blocked.self],
      ['Invalid ZIP or ineligible entries rejected',m.blocked.zip],
      ['Bonus entry caps (social 4, referral 10, proposed)','Active'],
      ['Velocity and device monitoring','Planned']
    ].map(c=>`<div class="ctrl"><span>${c[0]}</span><span class="ok">${c[1]}</span></div>`).join('')+
      (S.dataset==='live'?'<p class="caveat">Try it: open a friend invite and register with the sender\'s email, or reuse an email.</p>':'');
    const ev=S.dataset==='sample'?[{t:'09:14:02',type:'registration',detail:'Dana K. code=DANA-8K2Q'},{t:'09:15:40',type:'share_initiated',detail:'Dana channel=text code=DANA-8K2Q'},{t:'11:02:13',type:'referral_visit',detail:'code=DANA-8K2Q channel=text'},{t:'11:04:51',type:'registration',detail:'Sam P. code=SAM-3HTW ref=DANA-8K2Q'},{t:'11:04:51',type:'referral_validated',detail:'credited to Dana (DANA-8K2Q) +1 entry'}]:S.events;
    $('#log').innerHTML=ev.length?ev.slice().reverse().map(e=>`<div><span class="t">${e.t}</span> <span class="e">${e.type}</span> ${e.detail}</div>`).join(''):'<div class="t">No events yet. Register on the consumer site to start the trail.</div>';
  }

  /* ---------- outcome control + reset ---------- */
  const oc=document.createElement('select');oc.id='outcome';oc.title='Berry spin outcome (demo control)';
  oc.innerHTML='<option value="win">Spin: win</option><option value="lose">Spin: no prize</option><option value="random">Spin: random</option>';
  oc.onchange=()=>S.outcome=oc.value;
  $('#resetBtn').before(oc);
  $('#resetBtn').onclick=()=>{endTour();const o=S.outcome;S=fresh();S.outcome=o;setInvite(null);renderViewAs();mode('consumer');show('landing');$$('[data-ds]').forEach(x=>x.classList.toggle('on',x.dataset.ds==='live'));toast('<b>Demo reset.</b> Start fresh as a new visitor.');};

  $('#fState').insertAdjacentHTML('beforeend',STATES.map(s=>`<option value="${s[0]}">${s[1]}</option>`).join(''));
  /* ---------- Guided tour ----------
     Spotlight plus arrow callouts. Each step's "go" function puts the demo into the
     right state (idempotent), so Back and Next both work. Starting a tour resets the demo. */
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const T={on:false,i:0,steps:[],busy:false,hintShown:false};
  const sponsor=()=>S.users.find(u=>!u.referredBy);
  const friend=()=>{const j=sponsor();return j?S.users.find(u=>u.referredBy===j.id):null;};
  function fillForm(){
    const used=S.users.map(u=>u.email);
    const p=DEMO_PEOPLE.find(p=>!used.includes(p.email));
    if(p&&!$('#fEmail').value) $('#autofill').click();
  }
  function submitForm(){ $('#regForm').dispatchEvent(new Event('submit',{cancelable:true})); }
  async function goLanding(){ mode('consumer'); S.current=null; setInvite(null); renderViewAs(); show('landing'); }
  async function goForm(){ await goLanding(); if(!sponsor()) fillForm(); }
  async function goRegistered(){
    if(!sponsor()){ await goForm(); fillForm(); submitForm(); await wait(60); }
    const j=sponsor(); mode('consumer'); S.current=j.id; renderViewAs();
    if(!j.spun) buildReels();
    show('spin'); $('#spinName').textContent=j.first;
  }
  async function goSpun(){
    await goRegistered(); const j=sponsor();
    if(!j.spun){ $('#spinBtn').click(); await wait(3150); }
  }
  async function goShare(){ await goSpun(); S.current=sponsor().id; renderViewAs(); renderShare(); show('share'); }
  async function goInvite(){
    await goSpun(); const j=sponsor();
    if(!T.visited){
      S.current=j.id; recordShare('text'); T.visited=true;
      S.visits++; log('referral_visit',`code=${j.code} channel=text`);
    }
    mode('consumer'); S.current=null; setInvite(j); renderViewAs(); show('landing');
    if(!friend()) fillForm();
  }
  async function goCredited(){
    if(!friend()){ await goInvite(); fillForm(); submitForm(); await wait(700); }
    const j=sponsor(); mode('consumer'); S.current=j.id; renderViewAs(); renderShare(); show('share');
  }
  async function goInsights(){ await goCredited(); S.dataset='live'; $$('[data-ds]').forEach(x=>x.classList.toggle('on',x.dataset.ds==='live')); mode('insights'); }

  const STEPS=[
    {t:'#top .wrap > div',go:goLanding,h:'Welcome to Sweetness Worth Sharing',p:"A concept for testing whether Driscoll's existing fans will bring new consumers into the brand. This tour walks through the full experience in about two minutes.",all:1},
    {t:'#how .steps',go:goLanding,h:'Three simple steps',p:'Sign up, share, get rewarded. The promotion generates participation, and the referral behavior generates the insight.',all:1},
    {t:'#prizes .prize-grid',go:goLanding,h:'Prizes worth talking about',p:'A Berry Mobile trip in New York as the grand prize, plus gift cards, merch credit and instant win items. The prize mix is illustrative and subject to approval.'},
    {t:'#earn .earn-list',go:goLanding,h:'What motivates sharing',p:'Registration earns an entry and a berry spin. Eligible social shares and validated friend registrations each earn one more entry. These incentives are proposed.'},
    {t:'#regForm .fields',go:goForm,h:'Quick, compliant sign up',p:'Name, email and mailing address for prize fulfillment. The Official Rules box is required, and marketing opt in is a separate, optional choice. We filled it in for you.',all:1},
    {t:'#v-spin .machine',go:goRegistered,h:'Instant win, right away',p:"Every registrant gets one berry spin immediately after signing up. Sharing never unlocks the game. Click Next to spin.",all:1},
    {t:'#spinResult',go:goSpun,h:'The instant result',p:'Winners see their prize and how it will be verified and shipped. Everyone else is reminded that their grand prize entry is locked in.',all:1},
    {t:'#v-share .linkbox',go:goShare,h:'A unique referral link',p:'Each participant gets their own link, so every friend registration can be attributed back to the person who shared it.',all:1},
    {t:'#v-share .share-cols',go:goShare,h:'Personal or social sharing',p:'One to one sharing by text, email or copied link, compared with one to many sharing on social. A share action is tracked, but it is not a referral until a friend signs up.',all:1},
    {t:'#v-share .side .entries',go:goShare,h:'Entries at a glance',p:'Participants always see how many entries they have and where each one came from.'},
    {t:'#inviteBanner',go:goInvite,h:'The friend receives a sweet invitation',p:"Now we are the friend who opened Jamie's text. The invitation banner shows who invited them, and the same sign up form follows.",all:1},
    {t:'#v-share .side .entries',go:goCredited,h:'Referral validated',p:"The friend completed an eligible registration, so Jamie was credited one extra entry. The friend now gets their own spin and link, which is where repeat advocacy starts.",all:1},
    {t:'#insights .kpis',go:goInsights,h:'Program insights for Driscoll’s',p:'The reporting view tracks share participation, referral visit to registration conversion and repeat sharing, using live data from this session.'},
    {t:'#funnel',go:goInsights,h:'The referral funnel',p:'Each observable step from registration to validated referral. Copying a link never counts as proof of delivery.'},
    {t:'#ctrls',go:goInsights,h:'Built in fraud controls',p:'Unique codes, duplicate and self referral blocking, ZIP checks and entry caps keep the results clean.'},
    {t:'#insights .roadmap',go:goInsights,h:'Learn now, build from what works',p:"This pilot is the starting point. What we learn can shape shopper activation, CRM programs and long term advocacy. That is the tour; feel free to explore on your own.",last:1}
  ];

  const blocker=document.createElement('div');blocker.className='tour-blocker hidden';
  const spot=document.createElement('div');spot.className='tour-spot hidden';
  const pop=document.createElement('div');pop.className='tour-pop hidden';pop.setAttribute('role','dialog');pop.setAttribute('aria-live','polite');
  document.body.append(blocker,spot,pop);

  function rectOf(el){
    const r=el.getBoundingClientRect(),pad=8,top=Math.max(r.top-pad,64),bot=Math.min(r.bottom+pad,innerHeight-8);
    return {left:Math.max(r.left-pad,6),top,width:Math.min(r.width+pad*2,innerWidth-12),height:Math.max(bot-top,40),cx:r.left+r.width/2};
  }
  function scrollToTarget(el){
    const r=el.getBoundingClientRect(),bar=64,room=innerHeight-bar,ph=pop.offsetHeight+40;
    const y=r.height+ph<=room ? scrollY+r.top-bar-Math.max(16,(room-r.height-ph)/2) : scrollY+r.top-bar-16;
    window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
  }
  function place(){
    if(!T.on) return;
    const st=T.steps[T.i],el=$(st.t); if(!el) return;
    const R=rectOf(el);
    Object.assign(spot.style,{left:R.left+'px',top:R.top+'px',width:R.width+'px',height:R.height+'px'});
    pop.style.width='';
    let pw=pop.offsetWidth,ph=pop.offsetHeight;const gap=16,arr=pop.querySelector('.arr');
    let top,left,dir;
    const sideRoom=innerWidth-(R.left+R.width)-gap-16;
    if(innerHeight-(R.top+R.height)>=ph+gap+8){top=R.top+R.height+gap;dir='up';}
    else if(R.top-64>=ph+gap){top=R.top-ph-gap;dir='down';}
    else if(sideRoom>=250){
      pop.style.width=Math.min(370,sideRoom)+'px'; pw=pop.offsetWidth; ph=pop.offsetHeight;
      left=R.left+R.width+gap; top=Math.min(Math.max(R.top+R.height/2-ph/2,72),innerHeight-ph-16); dir='left';
    }
    else{top=innerHeight-ph-16;dir='none';}
    if(left===undefined) left=dir==='none'&&innerWidth>900?innerWidth-pw-24:Math.min(Math.max(R.cx-pw/2,16),innerWidth-pw-16);
    Object.assign(pop.style,{top:top+'px',left:left+'px'});
    arr.className='arr '+dir;
    if(dir==='left'){arr.style.left='-8px';arr.style.top=Math.min(Math.max(R.top+R.height/2-top-9,22),ph-40)+'px';}
    else{arr.style.top='';arr.style.left=Math.min(Math.max(R.cx-left-9,22),pw-40)+'px';}
  }
  async function render(){
    T.busy=true; pop.classList.add('wait');
    const st=T.steps[T.i];
    try{ await st.go(); }catch(e){ console.warn('tour step',e); }
    await wait(80);
    const n=T.steps.length,last=T.i===n-1;
    pop.innerHTML=`<span class="arr"></span>
      <div class="meta"><span class="count">${T.label} &middot; ${T.i+1} of ${n}</span><button class="x" data-t="end" aria-label="End tour">&times;</button></div>
      <h3>${st.h}</h3><p>${st.p}</p>
      <div class="bar"><i style="width:${(T.i+1)/n*100}%"></i></div>
      <div class="nav"><button class="btn line" data-t="back" ${T.i?'':'disabled'}>Back</button><span class="hint">Use arrow keys or Esc</span><button class="btn ${last?'berry':''}" data-t="next">${last?'Finish':'Next'}</button></div>`;
    const el=$(st.t); if(el) scrollToTarget(el);
    await wait(450);
    place(); pop.classList.remove('wait'); T.busy=false;
    pop.querySelector('[data-t="next"]').focus({preventScroll:true});
  }
  function startTour(kind){
    closeTourStart(); hideHint();
    const o=S.outcome; S=fresh(); S.outcome='win'; $('#outcome').value='win'; T.visited=false;
    $('#regForm').reset(); setInvite(null); renderViewAs();
    T.steps=kind==='full'?STEPS:STEPS.filter(s=>s.all);
    T.label=kind==='full'?'Pitch tour':'Consumer tour';
    T.i=0; T.on=true;
    $('.demobar').classList.remove('open');
    [blocker,spot,pop].forEach(e=>e.classList.remove('hidden'));
    document.body.classList.add('touring');
    render();
  }
  function endTour(){
    if(!T.on) return; T.on=false;
    [blocker,spot,pop].forEach(e=>e.classList.add('hidden'));
    document.body.classList.remove('touring');
  }
  function step(d){
    if(!T.on||T.busy) return;
    if(T.i+d>=T.steps.length){ endTour(); toast('<b>Tour complete.</b> The demo is yours to explore. Use Reset demo to start over.'); return; }
    if(T.i+d<0) return;
    T.i+=d; render();
  }
  pop.addEventListener('click',e=>{const b=e.target.closest('[data-t]'); if(!b) return;
    if(b.dataset.t==='next') step(1); else if(b.dataset.t==='back') step(-1); else endTour();});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&ts.classList.contains('show')) return closeTourStart();
    if(!T.on) return;
    if(e.key==='Escape') endTour(); else if(e.key==='ArrowRight') step(1); else if(e.key==='ArrowLeft') step(-1);
  });
  addEventListener('resize',place); addEventListener('scroll',place,{passive:true});

  /* start dialog */
  const ts=document.createElement('div');ts.className='scrim tour-start';ts.id='tourStart';
  ts.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="tsTitle">
    <div class="eyebrow">Guided tour</div><h3 id="tsTitle">Take the tour</h3>
    <p class="note-sm" style="margin:6px 0 0">We will click through the demo for you, with pointers explaining each part. Starting a tour resets the demo.</p>
    <div class="tour-choice">
      <button data-k="consumer"><span class="ic" style="background:var(--pink)"><svg width="22" height="22"><use href="#i-user"/></svg></span><span><b>Consumer journey</b><span>About 1 minute. Sign up, berry spin, sharing and a friend's referral.</span></span></button>
      <button data-k="full"><span class="ic" style="background:var(--leaf)"><svg width="22" height="22"><use href="#i-share"/></svg></span><span><b>Full pitch tour</b><span>About 2 minutes. Adds prizes, incentives and the Program insights reporting view.</span></span></button>
    </div>
    <div class="row" style="margin-top:12px"><button class="btn line sm" data-k="close" style="flex:none;margin:0 auto">Not now</button></div>
  </div>`;
  document.body.append(ts);
  function openTourStart(){ endTour(); ts.classList.add('show'); }
  function closeTourStart(){ ts.classList.remove('show'); }
  ts.addEventListener('click',e=>{
    if(e.target===ts) return closeTourStart();
    const b=e.target.closest('[data-k]'); if(!b) return;
    b.dataset.k==='close'?closeTourStart():startTour(b.dataset.k);
  });
  $('#tourBtn').onclick=()=>{hideHint();openTourStart();};

  /* first visit hint */
  const hint=document.createElement('div');hint.className='tour-hint hidden';hint.setAttribute('role','status');
  hint.innerHTML=`<div class="ic"><svg width="20" height="20"><use href="#i-heart"/></svg></div><div><b>New to this demo?</b><p>Take a quick guided tour of the referral experience.</p><div class="row"><button class="btn sm" data-h="go">Take the tour</button><button class="btn line sm" data-h="no">No thanks</button></div></div>`;
  document.body.append(hint);
  function hideHint(){ hint.classList.add('hidden'); }
  hint.addEventListener('click',e=>{const b=e.target.closest('[data-h]'); if(!b) return; hideHint(); if(b.dataset.h==='go') openTourStart();});
  setTimeout(()=>{ if(!T.on&&!T.hintShown&&!S.users.length&&!ts.classList.contains('show')){T.hintShown=true;hint.classList.remove('hidden');} },1500);

  const dt=$('#demoToggle');
  dt.onclick=()=>{const o=$('.demobar').classList.toggle('open');dt.setAttribute('aria-expanded',o);dt.textContent=o?'Hide controls':'Demo controls';};
  renderViewAs();show('landing');
})();
