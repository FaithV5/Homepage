// particles.js — lightweight canvas particle background
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function createCanvas(){
    const c = document.createElement('canvas');
    c.id = 'particle-canvas';
    c.style.position = 'fixed';
    c.style.top = '0';
    c.style.left = '0';
    c.style.width = '100%';
    c.style.height = '100%';
    c.style.pointerEvents = 'none';
    c.style.zIndex = '-1';
    document.body.appendChild(c);
    return c;
  }

  function Particle(x,y,r,vx,vy,color){
    this.x = x; this.y = y; this.r = r; this.vx = vx; this.vy = vy; this.color = color;
  }

  Particle.prototype.update = function(w,h){
    this.x += this.vx; this.y += this.vy;
    // wrap
    if(this.x < -50) this.x = w + 50;
    if(this.x > w + 50) this.x = -50;
    if(this.y < -50) this.y = h + 50;
    if(this.y > h + 50) this.y = -50;
  };

  Particle.prototype.draw = function(ctx){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fill();
  };

  function init(){
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    // particle count scales with area but limits for performance
    const area = w * h;
    let count = Math.max(20, Math.min(120, Math.floor(area / 9000)));

    const particles = [];
    // colors use CSS variables if available
    const style = getComputedStyle(document.documentElement);
    const brand = style.getPropertyValue('--brand') || '#00A9CE';
    const primary = style.getPropertyValue('--primary') || '#007B9A';

    function rgba(hex, a){
      hex = hex.trim();
      if(hex.charAt(0) === '#') hex = hex.slice(1);
      if(hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
      const r = parseInt(hex.substr(0,2),16);
      const g = parseInt(hex.substr(2,2),16);
      const b = parseInt(hex.substr(4,2),16);
      return `rgba(${r},${g},${b},${a})`;
    }

    for(let i=0;i<count;i++){
      const x = Math.random()*w;
      const y = Math.random()*h;
      const r = 8 + Math.random()*22; // radius
      const vx = (Math.random()-0.5) * 0.35; // slow
      const vy = (Math.random()-0.5) * 0.35;
      const col = (i%2===0) ? rgba(brand, 0.12) : rgba(primary, 0.09);
      particles.push(new Particle(x,y,r,vx,vy,col));
    }

    let rafId;
    function loop(){
      ctx.clearRect(0,0,w,h);
      // subtle glow by drawing blurred circles on top
      particles.forEach(p=>{ p.update(w,h); p.draw(ctx); });
      rafId = requestAnimationFrame(loop);
    }

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      // adjust particle count lightly on resize
      const newCount = Math.max(20, Math.min(160, Math.floor((w*h)/9000)));
      while(particles.length < newCount){
        const x = Math.random()*w; const y = Math.random()*h;
        const r = 6 + Math.random()*18; const vx=(Math.random()-0.5)*0.35; const vy=(Math.random()-0.5)*0.35;
        const col = rgba(primary, 0.08);
        particles.push(new Particle(x,y,r,vx,vy,col));
      }
      // if too many, slice
      if(particles.length > newCount) particles.splice(newCount);
    }

    if(!prefersReduced){ loop(); }

    window.addEventListener('resize', resize);
    // stop animation when page hidden
    document.addEventListener('visibilitychange', function(){
      if(document.hidden){ cancelAnimationFrame(rafId); } else { if(!prefersReduced) rafId = requestAnimationFrame(loop); }
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
