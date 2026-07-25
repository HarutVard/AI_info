(function(){
  var canvas = document.getElementById('stars-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H;

  var fireflies = [];
  var leaves = [];
  var birds = [];

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildMountains();
  }
  window.addEventListener('resize', resize);

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- mountains (static layered silhouettes) ----------
  var mountainLayers = [];
  function buildMountains(){
    mountainLayers = [
      { color: 'rgba(8,28,20,0.9)',  base: 0.62, amp: 0.10, seed: 11 },
      { color: 'rgba(6,22,16,0.95)', base: 0.74, amp: 0.08, seed: 47 },
      { color: 'rgba(4,16,11,1)',    base: 0.86, amp: 0.06, seed: 91 }
    ];
    for(var i=0;i<mountainLayers.length;i++){
      var layer = mountainLayers[i];
      var pts = [];
      var segs = 8;
      var rnd = mulberry32(layer.seed);
      for(var s=0;s<=segs;s++){
        var x = (W/segs)*s;
        var y = H*layer.base - rnd()*H*layer.amp;
        pts.push({x:x, y:y});
      }
      layer.pts = pts;
    }
  }
  function mulberry32(a){
    return function(){
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function drawMountains(){
    for(var i=0;i<mountainLayers.length;i++){
      var layer = mountainLayers[i];
      ctx.beginPath();
      ctx.moveTo(0, H);
      for(var p=0;p<layer.pts.length;p++){
        ctx.lineTo(layer.pts[p].x, layer.pts[p].y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = layer.color;
      ctx.fill();
    }
  }

  // ---------- fireflies ----------
  function initFireflies(){
    fireflies = [];
    var count = Math.floor((W*H)/22000);
    for(var i=0;i<count;i++){
      fireflies.push({
        x: Math.random()*W,
        y: H*0.35 + Math.random()*H*0.6,
        r: Math.random()*1.4 + 0.8,
        phase: Math.random()*Math.PI*2,
        speed: Math.random()*0.015 + 0.006,
        driftX: Math.random()*0.4 - 0.2,
        driftY: Math.random()*0.3 - 0.15
      });
    }
  }
  function drawFireflies(t){
    for(var i=0;i<fireflies.length;i++){
      var f = fireflies[i];
      var glow = reduceMotion ? 0.6 : (0.4 + Math.sin(t*f.speed + f.phase)*0.4);
      glow = Math.max(0, Math.min(1, glow));
      if(!reduceMotion){
        f.x += f.driftX*0.05 + Math.sin(t*0.0006 + f.phase)*0.15;
        f.y += f.driftY*0.05;
        if(f.x < -5) f.x = W+5;
        if(f.x > W+5) f.x = -5;
        if(f.y < H*0.3) f.y = H*0.3;
        if(f.y > H) f.y = H*0.3;
      }
      var grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r*5);
      grad.addColorStop(0, 'rgba(255,214,120,' + (0.55*glow) + ')');
      grad.addColorStop(1, 'rgba(255,214,120,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r*5, 0, Math.PI*2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,236,190,' + (0.7*glow + 0.2) + ')';
      ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // ---------- falling leaves ----------
  function spawnLeaf(){
    return {
      x: Math.random()*W,
      y: -10 - Math.random()*100,
      size: Math.random()*7 + 5,
      rot: Math.random()*Math.PI*2,
      rotSpeed: (Math.random()-0.5)*0.02,
      vy: Math.random()*0.35 + 0.25,
      sway: Math.random()*0.8 + 0.4,
      swayPhase: Math.random()*Math.PI*2,
      hue: Math.random() < 0.5 ? '99,245,214' : '255,200,97'
    };
  }
  function initLeaves(){
    leaves = [];
    var count = Math.floor(W/140);
    for(var i=0;i<count;i++){
      var l = spawnLeaf();
      l.y = Math.random()*H;
      leaves.push(l);
    }
  }
  function drawLeaves(t){
    for(var i=0;i<leaves.length;i++){
      var l = leaves[i];
      if(!reduceMotion){
        l.y += l.vy;
        l.x += Math.sin(t*0.001 + l.swayPhase)*l.sway*0.06;
        l.rot += l.rotSpeed;
        if(l.y > H+20){
          leaves[i] = spawnLeaf();
          continue;
        }
      }
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rot);
      ctx.fillStyle = 'rgba(' + l.hue + ',0.55)';
      ctx.beginPath();
      ctx.ellipse(0, 0, l.size*0.5, l.size, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ---------- distant birds ----------
  function maybeSpawnBird(){
    if(Math.random() < 0.0025 && birds.length < 3){
      var fromLeft = Math.random() < 0.5;
      birds.push({
        x: fromLeft ? -30 : W+30,
        y: H*0.12 + Math.random()*H*0.18,
        vx: (fromLeft ? 1 : -1) * (0.8 + Math.random()*0.6),
        wing: 0,
        size: Math.random()*4 + 6
      });
    }
  }
  function drawBirds(t){
    for(var i=birds.length-1;i>=0;i--){
      var b = birds[i];
      if(!reduceMotion){
        b.x += b.vx;
        b.wing += 0.15;
      }
      if(b.x < -40 || b.x > W+40){ birds.splice(i,1); continue; }
      var flap = Math.sin(b.wing)*b.size*0.6;
      ctx.strokeStyle = 'rgba(230,238,225,0.55)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(b.x - b.size, b.y - flap);
      ctx.quadraticCurveTo(b.x, b.y + flap*0.5, b.x, b.y);
      ctx.quadraticCurveTo(b.x, b.y + flap*0.5, b.x + b.size, b.y - flap);
      ctx.stroke();
    }
  }

  function frame(t){
    ctx.clearRect(0,0,W,H);
    drawMountains();
    drawFireflies(t);
    drawLeaves(t);
    if(!reduceMotion){
      maybeSpawnBird();
    }
    drawBirds(t);
    requestAnimationFrame(frame);
  }

  resize();
  initFireflies();
  initLeaves();
  requestAnimationFrame(frame);
})();
