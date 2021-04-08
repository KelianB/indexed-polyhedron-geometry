import {WebGLRenderer} from "three";

const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
window.onresize = () => renderer.setSize(window.innerWidth, window.innerHeight);

export default renderer;
