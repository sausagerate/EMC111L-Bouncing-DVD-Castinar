import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js";

const screenSize = 800;
const halfScreen = screenSize / 2;
const logoWidth = 240;
const logoHeight = 120;
const shrinkAmount = 0.55;
const maxBounces = 7;
const colors = [0xff8c00, 0x00d4ff, 0xff4f9a, 0x7dff76, 0xffd84a, 0xa78bfa];

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  -halfScreen, halfScreen, halfScreen, -halfScreen, 0.1, 100
);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(screenSize, screenSize);
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000);
document.getElementById("screen").appendChild(renderer.domElement);

// The canvas is used only to draw the logo. The bouncing object is a Three.js plane.
const logoCanvas = document.createElement("canvas");
logoCanvas.width = 512;
logoCanvas.height = 256;
const drawing = logoCanvas.getContext("2d");

drawing.fillStyle = "white";
drawing.textAlign = "center";
drawing.font = "italic bold 168px Arial";
drawing.fillText("DVD", 256, 163);

drawing.beginPath();
drawing.ellipse(256, 208, 174, 17, 0, 0, Math.PI * 2);
drawing.fill();

// Cut the word VIDEO out of the oval so the black background shows through.
drawing.globalCompositeOperation = "destination-out";
drawing.font = "bold 27px Arial";
drawing.letterSpacing = "8px";
drawing.fillText("VIDEO", 258, 218);

const logoTexture = new THREE.CanvasTexture(logoCanvas);
const logoMaterial = new THREE.MeshBasicMaterial({
  map: logoTexture,
  color: colors[0],
  transparent: true,
  side: THREE.DoubleSide
});
const logo = new THREE.Mesh(
  new THREE.PlaneGeometry(logoWidth, logoHeight),
  logoMaterial
);
logo.position.set(0, 0, 0);
scene.add(logo);

let speedX = 260;
let speedY = 190;
let bounceCount = 0;
let previousTime = 0;

function animate(time) {
  const seconds = Math.min((time - previousTime) / 1000, 0.05);
  previousTime = time;

  if (logo.visible) {
    logo.position.x += speedX * seconds;
    logo.position.y += speedY * seconds;

    const halfWidth = (logoWidth * logo.scale.x) / 2;
    const halfHeight = (logoHeight * logo.scale.y) / 2;
    let hitWall = false;

    if (logo.position.x + halfWidth >= halfScreen) {
      logo.position.x = halfScreen - halfWidth;
      speedX = -Math.abs(speedX);
      hitWall = true;
    } else if (logo.position.x - halfWidth <= -halfScreen) {
      logo.position.x = -halfScreen + halfWidth;
      speedX = Math.abs(speedX);
      hitWall = true;
    }

    if (logo.position.y + halfHeight >= halfScreen) {
      logo.position.y = halfScreen - halfHeight;
      speedY = -Math.abs(speedY);
      hitWall = true;
    } else if (logo.position.y - halfHeight <= -halfScreen) {
      logo.position.y = -halfScreen + halfHeight;
      speedY = Math.abs(speedY);
      hitWall = true;
    }

    if (hitWall) {
      bounceCount++;
      logoMaterial.color.setHex(colors[bounceCount % colors.length]);
      logo.scale.multiplyScalar(shrinkAmount);

      if (bounceCount >= maxBounces) {
        logo.visible = false;
      }
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
