import dat from "dat.gui";
import initLightFolder from "./light";
import initPolyhedronFolder from "./polyhedron";

const gui = new dat.GUI();

export function initGUI(): void {
    initPolyhedronFolder(gui);
    initLightFolder(gui);
}

export default gui;
