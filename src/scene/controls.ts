import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import camera from "./camera";
import renderer from "./renderer";

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

export default controls;
