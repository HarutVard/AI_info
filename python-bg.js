(function(){
  var canvas = document.getElementById('stars-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H;
  var chars = ['0','1','def','if','for','in','()','[]','{}',':','import','True','False','+','-','x','n','i'];
  var colors = ['rgba(75,139,190,0.5)', 'rgba(255,212,59,0.45)'];
  var columns, drops;
  var fontSize = 16;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    columns = Math.floor(W / (fontSize*2.4));
    drops = [];
    for(var i=0;i<columns;i++) drops.push(Math.random()*-H/fontSize);
  }
  window.addEventListener('resize', resize);
  resize();

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function frame(){
    ctx.fillStyle = 'rgba(8,12,26,0.16)';
    ctx.fillRect(0,0,W,H);

    if(!reduceMotion){
      ctx.font = fontSize + 'px "JetBrains Mono", monospace';
      for(var i=0;i<columns;i++){
        var text = chars[Math.floor(Math.random()*chars.length)];
        var x = i * fontSize * 2.4;
        var y = drops[i]*fontSize;
        ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];
        ctx.fillText(text, x, y);
        if(y > H && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.35;
      }
    } else {
      ctx.fillStyle = '#0a0f22';
      ctx.fillRect(0,0,W,H);
    }
    requestAnimationFrame(frame);
  }

  // opaque base first so the trail effect doesn't show a transparent canvas
  ctx.fillStyle = '#0a0f22';
  ctx.fillRect(0,0,W,H);
  requestAnimationFrame(frame);
})();
