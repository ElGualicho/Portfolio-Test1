gsap.registerPlugin(ScrollTrigger);

const scene = document.querySelector("#scene");

// 25 assets avec révélation progressive au scroll
const assets = [
  { name: "paper-texture", src: "assets/paper-texture.png", className: "paper-texture", mouseDepth: 0, revealStart: 0.0, revealDuration: 0.3 },
  { name: "sun", src: "assets/sun.png", className: "sun", mouseDepth: 2, revealStart: 0.06, revealDuration: 0.25 },
  { name: "mountains", src: "assets/mountains.png", className: "mountains", mouseDepth: 3, revealStart: 0.10, revealDuration: 0.28 },
  { name: "forest-distant", src: "assets/forest-distant.png", className: "forest-distant", mouseDepth: 4, revealStart: 0.12, revealDuration: 0.25 },
  { name: "mist-atmo-1", src: "assets/mist-atmo-1.png", className: "mist-atmo-1", mouseDepth: 5, revealStart: 0.14, revealDuration: 0.3 },
  { name: "mountains-distant-2", src: "assets/mountains-distant-2.png", className: "mountains-distant-2", mouseDepth: 6, revealStart: 0.16, revealDuration: 0.28 },
  { name: "dragon", src: "assets/dragon.png", className: "dragon", mouseDepth: 7, revealStart: 0.18, revealDuration: 0.3 },
  { name: "clouds-1", src: "assets/clouds-1.png", className: "clouds clouds-one", mouseDepth: 8, revealStart: 0.20, revealDuration: 0.26 },
  { name: "clouds-2", src: "assets/clouds-2.png", className: "clouds clouds-two", mouseDepth: 9, revealStart: 0.22, revealDuration: 0.26 },
  { name: "torii", src: "assets/torii.png", className: "torii", mouseDepth: 10, revealStart: 0.26, revealDuration: 0.28 },
  { name: "temple-roof", src: "assets/temple-roof.png", className: "temple", mouseDepth: 11, revealStart: 0.28, revealDuration: 0.28 },
  { name: "twisted-tree", src: "assets/twisted-tree.png", className: "twisted-tree", mouseDepth: 12, revealStart: 0.30, revealDuration: 0.28 },
  { name: "pagoda", src: "assets/pagoda.png", className: "pagoda", mouseDepth: 13, revealStart: 0.32, revealDuration: 0.28 },
  { name: "crane", src: "assets/crane.png", className: "crane", mouseDepth: 14, revealStart: 0.34, revealDuration: 0.28 },
  { name: "ink-smoke", src: "assets/ink-smoke.png", className: "smoke", mouseDepth: 15, revealStart: 0.36, revealDuration: 0.32 },
  { name: "artist", src: "assets/artist.png", className: "artist", mouseDepth: 16, revealStart: 0.38, revealDuration: 0.3 },
  { name: "waves", src: "assets/waves.png", className: "waves", mouseDepth: 17, revealStart: 0.40, revealDuration: 0.3 },
  { name: "rocks-close", src: "assets/rocks-close.png", className: "rocks-close", mouseDepth: 18, revealStart: 0.42, revealDuration: 0.28 },
  { name: "grasses-close", src: "assets/grasses-close.png", className: "grasses-close", mouseDepth: 19, revealStart: 0.44, revealDuration: 0.28 },
  { name: "tree-branches", src: "assets/tree-branches.png", className: "branches", mouseDepth: 20, revealStart: 0.46, revealDuration: 0.28 },
  { name: "bamboo", src: "assets/bamboo.png", className: "bamboo", mouseDepth: 21, revealStart: 0.48, revealDuration: 0.28 },
  { name: "floating-leaves", src: "assets/floating-leaves.png", className: "floating-leaves", mouseDepth: 22, revealStart: 0.50, revealDuration: 0.28 },
  { name: "torn-paper", src: "assets/torn-paper.png", className: "torn-paper", mouseDepth: 23, revealStart: 0.75, revealDuration: 0.3 },
  { name: "closing-smoke", src: "assets/closing-smoke.png", className: "closing-smoke", mouseDepth: 24, revealStart: 0.82, revealDuration: 0.3 }
];

