import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.149.0/examples/jsm/loaders/GLTFLoader.js";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let canvas, renderer;
let raycaster, mouse;

let highlightableObjects = [];
let facebookLink = [];
let linkedinLink = [];
let portfolioLink = [];
let instagramLink = [];

raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();
const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById("progress-bar");
const progressBarContainer = document.getElementById("progress-bar-container");

loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  progressBar.value = (itemsLoaded / itemsTotal) * 100;
};

loadingManager.onLoad = function () {
  progressBarContainer.style.zIndex = 0;
};

//Scene
const scene = new THREE.Scene();

// //Design Object
let gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load(
  "/dist/public/cave/scene.gltf",
  (gltf) => {
    gltf.scene.scale.set(5, 5, 5);
    gltf.scene.name = "cave";
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
gltfLoader.load("/dist/public/magic_crystals/scene.gltf", (gltf) => {
  gltf.scene.position.set(-8, -8, 0);
  gltf.scene.rotation.set(0, 0.5, 0);
  gltf.scene.scale.set(0.01, 0.02, 0.005);
  gltf.scene.name = "magic_crystal";
  scene.add(gltf.scene);
  highlightableObjects.push(gltf.scene);
});

gltfLoader.load("/dist/public/chest_lootbox/scene.gltf", (gltf) => {
  gltf.scene.position.set(-2.5, -13.1, -10.2);
  gltf.scene.rotation.set(-0.5, 0.5, 0);
  gltf.scene.scale.set(1.2, 1.2, 1.2);
  gltf.scene.name = "portfolio_icon";
  scene.add(gltf.scene);
  highlightableObjects.push(gltf.scene);
  portfolioLink.push(gltf.scene);
});

gltfLoader.load("/dist/public/facebook_logo/scene.gltf", (gltf) => {
  gltf.scene.position.set(-5, -12.7, -10.7);
  gltf.scene.rotation.set(-0.5, 0.5, 0);
  gltf.scene.scale.set(0.001, 0.001, 0.001);
  gltf.scene.name = "portfolio_icon";
  scene.add(gltf.scene);
  highlightableObjects.push(gltf.scene);
  facebookLink.push(gltf.scene);
});

gltfLoader.load(
  "/dist/public/instagram_logo_3d_-_colored/scene.gltf",
  (gltf) => {
    gltf.scene.position.set(-5.5, -13.5, -8.9);
    gltf.scene.rotation.set(-0.8, 0.5, 0.2);
    gltf.scene.scale.set(0.12, 0.12, 0.12);
    gltf.scene.name = "portfolio_icon";
    scene.add(gltf.scene);
    highlightableObjects.push(gltf.scene);
    instagramLink.push(gltf.scene);
  }
);

gltfLoader.load("/dist/public/linkedin_3d/scene.gltf", (gltf) => {
  gltf.scene.position.set(-8.2, -12.6, -9.2);
  gltf.scene.rotation.set(-1, 0.5, 0);
  gltf.scene.scale.set(1.2, 1.2, 1.2);
  gltf.scene.name = "portfolio_icon";
  scene.add(gltf.scene);
  highlightableObjects.push(gltf.scene);
  linkedinLink.push(gltf.scene);
});

//Light
scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444, 3));

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(1, 1, 1);
scene.add(light);

//Grid Helper
const gridHelper = new THREE.GridHelper(50, 50, "red");
scene.add(gridHelper);

//Camera
const camera = new THREE.PerspectiveCamera(45, 800 / 600);
camera.position.set(-9, -6, 5);
// camera.rotation.set(Math.PI, (13 * Math.PI) / 8, 0);
camera.lookAt(2, -5, -10);
scene.add(camera);

const tl = gsap.timeline();

//Update camera movement
const sectionOne = document.querySelector("#section1");
const sectionTwo = document.querySelector("#section2");
const sectionThree = document.querySelector("#section3");

const options = {};
const obs1 = new IntersectionObserver(function (entries, obs1) {
  entries.forEach((element) => {
    if (element.isIntersecting) {
      gsap.to(camera.position, {
        x: -7.5,
        y: -6,
        z: 5,
        duration: 3,
        onUpdate: function () {
          camera.lookAt(-5, -15, -10);
        },
      });
    }
  });
}, options);

const obs2 = new IntersectionObserver(function (entries, obs2) {
  entries.forEach((element) => {
    if (element.isIntersecting) {
      gsap.to(camera.position, {
        x: -4,
        y: -6,
        z: 5,
        duration: 3,
        onUpdate: function () {
          camera.lookAt(-5, -15, -10);
        },
      });
    }
  });
}, options);

const obs3 = new IntersectionObserver(function (entries, obs3) {
  entries.forEach((element) => {
    if (element.isIntersecting) {
      gsap.to(camera.position, {
        x: -4,
        y: -6,
        z: -8,
        duration: 3,
        onUpdate: function () {
          camera.lookAt(-5, -15, -10);
        },
      });
    }
  });
}, options);

obs1.observe(sectionOne);
obs2.observe(sectionTwo);
obs3.observe(sectionThree);

//Renderer
canvas = document.getElementById("webgl");
renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//Resize
window.addEventListener("resize", () => {
  //Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

//Controls
const content = document.getElementById("webgl");
scene.userData.element = content;
// let controls = new OrbitControls(camera, renderer.domElement);
// controls.minDistance = 2;
// controls.maxDistance = 5;
// controls.enablePan = true;
// controls.enableZoom = false;
// scene.userData.controls = controls;

// Animation and conforming to window changes
const loop = () => {
  // controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();

function raycasterOnMouseMove(event) {
  event.preventDefault();

  var rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / (rect.width - rect.left)) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(highlightableObjects, true);

  if (intersects.length > 0) {
    intersects[0].object.material.transparent = true;
    intersects[0].object.material.opacity = 0.25;
  }
}

// function raycasterOnMouseMoveOff() {
//   for (let i = 0; i < scene.children.length; i++) {
//     if (scene.children[i].material) {
//       scene.children[i].material.opacity = 1.0;
//       scene.children[i].material.transparent = false;
//     }
//   }
// }

function raycasterOnMouseClick(event) {
  event.preventDefault();

  var rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / (rect.width - rect.left)) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersectsLinkedin = raycaster.intersectObjects(linkedinLink, true);
  var intersectsPortfolio = raycaster.intersectObjects(portfolioLink, true);
  var intersectsFacebook = raycaster.intersectObjects(facebookLink, true);
  var intersectsInstagram = raycaster.intersectObjects(instagramLink, true);

  if (intersectsLinkedin.length > 0) {
    window.location.href = "https://www.linkedin.com/in/bensmithjava/";
  }
  if (intersectsPortfolio.length > 0) {
    window.location.href = "https://bjsmith489.github.io/portfolio-website/";
  }
  if (intersectsFacebook.length > 0) {
    console.log("intersectsFacebook");
  }
  if (intersectsInstagram.length > 0) {
    console.log("intersectsInstagram");
  }
}

window.addEventListener("mousemove", raycasterOnMouseMove);
window.addEventListener("click", raycasterOnMouseClick);
