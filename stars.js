(function(){
  var canvas = document.getElementById('stars-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var stars = [];
  var shooting = [];
  var W, H;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  var count = Math.floor((W*H)/9000);
  for(var i=0;i<count;i++){
    stars.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*1.3 + 0.3,
      base: Math.random()*0.5 + 0.3,
      speed: Math.random()*0.02 + 0.005,
      phase: Math.random()*Math.PI*2
    });
  }

  function maybeSpawnShootingStar(){
    if(Math.random() < 0.004 && shooting.length < 2){
      var startX = Math.random()*W*0.6 + W*0.2;
      shooting.push({
        x: startX, y: -10,
        vx: 4 + Math.random()*2,
        vy: 2.4 + Math.random()*1.2,
        life: 0, maxLife: 60 + Math.random()*20
      });
    }
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function frame(t){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<stars.length;i++){
      var s = stars[i];
      var tw = reduceMotion ? s.base : (s.base + Math.sin(t*s.speed + s.phase)*0.35);
      ctx.beginPath();
      ctx.fillStyle = 'rgba(240,241,255,' + Math.max(0,Math.min(1,tw)) + ')';
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }

    if(!reduceMotion){
      maybeSpawnShootingStar();
      for(var j=shooting.length-1;j>=0;j--){
        var sh = shooting[j];
        sh.x += sh.vx; sh.y += sh.vy; sh.life++;
        var alpha = 1 - (sh.life/sh.maxLife);
        if(alpha <= 0 || sh.x > W || sh.y > H){ shooting.splice(j,1); continue; }
        var grad = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx*8, sh.y - sh.vy*8);
        grad.addColorStop(0, 'rgba(255,255,255,' + alpha + ')');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx*8, sh.y - sh.vy*8);
        ctx.stroke();
      }
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
