(() => {
    console.clear();

    function logImage(url, width = 200, height = 200) {
      const img = new Image();
      img.crossOrigin = "Anonymous"; 
      img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0, width, height);
    
      const dataUrl = canvas.toDataURL("image/png");
      const style = [
      `background-image: url(${dataUrl})`,
      `background-size: contain`,
      `background-repeat: no-repeat`,
      `padding: ${height / 2}px ${width / 2}px`,
      `line-height: ${height}px`
    ].join(";");
    
    console.log("%c ", style);
  };
  img.src = url;
}

logImage("https://yt3.googleusercontent.com/VQ8g2TGeoEJDsfAl1ET-XFnSaG0DplnfKsC61db86zGYPdoyXzYzHeJlGKkMxtomoSl0sKAn=s120-c-k-c0x00ffffff-no-rj");


    const css = {
        title: `
            color:#00ffe1;
            font-size:42px;
            font-weight:bold;
            text-shadow:0 0 10px cyan;
        `,
        sub: `
            color:#8a2be2;
            font-size:18px;
            font-style:italic;
        `,
        good: "color:#00ff88;font-size:15px;",
        warn: "color:#ffcc00;font-size:15px;font-weight:bold;",
        bad: "color:#ff5555;font-size:15px;font-weight:bold;",
        box: `
            background:#111;
            color:#0f0;
            padding:6px 12px;
            border:2px solid #00ff88;
            border-radius:8px;
            font-size:14px;
        `
    };

    console.log("%cCyber Slot", css.title);
    console.log("%cDeveloper Console Easter Egg", css.sub);

    console.group("🏆 Legendary Copy Cat Awards - 2026!");

    console.log("%cCongratulations!", css.good);
    console.log("You discovered the developer console.");
    console.log("That's already more effort than 90% of visitors. 😎");

    console.groupEnd();

    console.group("📋 Website");

    console.table({
        Developer: "Cyber Slot",
        Version: "2.0",
        Engine: "Vanilla JS",
        Bugs: "They're features.",
        Coffee: "404 Not Found",
        Sleep: "Unknown"
    });

    console.groupEnd();

    console.group("🧠 Developer Quiz");

    console.assert(
        typeof document === "undefined",
        "Good! The browser still knows what 'document' is."
    );

    console.groupEnd();

    console.group("⚡ Fake Hacker Mode");

    console.time("Hack");

    console.log("Connecting...");
    console.log("Loading CSS...");
    console.log("Downloading more RAM...");
    console.log("Feeding the HTML...");
    console.log("Teaching JavaScript how to behave...");

    console.timeEnd("Hack");

    console.warn("WARNING:");
    console.warn("Pasting random code into DevTools can be dangerous.");

    console.error("Access to NASA: Denied.");
    console.info("Access to Cyber Slot: Granted.");

    console.groupEnd();

    console.group("🏅 Achievements");

    console.count("Curiosity");

    console.log("🏆 Ctrl+Shift+I Explorer");
    console.log("🥇 HTML Archaeologist");
    console.log("🥈 CSS Survivor");
    console.log("🥉 JavaScript Whisperer");

    console.groupEnd();

    console.trace("Console reached successfully.");

    console.dir(window);

    window.about = () => {
        console.table({
            Name: "Cyber Slot",
            Motto: "If it exists, it can run Indinix.",
            Status: "Probably fixing CSS.",
            Happiness: "console.log('Hello');"
        });
    };

    window.legend = () => {
        console.log("%c🏆 LEGENDARY!", css.title);
    };

    window.meow = () => {
        console.log("🐱 Meow!");
    };

    Object.defineProperty(window,"secret",{
        get(){
            console.log("%c🎉 Secret Unlocked!",css.good);
            console.log("You really inspect everything, don't you? 👀");
        }
    });

    console.log("%c════════════════════════════════════",css.good);
    console.log("%cAvailable Commands:",css.box);

    console.log("about()");
    console.log("legend()");
    console.log("meow()");
    console.log("secret");

    console.log("%c════════════════════════════════════",css.good);

    console.log("%cFun Fact:",css.warn);
    console.log("The code you're reading");
    console.log("contains approximately");
    console.log("73% caffeine");
    console.log("19% debugging");
    console.log("8% 'Why does this suddenly work?'");

    console.log("%cThanks for visiting ❤️",css.good);

    console.log("%c~ 𝑪𝒚𝒃𝒆𝒓 𝑺𝒍𝒐𝒕",css.sub);
})();

/* ============================================================
   Footer year
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('age').textContent = new Date().getFullYear() - +((+!![])+(+!![]) + "" + (+[]) + "" + (+!![]) + "" + ((+!![])+(+!![])+(+!![])));

/* ============================================================
   Header scroll state + mobile nav
   ============================================================ */
const header = document.getElementById('site-header');
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

/* ============================================================
   Scroll reveal
   ============================================================ */
const revealTargets = document.querySelectorAll(
  '.section-copy, .section-aside, .focus-grid .glass-card, .work-grid .glass-card, .connect-grid .glass-card, .stack-row, .section-kicker, h2'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => io.observe(el));

/* ============================================================
   3D tilt on glass cards
   ============================================================ */
const tiltCards = document.querySelectorAll('.tilt-card');
const MAX_TILT = 7;

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -MAX_TILT * 2;
    const ry = (px - 0.5) * MAX_TILT * 2;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============================================================
   Hero — generative 3D geometry (Three.js)
   ============================================================ */
(function initScene() {
  const canvas = document.getElementById('scene');
  if (!canvas || typeof THREE === 'undefined') return;

  const hero = canvas.closest('.hero');
  let width = hero.clientWidth;
  let height = hero.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  const group = new THREE.Group();
  scene.add(group);

  const outerGeo = new THREE.IcosahedronGeometry(2.6, 1);
  const outerEdges = new THREE.EdgesGeometry(outerGeo);
  const outerMat = new THREE.LineBasicMaterial({ color: 0x45e8d4, transparent: true, opacity: 0.55 });
  const outer = new THREE.LineSegments(outerEdges, outerMat);
  group.add(outer);

  const innerGeo = new THREE.IcosahedronGeometry(1.55, 0);
  const innerEdges = new THREE.EdgesGeometry(innerGeo);
  const innerMat = new THREE.LineBasicMaterial({ color: 0xa878f0, transparent: true, opacity: 0.65 });
  const inner = new THREE.LineSegments(innerEdges, innerMat);
  group.add(inner);

  // faint point cloud for depth
  const starGeo = new THREE.BufferGeometry();
  const starCount = 140;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 14;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xf26fb2, size: 0.035, transparent: true, opacity: 0.5 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  group.position.x = width > 900 ? 2.4 : 0;

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    group.position.x = width > 900 ? 2.4 : 0;
  }
  window.addEventListener('resize', resize);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t = 0;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.0022;

    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    if (!reduceMotion) {
      group.rotation.y = t * 1.4 + targetX * 0.4;
      group.rotation.x = Math.sin(t * 0.8) * 0.25 + targetY * 0.3;
      inner.rotation.y -= 0.0015;
      stars.rotation.y = t * 0.15;
    }

    renderer.render(scene, camera);
  }
  animate();
})();