assets.forEach((asset) => {
  const img = document.createElement("img");
  img.src = asset.src;
  img.alt = "";
  img.decoding = "async";
  img.draggable = false;
  img.dataset.depth = asset.mouseDepth;
  img.className = `layer ${asset.className}`;
  img.dataset.revealStart = asset.revealStart;
  img.dataset.revealDuration = asset.revealDuration;
  
  // Initialiser avec opacity 0 et translation négative
  gsap.set(img, { opacity: 0, y: "30px" });
  
  scene.appendChild(img);
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  // Timeline de scroll principal (parallax)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });

  // Timeline pour révélation progressive des panneaux
  const revealTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.5
    }
  });

  // Pour chaque asset, ajouter une animation de révélation
  document.querySelectorAll(".layer").forEach((layer) => {
    const revealStart = parseFloat(layer.dataset.revealStart || 0);
    const revealDuration = parseFloat(layer.dataset.revealDuration || 0.3);
    
    revealTl.to(layer, {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      duration: revealDuration
    }, revealStart);
  });

  // Animations de scroll parallax
  tl.to(".hero-content", { y: -180, opacity: 0, ease: "none" }, 0)
    .to(".sun", { y: -80, scale: 1.06, ease: "none" }, 0)
    .to(".mountains", { y: -60, scale: 1.03, ease: "none" }, 0)
    .to(".forest-distant", { y: -40, scale: 1.02, opacity: 0.25, ease: "none" }, 0)
    .to(".mist-atmo-1", { y: -50, scale: 1.02, opacity: 0.15, ease: "none" }, 0)
    .to(".mountains-distant-2", { y: -80, scale: 1.05, ease: "none" }, 0)
    .to(".dragon", { x: -140, y: -70, scale: 1.10, rotate: -1, opacity: 0.20, ease: "none" }, 0)
    .to(".clouds-one", { x: -130, y: -40, ease: "none" }, 0)
    .to(".clouds-two", { x: 110, y: -75, ease: "none" }, 0)
    .to(".torii", { y: -160, scale: 1.10, ease: "none" }, 0)
    .to(".temple", { y: -210, scale: 1.14, ease: "none" }, 0)
    .to(".twisted-tree", { y: -190, scale: 1.12, ease: "none" }, 0)
    .to(".pagoda", { y: -200, scale: 1.12, ease: "none" }, 0)
    .to(".artist", { y: -250, scale: 1.18, ease: "none" }, 0)
    .to(".crane", { x: -210, y: -120, rotate: -7, ease: "none" }, 0)
    .to(".smoke", { x: -170, y: -110, scale: 1.18, opacity: 0.14, ease: "none" }, 0)
    .to(".waves", { y: -170, scale: 1.06, ease: "none" }, 0)
    .to(".rocks-close", { y: -240, scale: 1.15, ease: "none" }, 0)
    .to(".grasses-close", { y: -280, scale: 1.20, ease: "none" }, 0)
    .to(".bamboo", { y: -350, x: -75, scale: 1.16, ease: "none" }, 0)
    .to(".branches", { y: -270, x: 110, scale: 1.14, ease: "none" }, 0)
    .to(".floating-leaves", { y: -220, x: 50, scale: 1.08, ease: "none" }, 0)
    .to(".torn-paper", { y: -120, scaleY: 1.15, ease: "none" }, 0)
    .to(".closing-smoke", { y: -150, scale: 1.20, opacity: 0.18, ease: "none" }, 0);

  // Animation continue de la grue
  gsap.to(".crane", {
    y: "+=15",
    rotate: "+=1.5",
    duration: 4.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Animation continue de la fumée
  gsap.to(".smoke", {
    x: "+=25",
    duration: 7,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Animation continue des feuilles flottantes
  gsap.to(".floating-leaves", {
    y: "+=20",
    rotate: "+=3",
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Parallax souris
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  function mouseParallax() {
    currentX += (mouseX - currentX) * 0.045;
    currentY += (mouseY - currentY) * 0.045;

    document.querySelectorAll(".layer").forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0);
      layer.style.setProperty("--mx", `${currentX * depth}px`);
      layer.style.setProperty("--my", `${currentY * depth}px`);
    });

    requestAnimationFrame(mouseParallax);
  }

  mouseParallax();
}

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
