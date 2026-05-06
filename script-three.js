// Scene setup
const canvas = document.getElementById('scene-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 5;

const textureLoader = new THREE.TextureLoader();

// Positions basées sur la composition Figma
const assets = [
  // ARRIÈRE-PLAN
  { name: 'paper-texture', src: 'assets/paper-texture.png', x: 0, y: 0, z: -10, scale: 2.8, opacity: 0.2, revealStart: 0.0 },
  
  // MONTAGNES & FORÊT LOIN
  { name: 'mountains', src: 'assets/mountains.png', x: 0, y: -0.3, z: -8.5, scale: 1.6, opacity: 0.75, revealStart: 0.08 },
  { name: 'forest-distant', src: 'assets/forest-distant.png', x: 0, y: 0.1, z: -8.2, scale: 1.7, opacity: 0.1, revealStart: 0.10 },
  { name: 'mountains-distant-2', src: 'assets/mountains-distant-2.png', x: 0, y: -0.4, z: -8, scale: 1.5, opacity: 0.65, revealStart: 0.12 },
  
  // BRUME ATMOSPHÉRIQUE
  { name: 'mist-atmo-1', src: 'assets/mist-atmo-1.png', x: 0, y: 0.2, z: -7.5, scale: 1.9, opacity: 0.08, revealStart: 0.14 },
  
  // SOLEIL (ARRIÈRE)
  { name: 'sun', src: 'assets/sun.png', x: 0, y: 0.65, z: -7, scale: 1.3, opacity: 0.8, revealStart: 0.16 },
  
  // DRAGON
  { name: 'dragon', src: 'assets/dragon.png', x: 0.2, y: 0.1, z: -6.5, scale: 1.1, opacity: 0.28, revealStart: 0.18 },
  
  // NUAGES
  { name: 'clouds-1', src: 'assets/clouds-1.png', x: -1.2, y: 0.4, z: -6, scale: 0.95, opacity: 0.78, revealStart: 0.20 },
  { name: 'clouds-2', src: 'assets/clouds-2.png', x: 1.2, y: 0.3, z: -5.8, scale: 0.9, opacity: 0.82, revealStart: 0.22 },
  
  // ÉLÉMENTS DÉCOR MILIEU
  { name: 'torii', src: 'assets/torii.png', x: 0, y: 0.25, z: -5, scale: 0.9, opacity: 0.95, revealStart: 0.25 },
  { name: 'temple', src: 'assets/temple-roof.png', x: 0, y: -0.15, z: -4.5, scale: 1.2, opacity: 0.97, revealStart: 0.28 },
  
  // DÉCOR LATÉRAL
  { name: 'twisted-tree', src: 'assets/twisted-tree.png', x: -1.1, y: 0.35, z: -4, scale: 0.8, opacity: 0.9, revealStart: 0.31 },
  { name: 'pagoda', src: 'assets/pagoda.png', x: 1.15, y: 0.45, z: -3.9, scale: 0.85, opacity: 0.88, revealStart: 0.33 },
  
  // ÉLÉMENTS MOUVANTS
  { name: 'crane', src: 'assets/crane.png', x: 1.0, y: 0.5, z: -3.5, scale: 0.7, opacity: 0.93, revealStart: 0.36 },
  { name: 'smoke', src: 'assets/ink-smoke.png', x: 0.1, y: 0.05, z: -3, scale: 1.2, opacity: 0.3, revealStart: 0.38 },
  
  // PERSONNAGE CENTRAL
  { name: 'artist', src: 'assets/artist.png', x: 0, y: -0.55, z: -2.5, scale: 0.65, opacity: 1.0, revealStart: 0.42 },
  
  // MILIEU
  { name: 'waves', src: 'assets/waves.png', x: 0, y: -0.85, z: -1.8, scale: 1.35, opacity: 0.83, revealStart: 0.46 },
  
  // PREMIER PLAN
  { name: 'rocks-close', src: 'assets/rocks-close.png', x: 0, y: -1.05, z: -1.2, scale: 1.45, opacity: 0.68, revealStart: 0.50 },
  { name: 'grasses-close', src: 'assets/grasses-close.png', x: 0, y: -1.25, z: -0.8, scale: 1.4, opacity: 0.6, revealStart: 0.54 },
  
  // TRÈS PROCHE
  { name: 'branches', src: 'assets/tree-branches.png', x: -1.1, y: 0.45, z: -0.3, scale: 1.15, opacity: 0.94, revealStart: 0.58 },
  { name: 'bamboo', src: 'assets/bamboo.png', x: 1.05, y: -0.75, z: 0.1, scale: 0.75, opacity: 0.98, revealStart: 0.62 },
  { name: 'floating-leaves', src: 'assets/floating-leaves.png', x: 0.3, y: 0.35, z: 0.5, scale: 1.0, opacity: 0.5, revealStart: 0.66 },
  
  // TRANSITIONS
  { name: 'torn-paper', src: 'assets/torn-paper.png', x: 0, y: -1.1, z: 1.3, scale: 1.6, opacity: 0.9, revealStart: 0.75 },
  { name: 'closing-smoke', src: 'assets/closing-smoke.png', x: 0, y: 0.4, z: 1.9, scale: 1.7, opacity: 0.25, revealStart: 0.83 }
];

const planes = [];
const assetMap = {};

assets.forEach((asset) => {
  textureLoader.load(asset.src, (texture) => {
    const aspect = texture.image.width / texture.image.height;
    const height = asset.scale;
    const width = height * aspect;

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.05,
      side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(asset.x, asset.y, asset.z);
    plane.userData = {
      revealStart: asset.revealStart,
      targetOpacity: asset.opacity,
      baseX: asset.x,
      baseY: asset.y,
      baseZ: asset.z
    };

    material.opacity = 0;

    scene.add(plane);
    planes.push(plane);
    assetMap[asset.name] = plane;
  });
});

// Scroll reveal & parallax
let scrollProgress = 0;
window.addEventListener('scroll', () => {
  const heroHeight = document.getElementById('hero').offsetHeight;
  scrollProgress = Math.min(window.scrollY / heroHeight, 1);

  planes.forEach((plane) => {
    const revealStart = plane.userData.revealStart;
    const revealDuration = 0.05;
    const revealEnd = revealStart + revealDuration;

    if (scrollProgress >= revealStart && scrollProgress <= revealEnd) {
      const progress = (scrollProgress - revealStart) / revealDuration;
      plane.material.opacity = plane.userData.targetOpacity * Math.min(progress, 1);
    } else if (scrollProgress > revealEnd) {
      plane.material.opacity = plane.userData.targetOpacity;
    } else {
      plane.material.opacity = 0;
    }
  });

  // Camera zoom parallax
  const moveAmount = scrollProgress * 3.5;
  camera.position.z = 5 - moveAmount * 0.9;
  camera.position.y = moveAmount * 0.4;
});

// Mouse parallax
let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;

window.addEventListener('mousemove', (e) => {
  targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  mouseX += (targetMouseX - mouseX) * 0.04;
  mouseY += (targetMouseY - mouseY) * 0.04;

  camera.position.x = mouseX * 0.25;
  camera.position.y += mouseY * 0.15 * 0.01;

  // Crane flight
  const crane = assetMap['crane'];
  if (crane) {
    crane.position.y = crane.userData.baseY + Math.sin(Date.now() * 0.003) * 0.1;
  }

  // Smoke drift
  const smoke = assetMap['smoke'];
  if (smoke) {
    smoke.position.x = smoke.userData.baseX + Math.sin(Date.now() * 0.002) * 0.15;
  }

  // Leaves flutter
  const leaves = assetMap['floating-leaves'];
  if (leaves) {
    leaves.position.y = leaves.userData.baseY + Math.sin(Date.now() * 0.0025) * 0.18;
    leaves.rotation.z += 0.0002;
  }

  renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
