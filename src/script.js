import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextureLoader } from "three";
const scene = new THREE.Scene();
//textures loader

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const wallColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const wallAOTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const wallNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const wallRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);
const groundAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const groundColorTexture = textureLoader.load("/textures/grass/color.jpg");
const groundNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const groundRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

groundColorTexture.repeat.set(16, 16);
groundNormalTexture.repeat.set(16, 16);
groundRoughnessTexture.repeat.set(16, 16);

groundColorTexture.wrapS = THREE.ReapeatWrapping;
groundNormalTexture.wrapS = THREE.ReapeatWrapping;
groundRoughnessTexture.wrapS = THREE.ReapeatWrapping;

groundColorTexture.wrapT = THREE.ReapeatWrapping;
groundNormalTexture.wrapT = THREE.ReapeatWrapping;
groundRoughnessTexture.wrapT = THREE.ReapeatWrapping;

//Geometries

const geometry = new THREE.PlaneBufferGeometry(30, 30); //shape
const material = new THREE.MeshStandardMaterial({
  map: groundColorTexture,
  roughnessMap: groundRoughnessTexture,
  normalMap: groundNormalTexture,
  // roughness: 0,
}); //color
const ground = new THREE.Mesh(geometry, material); //binded
ground.material.side = THREE.DoubleSide;
ground.rotation.x = Math.PI / 2;

//Walls

const house = new THREE.Group();
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(7, 4, 5),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    normalMap: wallNormalTexture,
    roughnessMap: wallRoughnessTexture,
    roughness: 10,
    // normalize: 10,
    aoMap: wallAOTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float16BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 2;

//Dom

const dom = new THREE.Mesh(
  new THREE.ConeGeometry(6, 1, 4),
  new THREE.MeshStandardMaterial({ color: "red" })
);
dom.rotation.y = Math.PI / 4;
dom.position.y = 4;

//Door

const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(3, 3, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    aoMapIntensity: 20,
    displacementMap: doorHeightTexture,
    displacementScale: 0.2,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    roughness: 0,
    metalness: 1,
    normalMap: doorNormalTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float16BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.material.side = THREE.DoubleSide;
door.position.z = 2.55;
door.position.y = 1.3;

//Bush

const bushMaterial = new THREE.MeshStandardMaterial({ color: "green" });
const bush = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1, 40, 60),
  bushMaterial
);
const bush2 = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 40, 60),
  bushMaterial
);
bush.position.set(2, 0.5, 3.5);
bush2.position.set(3, 0.1, 4.15);

//Graves
const graves = new THREE.Group();
const graveGeometry = new THREE.BoxBufferGeometry(1, 1, 0.3);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "gray" });
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const randomNum = 6 + Math.random() * 7;
  const x = Math.sin(angle) * randomNum;
  const z = Math.cos(angle) * randomNum;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x + 1, 0.5, z);
  grave.rotation.y = Math.random() - 0.5;
  grave.rotation.x = Math.random() - 0.5;
  grave.castShadow = true;
  graves.add(grave);
}

//add
house.add(walls, dom, graves, door, bush, bush2);
scene.add(house, ground);

//Lights

const moonLight = new THREE.DirectionalLight("#ffffff", 0.5);
const doorLight = new THREE.PointLight("#ff7d46", 0.5);
doorLight.position.set(0, 2.5, 4);
moonLight.position.set(0, 1, 2);
house.add(doorLight);
// scene.add(moonLight);

//ghost Lights
const ghost = new THREE.PointLight("#03fce3", 2, 3);
// ghost.position.set(5, 3, 4);
const ghost2 = new THREE.PointLight("#fc0303", 2, 3);
// ghost2.position.set(5, 3, 4);
const ghost3 = new THREE.PointLight("#03fc4e", 2, 3);
// ghost3.position.set(5, 3, 4);
scene.add(ghost, ghost2, ghost3);

//Fog
const fog = new THREE.Fog("#262837", 3, 33);
scene.fog = fog;

// MadeCamera
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});

const camera = new THREE.PerspectiveCamera(45, size.width / size.height);

camera.position.z = 15;
camera.position.y = 5;

//renderd at html element
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor("#262837");

//shadows
renderer.shadowMap.enabled = true;
doorLight.castShadow = true;
ghost.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
walls.castShadow = true;
bush.castShadow = true;
bush2.castShadow = true;
ground.receiveShadow = true;

const ticker = () => {
  // const elapsedTime = clock.getElapsedTime();
  const time = clock.getElapsedTime() * 0.5;

  // mesh.rotation.x += time;
  ghost.position.x = 7 + Math.cos(time) * 7;
  ghost.position.z = 7 + Math.sin(time) * 4;
  ghost.position.y = Math.sin(time * 3);

  ghost2.position.x = -Math.cos(time) * 5;
  ghost2.position.z = Math.sin(time) * 5;
  ghost2.position.y = Math.sin(time * 4) + Math.sin(time * 2.5);

  ghost3.position.x = Math.cos(time) * (7 + Math.sin(time * 0.32));
  ghost3.position.z = Math.sin(time) * (7 + Math.sin(time * 0.5));
  ghost3.position.y = Math.sin(time * 8) + Math.sin(time * 2);

  renderer.render(scene, camera);
  control.update();
  window.requestAnimationFrame(ticker);
};
ticker();
