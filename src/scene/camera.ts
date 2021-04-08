import {PerspectiveCamera} from "three";

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};

export default camera;
