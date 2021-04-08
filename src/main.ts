import "./main.css";
import {initGUI} from "./ui";
import renderer from "./scene/renderer";
import scene from "./scene/scene";
import controls from "./scene/controls";
import camera from "./scene/camera";
import {DebugBall} from "./objects/debug-ball";
import {lightOptions} from "./ui/light";
import {BufferGeometry, Mesh, IcosahedronGeometry, Vector3, MeshPhysicalMaterial} from "three";
import IndexedIcosahedronGeometry from "./geometry/indexed-icosahedron-geometry";
import {polyhedronOptions} from "./ui/polyhedron";
import {sunLight} from "./scene/light";

export const lightBall = new DebugBall(true, 120, 0.8);

document.body.appendChild(renderer.domElement);
initGUI();

lightBall.addToScene(scene);
scene.add(sunLight);
camera.position.set(0, 0, 100);

function createMesh(geo: BufferGeometry): Mesh {
    geo.computeVertexNormals();

    const mat = new MeshPhysicalMaterial({color: 0xffffff});
    const mesh = new Mesh(geo, mat);
    return mesh;
}

let nonIndexedMesh: Mesh;
let indexedMesh: Mesh;

export function generatePolys(radius: number, detail: number): void {
    detail = Math.round(detail);
    if (nonIndexedMesh) scene.remove(nonIndexedMesh);
    if (indexedMesh) scene.remove(indexedMesh);

    const nonIndexedGeo = new IcosahedronGeometry(radius, detail);
    nonIndexedMesh = createMesh(nonIndexedGeo);
    nonIndexedMesh.position.set(-radius * 1.2, 0, 0);
    scene.add(nonIndexedMesh);

    const indexedGeo = new IndexedIcosahedronGeometry(radius, detail);
    indexedMesh = createMesh(indexedGeo);
    indexedMesh.position.set(radius * 1.2, 0, 0);
    scene.add(indexedMesh);
}

function setLightPos(pos: Vector3): void {
    sunLight.position.set(pos.x, pos.y, pos.z);
}

generatePolys(polyhedronOptions.radius, polyhedronOptions.detail);

let previousTime = 0;
function animate(time: number) {
    if (previousTime == 0) previousTime = time - 16.0; // offset by about a frame so our first dt isn't zero
    const dt = time - previousTime;
    previousTime = time;

    requestAnimationFrame(animate);

    lightBall.update(dt, new Vector3(0, 0, 0));

    if (lightOptions.atCamera) setLightPos(camera.position);
    else setLightPos(lightBall.getPosition());

    controls.update();
    renderer.render(scene, camera);
}

requestAnimationFrame(animate);
