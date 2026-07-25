(function(){
  var canvas = document.getElementById('stars-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H;
  var symbols = ['∑','π','√','∞','Δ','∫','α','β','θ','÷','×','=','x²','ƒ(x)'];
  var particles = [];

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  var count = Math.floor((W*H)/32000);
  for(var i=0;i<count;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      s: symbols[Math.floor(Math.random()*symbols.length)],
      size: Math.random()*16 + 14,
      speed: Math.random()*0.25 + 0.08,
      drift: (Math.random()-0.5)*0.3,
      alpha: Math.random()*0.16 + 0.06
    });
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawGrid(){
    var step = 64;
    ctx.strokeStyle = 'rgba(255,200,97,0.05)';
    ctx.lineWidth = 1;
    for(var x=0;x<W;x+=step){
      ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
    }
    for(var y=0;y<H;y+=step){
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
    }
  }

  function bgFill(){
    var grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0, '#0b0e22');
    grad.addColorStop(1, '#141a3a');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,W,H);
  }

  function frame(){
    bgFill();
    drawGrid();

    for(var i=0;i<particles.length;i++){
      var p = particles[i];
      ctx.font = p.size + 'px "Space Grotesk", sans-serif';
      ctx.fillStyle = 'rgba(255,200,97,' + p.alpha + ')';
      ctx.fillText(p.s, p.x, p.y);
      if(!reduceMotion){
        p.y -= p.speed;
        p.x += p.drift;
        if(p.y < -20){ p.y = H + 20; p.x = Math.random()*W; }
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
