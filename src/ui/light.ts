import {GUI} from "dat.gui";
import {lightBall} from "../main";
import {sunLight} from "../scene/light";

export const lightOptions = {
    orbit: false,
    atCamera: true,
    intensity: sunLight.intensity,
    decay: 0,
};

const options = lightOptions;

export default function initLightFolder(gui: GUI): GUI {
    const folder = gui.addFolder("Light");
    folder
        .add(options, "intensity", 0, 5)
        .listen()
        .onChange((v) => (sunLight.intensity = v));
    folder
        .add(options, "decay", 0, 5)
        .listen()
        .onChange((v) => (sunLight.decay = v));
    folder.add(options, "orbit").onChange((v) => lightBall.setOrbit(v));
    folder.add(options, "atCamera");
    folder.open();

    // Set defaults
    sunLight.decay = options.decay;
    lightBall.setOrbit(options.orbit);

    return folder;
}
