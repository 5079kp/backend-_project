const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas:document.getElementById("bg"), alpha:true});

renderer.setSize(innerWidth, innerHeight);
camera.position.z = 5;

const particles = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);

for(let i=0;i<count*3;i++){
  positions[i] = (Math.random()-0.5)*20;
}

particles.setAttribute("position", new THREE.BufferAttribute(positions,3));

const material = new THREE.PointsMaterial({color:0xffffff, size:0.02});
const mesh = new THREE.Points(particles, material);
scene.add(mesh);

function animate(){
  requestAnimationFrame(animate);
  mesh.rotation.y += 0.0005;
  renderer.render(scene,camera);
}
animate();