gsap.registerPlugin(ScrollTrigger);

const scene = document.querySelector("#scene");

// Assets avec ordre d'apparition et délai d'entrée au scroll
const assets = [
  { name: "paper-texture", src: "assets/paper-texture.png", className: "paper-texture", mouseDepth: 0, revealStart: 0.0, revealDuration: 0.3 },
  { name: "sun", src: "assets/sun.png", className: "sun", mouseDepth: 2, revealStart: 0.08, revealDuration: 0.25 },
  { name: "mountains", src: "assets/mountains.png", className: "mountains", mouseDepth: 3, revealStart: 0.14, revealDuration: 0.28 },
  { name: "dragon", src: "assets/dragon.png", className: "dragon", mouseDepth: 5, revealStart: 0.18, revealDuration: 0.3 },
  { name: "clouds-1", src: "assets/clouds-1.png", className: "clouds clouds-one", mouseDepth: 7, revealStart: 0.22, revealDuration: 0.26 },
  { name: "clouds-2", src: "assets/clouds-2.png", className: "clouds clouds-two", mouseDepth: 8, revealStart: 0.26, revealDuration: 0.26 },
  { name: "torii", src: "assets/torii.png", className: "torii", mouseDepth: 9, revealStart: 0.30, revealDuration: 0.28 },
  { name: "temple-roof", src: "assets/temple-roof.png", className: "temple", mouseDepth: 10, revealStart: 0.34, revealDuration: 0.28 },
  { name: "artist", src: "assets/artist.png", className: "artist", mouseDepth: 13, revealStart: 0.42, revealDuration: 0.3 },
  { name: "crane", src: "assets/crane.png", className: "crane", mouseDepth: 11, revealStart: 0.38, revealDuration: 0.28 },
  { name: "ink-smoke", src: "assets/ink-smoke.png", className: "smoke", mouseDepth: 12, revealStart: 0.40, revealDuration: 0.32 },
  { name: "waves", src: "assets/waves.png", className: "waves", mouseDepth: 14, revealStart: 0.44, revealDuration: 0.3 },
  { name: "bamboo", src: "assets/bamboo.png", className: "bamboo", mouseDepth: 16, revealStart: 0.48, revealDuration: 0.28 },
  { name: "tree-branches", src: "assets/tree-branches.png", className: "branches", mouseDepth: 18, revealStart: 0.46, revealDuration: 0.28 },
  { name: "torn-paper", src: "assets/torn-paper.png", className: "torn-paper", mouseDepth: 6, revealStart: 0.80, revealDuration: 0.3 }
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

  // Timeline de scroll principal
  tl.to(".hero-content", { y: -180, opacity: 0, ease: "none" }, 0)
    .to(".sun", { y: -90, scale: 1.08, ease: "none" }, 0)
    .to(".mountains", { y: -70, scale: 1.04, ease: "none" }, 0)
    .to(".dragon", { x: -160, y: -80, scale: 1.12, rotate: -2, opacity: 0.22, ease: "none" }, 0)
    .to(".clouds-one", { x: -150, y: -45, ease: "none" }, 0)
    .to(".clouds-two", { x: 130, y: -85, ease: "none" }, 0)
    .to(".torii", { y: -175, scale: 1.12, ease: "none" }, 0)
    .to(".temple", { y: -225, scale: 1.16, ease: "none" }, 0)
    .to(".artist", { y: -265, scale: 1.2, ease: "none" }, 0)
    .to(".crane", { x: -230, y: -130, rotate: -8, ease: "none" }, 0)
    .to(".smoke", { x: -190, y: -125, scale: 1.2, opacity: 0.16, ease: "none" }, 0)
    .to(".waves", { y: -185, scale: 1.08, ease: "none" }, 0)
    .to(".bamboo", { y: -365, x: -85, scale: 1.18, ease: "none" }, 0)
    .to(".branches", { y: -285, x: 125, scale: 1.16, ease: "none" }, 0)
    .to(".torn-paper", { y: -125, scaleY: 1.15, ease: "none" }, 0);

  // Animation continue de la grue
  gsap.to(".crane", {
    y: "+=18",
    rotate: "+=2",
    duration: 4.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Animation continue de la fumée
  gsap.to(".smoke", {
    x: "+=28",
    duration: 7,
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
