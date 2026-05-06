// Scene setup
const canvas = document.getElementById('scene-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 5;

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Assets avec profondeur Z exacte (plus négatif = plus loin)
const assets = [
  { name: 'paper-texture', src: 'assets/paper-texture.png', z: -10, scale: 1.5, opacity: 0.3, revealStart: 0.0 },
  { name: 'sun', src: 'assets/sun.png', z: -9, scale: 0.8, opacity: 0.75, revealStart: 0.06 },
  { name: 'mountains', src: 'assets/mountains.png', z: -8, scale: 1.3, opacity: 0.85, revealStart: 0.10 },
  { name: 'forest-distant', src: 'assets/forest-distant.png', z: -7.8, scale: 1.4, opacity: 0.15, revealStart: 0.12 },
  { name: 'mist-atmo-1', src: 'assets/mist-atmo-1.png', z: -7.5, scale: 1.5, opacity: 0.12, revealStart: 0.14 },
  { name: 'mountains-distant-2', src: 'assets/mountains-distant-2.png', z: -7, scale: 1.35, opacity: 0.78, revealStart: 0.16 },
  { name: 'dragon', src: 'assets/dragon.png', z: -6, scale: 1.2, opacity: 0.35, revealStart: 0.18 },
  { name: 'clouds-1', src: 'assets/clouds-1.png', z: -5.5, scale: 1.0, opacity: 0.82, revealStart: 0.20 },
  { name: 'clouds-2', src: 'assets/clouds-2.png', z: -5.2, scale: 0.9, opacity: 0.85, revealStart: 0.22 },
  { name: 'torii', src: 'assets/torii.png', z: -4.5, scale: 0.8, opacity: 0.92, revealStart: 0.26 },
  { name: 'temple', src: 'assets/temple-roof.png', z: -4, scale: 1.0, opacity: 0.90, revealStart: 0.28 },
  { name: 'twisted-tree', src: 'assets/twisted-tree.png', z: -4.2, scale: 0.7, opacity: 0.88, revealStart: 0.30 },
  { name: 'pagoda', src: 'assets/pagoda.png', z: -4.3, scale: 0.75, opacity: 0.85, revealStart: 0.32 },
  { name: 'crane', src: 'assets/crane.png', z: -3.5, scale: 0.6, opacity: 0.95, revealStart: 0.34 },
  { name: 'smoke', src: 'assets/ink-smoke.png', z: -3.2, scale: 1.1, opacity: 0.35, revealStart: 0.36 },
  { name: 'artist', src: 'assets/artist.png', z: -3, scale: 0.5, opacity: 1.0, revealStart: 0.38 },
  { name: 'waves', src: 'assets/waves.png', z: -2, scale: 1.2, opacity: 0.88, revealStart: 0.40 },
  { name: 'rocks-close', src: 'assets/rocks-close.png', z: -1.5, scale: 1.25, opacity: 0.72, revealStart: 0.42 },
  { name: 'grasses-close', src: 'assets/grasses-close.png', z: -1, scale: 1.3, opacity: 0.65, revealStart: 0.44 },
  { name: 'branches', src: 'assets/tree-branches.png', z: -0.5, scale: 1.0, opacity: 0.92, revealStart: 0.46 },
  { name: 'bamboo', src: 'assets/bamboo.png', z: 0.2, scale: 0.65, opacity: 0.95, revealStart: 0.48 },
  { name: 'floating-leaves', src: 'assets/floating-leaves.png', z: 0.5, scale: 0.9, opacity: 0.52, revealStart: 0.50 },
  { name: 'torn-paper', src: 'assets/torn-paper.png', z: 1.5, scale: 1.4, opacity: 0.95, revealStart: 0.75 },
  { name: 'closing-smoke', src: 'assets/closing-smoke.png', z: 2, scale: 1.5, opacity: 0.32, revealStart: 0.82 }
];

const planes = [];
const assetMap = {};

// Create planes for each asset
assets.forEach((asset, index) => {
  textureLoader.load(asset.src, (texture) => {
    const aspect = texture.image.width / texture.image.height;
    const height = 3;
    const width = height * aspect;

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = asset.z;
    plane.userData = {
      revealStart: asset.revealStart,
      targetOpacity: asset.opacity,
      baseOpacity: 0
    };

    // Start invisible
    material.opacity = 0;

    scene.add(plane);
    planes.push(plane);
    assetMap[asset.name] = plane;
  });
});

// Scroll tracking for reveal
let scrollProgress = 0;
window.addEventListener('scroll', () => {
  const heroHeight = document.getElementById('hero').offsetHeight;
  scrollProgress = Math.min(window.scrollY / heroHeight, 1);

  // Update reveal for each plane
  planes.forEach((plane) => {
    const revealStart = plane.userData.revealStart;
    const revealDuration = 0.08;
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

  // Camera movement based on scroll (parallax effect)
  const moveAmount = scrollProgress * 3;
  camera.position.y = moveAmount * 0.5;
  camera.position.z = 5 - moveAmount * 0.8;
});

// Mouse parallax
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

window.addEventListener('mousemove', (e) => {
  targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Smooth mouse parallax
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;

  // Apply mouse parallax to camera
  camera.position.x = mouseX * 0.5;
  camera.position.y += mouseY * 0.3 * 0.01;

  // Subtle crane animation
  const crane = assetMap['crane'];
  if (crane) {
    crane.position.y += Math.sin(Date.now() * 0.003) * 0.02;
  }

  // Subtle smoke animation
  const smoke = assetMap['smoke'];
  if (smoke) {
    smoke.position.x += Math.sin(Date.now() * 0.002) * 0.015;
  }

  // Floating leaves animation
  const leaves = assetMap['floating-leaves'];
  if (leaves) {
    leaves.position.y += Math.sin(Date.now() * 0.0025) * 0.025;
    leaves.rotation.z += 0.0001;
  }

  renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
