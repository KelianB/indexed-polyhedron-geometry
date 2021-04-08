import {GUI} from "dat.gui";
import {generatePolys} from "../main";

export const polyhedronOptions = {
    radius: 50,
    detail: 0,
};

export default function initPolyhedronFolder(gui: GUI): GUI {
    const options = polyhedronOptions;

    const folder = gui.addFolder("Polyhedron");
    folder
        .add(options, "radius", 30, 100)
        .listen()
        .onFinishChange((v) => generatePolys(v, options.detail));
    folder
        .add(options, "detail", 0, 200)
        .listen()
        .onFinishChange((v) => generatePolys(options.radius, v));

    folder.open();

    return folder;
}
