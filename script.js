document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Dynamic SVG Ring Animation
  const ring = document.querySelector('.photo-ring');
  if (ring) {
    let currentRotation = 0;
    
    function animateRing() {
      const rotationDelta = (Math.random() - 0.5) * 360; 
      currentRotation += rotationDelta;
      
      const duration = 1.5 + Math.random() * 3;
      
      const eases = [
        'ease-in-out',
        'cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
        'cubic-bezier(0.25, 1, 0.5, 1)',          
        'linear'
      ];
      const ease = eases[Math.floor(Math.random() * eases.length)];
      
      ring.style.transition = `transform ${duration}s ${ease}`;
      ring.style.transform = `rotate(${currentRotation}deg) scale(${0.95 + Math.random() * 0.1})`;
      
      setTimeout(animateRing, (duration * 1000) + 100);
    }
    
    setTimeout(animateRing, 500);
  }

  // 2. Local Audio Player Logic
  const audio = document.getElementById('local-audio');
  const playBtn = document.getElementById('local-play-btn');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');

  if (audio && playBtn) {
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
      } else {
        audio.pause();
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
      }
    });

    // Reset when audio ends
    audio.addEventListener('ended', () => {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    });
  }

  // 3. Dynamic Tech Wire Animation
  function initTechWire() {
    const container = document.getElementById('chip-container');
    const svg = document.getElementById('dynamic-wire-svg');
    if (!container || !svg) return;
    
    const chips = Array.from(container.querySelectorAll('.code-chip'));
    let animationReq;

    function drawAndAnimate() {
      if (animationReq) cancelAnimationFrame(animationReq);
      svg.innerHTML = ''; 
      
      const rect = container.getBoundingClientRect();
      let pathD = "";
      const points = [];
      
      chips.forEach((chip, i) => {
        const chipRect = chip.getBoundingClientRect();
        // Calculate center relative to SVG which is inset:0 inside container
        const x = chipRect.left - rect.left + chipRect.width / 2;
        const y = chipRect.top - rect.top + chipRect.height / 2;
        points.push({x, y, chip});
        if (i === 0) pathD += `M ${x} ${y} `;
        else pathD += `L ${x} ${y} `;
      });

      if (points.length === 0) return;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathD);
      path.setAttribute("stroke", "var(--chihiro-blue)");
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-dasharray", "5 5");
      svg.appendChild(path);

      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("r", "5");
      dot.setAttribute("fill", "var(--chihiro-blue)");
      dot.setAttribute("filter", "drop-shadow(0 0 6px var(--chihiro-blue))");
      svg.appendChild(dot);

      const totalLength = path.getTotalLength();
      if(totalLength === 0) return;
      const duration = 5000; 
      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        let progress = ((timestamp - start) % duration) / duration;
        
        const pointAt = path.getPointAtLength(progress * totalLength);
        dot.setAttribute("cx", pointAt.x);
        dot.setAttribute("cy", pointAt.y);

        chips.forEach(c => c.classList.remove('chip-active'));
        
        points.forEach(p => {
          const dx = p.x - pointAt.x;
          const dy = p.y - pointAt.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 20) { 
            p.chip.classList.add('chip-active');
          }
        });

        animationReq = requestAnimationFrame(step);
      }
      animationReq = requestAnimationFrame(step);
    }

    setTimeout(drawAndAnimate, 100);
    window.addEventListener('resize', () => {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(drawAndAnimate, 200);
    });
  }
  
  initTechWire();

});
