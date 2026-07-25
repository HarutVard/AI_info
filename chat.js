(function(){
  var body = document.getElementById('terminal-body');
  var input = document.getElementById('terminal-text');
  var sendBtn = document.getElementById('terminal-send');
  var statusEl = document.getElementById('terminal-status-text');
  if(!body || !input || !sendBtn) return;

  // Puter.js provides free, keyless access to Claude directly from the browser.
  // Each visitor's usage is covered through their own free Puter account
  // (the "User-Pays" model) — no backend, no API key needed from us.
  var SYSTEM_PROMPT = 'Դու օգնական ես ուսումնական կայքի համար՝ ԱԲ հոսքի 10-12-րդ ' +
    'դասարանների աշակերտների համար։ Պատասխանիր հայերեն, հստակ և հակիրճ։';

  var history = [{ role: 'system', content: SYSTEM_PROMPT }];

  function addMessage(text, cls){
    var div = document.createElement('div');
    div.className = 'msg ' + cls;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function setBusy(busy){
    sendBtn.disabled = busy;
    input.disabled = busy;
    sendBtn.textContent = busy ? '...' : 'Ուղարկել';
  }

  function puterReady(){
    return typeof window.puter !== 'undefined' && window.puter.ai;
  }

  if(statusEl){
    statusEl.textContent = puterReady() ? 'Պատրաստ է' : 'Բեռնվում է...';
    window.addEventListener('load', function(){
      if(statusEl) statusEl.textContent = puterReady() ? 'Պատրաստ է' : 'Անհասանելի է';
    });
  }

  async function sendMessage(){
    var text = input.value.trim();
    if(!text) return;
    addMessage(text, 'user');
    history.push({ role:'user', content:text });
    input.value = '';
    setBusy(true);

    var thinking = addMessage('...', 'ai');

    try{
      if(!puterReady()) throw new Error('puter-not-loaded');

      var response = await window.puter.ai.chat(history, {
        model: 'claude-sonnet-4-6'
      });

      var reply = (typeof response === 'string')
        ? response
        : (response && response.message && response.message.content) || 'Ներողություն, պատասխան չկա։';

      if(Array.isArray(reply)){
        reply = reply.map(function(p){ return p.text || ''; }).join('');
      }

      thinking.textContent = reply;
      history.push({ role:'assistant', content:reply });

    }catch(err){
      thinking.remove();
      addMessage(
        'Չհաջողվեց ստանալ պատասխան։ Ստուգիր ինտերնետ կապը, կամ մի փոքր սպասիր և կրկին փորձիր։',
        'note'
      );
    }finally{
      setBusy(false);
      input.focus();
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter') sendMessage();
  });
})();
