/**
 * This is the same as the default THREE.js implementation of IcosahedronGeometry, the only difference
 * being that we extend our IndexedPolyhedronGeometry instead of PolyhedronGeometry.
 */

import IndexedPolyhedronGeometry from "./indexed-polyhedron-geometry";

const t = (1 + Math.sqrt(5)) / 2;

/* eslint-disable prettier/prettier */
const VERTICES = [
    -1, t, 0,   1, t, 0, 	-1, -t, 0,  1, -t, 0,
    0, -1, t,   0, 1, t,    0, -1, -t,  0, 1, -t,
    t, 0, -1,   t, 0, 1,    -t, 0, -1, 	-t, 0, 1
];
/* eslint-enable prettier/prettier */

const INDICES = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
];

export default class IndexedIcosahedronGeometry extends IndexedPolyhedronGeometry {
    constructor(radius: number, detail = 0) {
        super(VERTICES, INDICES.flat(), radius, detail);
    }
}
