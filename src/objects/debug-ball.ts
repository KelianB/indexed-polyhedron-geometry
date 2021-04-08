import {Mesh, MeshBasicMaterial, Scene, SphereGeometry, Vector3} from "three";

export class DebugBall {
    mesh: Mesh;
    orbit: boolean;
    orbitRadius: number;
    orbitSpeed: number;
    p = 0;

    constructor(orbit = true, orbitRadius = 50, orbitSpeed = 0.0005) {
        const material = new MeshBasicMaterial({color: 0x220000});
        this.mesh = new Mesh(new SphereGeometry(1, 8, 8), material);
        this.orbit = orbit;
        this.orbitRadius = orbitRadius;
        this.orbitSpeed = orbitSpeed;
    }

    private updatePosition(orbitCenter: Vector3): void {
        const x = orbitCenter.x + this.orbitRadius * Math.cos(this.p);
        const y = orbitCenter.y;
        const z = orbitCenter.z + this.orbitRadius * Math.sin(this.p);
        this.mesh.position.set(x, y, z);
    }

    update(dt: number, orbitCenter = new Vector3(0, 0, 0)): void {
        if (this.orbit) {
            this.p += dt * 1e-3 * this.orbitSpeed;
            this.updatePosition(orbitCenter);
        } else if (this.p == 0) this.updatePosition(orbitCenter);
    }

    getPosition(): Vector3 {
        return this.mesh.position;
    }

    addToScene(scene: Scene): void {
        scene.add(this.mesh);
    }

    removeFromScene(scene: Scene): void {
        scene.remove(this.mesh);
    }

    setOrbit(orbit: boolean): void {
        this.orbit = orbit;
    }

    setOrbitRadius(radius: number): void {
        this.orbitRadius = radius;
    }

    setOrbitSpeed(speed: number): void {
        this.orbitSpeed = speed;
    }
}
