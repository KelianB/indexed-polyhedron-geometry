import {BufferGeometry, Float32BufferAttribute, Uint32BufferAttribute, Vector2, Vector3} from "three";

/**
 * This is a small edit on the PolyhedronGeometry implementation
 * @see https://threejs.org/docs/#api/en/geometries/PolyhedronGeometry
 * Creates an indexed geometry (instead of the original non-indexed implementation).
 * Among other differences, this allows for smooth shading when viewing up-close.
 */
class IndexedPolyhedronGeometry extends BufferGeometry {
    parameters: {vertices: number[]; indices: number[]; radius: number; detail: number};

    constructor(vertices: number[], indices: number[], radius = 1, detail = 0) {
        super();

        this.type = "IndexedPolyhedronGeometry";

        this.parameters = {
            vertices: vertices,
            indices: indices,
            radius: radius,
            detail: detail,
        };

        // default buffer data

        let vertexIndex = 0;
        const indexBuffer: number[] = [];
        const vertexBuffer: number[] = [];
        const uvBuffer: number[] = [];

        // the subdivision creates the vertex buffer data

        subdivide(detail);

        // all vertices should lie on a conceptual sphere with a given radius

        applyRadius(radius);

        // finally, create the uv data

        generateUVs();

        // build indexed geometry

        this.setIndex(new Uint32BufferAttribute(indexBuffer, 1));
        this.setAttribute("position", new Float32BufferAttribute(vertexBuffer, 3));
        this.setAttribute("normal", new Float32BufferAttribute(vertexBuffer.slice(), 3));
        this.setAttribute("uv", new Float32BufferAttribute(uvBuffer, 2));

        if (detail === 0) {
            this.computeVertexNormals(); // flat normals
        } else {
            this.normalizeNormals(); // smooth normals
        }

        // helper functions

        function subdivide(detail) {
            const a = new Vector3();
            const b = new Vector3();
            const c = new Vector3();

            // iterate over all faces and apply a subdivison with the given detail value

            for (let i = 0; i < indices.length; i += 3) {
                // get the vertices of the face
                getVertexByIndex(indices[i + 0], a);
                getVertexByIndex(indices[i + 1], b);
                getVertexByIndex(indices[i + 2], c);

                // perform subdivision
                subdivideFace(a, b, c, detail);
            }
        }

        function subdivideFace(a, b, c, detail) {
            const cols = detail + 1;

            // we use this multidimensional array as a data structure for creating the subdivision

            const indices: number[][] = [];

            // construct all of the vertices for this subdivision

            for (let i = 0; i <= cols; i++) {
                indices[i] = [];

                const aj = a.clone().lerp(c, i / cols);
                const bj = b.clone().lerp(c, i / cols);

                const rows = cols - i;

                for (let j = 0; j <= rows; j++) {
                    indices[i][j] = vertexIndex;

                    if (j === 0 && i === cols) pushVertex(aj);
                    else pushVertex(aj.clone().lerp(bj, j / rows));
                }
            }

            // construct all of the faces

            for (let i = 0; i < cols; i++) {
                const rows = cols - i;

                for (let k = 0; k < 2 * rows - 1; k++) {
                    const j = Math.floor(k / 2);

                    const v1 = indices[i][j + 1];
                    let v2, v3;
                    if (k % 2 === 0) {
                        v2 = indices[i + 1][j];
                        v3 = indices[i][j];
                    } else {
                        v2 = indices[i + 1][j + 1];
                        v3 = indices[i + 1][j];
                    }
                    indexBuffer.push(v1, v2, v3);
                }
            }
        }

        function applyRadius(radius) {
            const vertex = new Vector3();

            // iterate over the entire buffer and apply the radius to each vertex

            for (let i = 0; i < vertexBuffer.length; i += 3) {
                vertex.x = vertexBuffer[i + 0];
                vertex.y = vertexBuffer[i + 1];
                vertex.z = vertexBuffer[i + 2];

                vertex.normalize().multiplyScalar(radius);

                vertexBuffer[i + 0] = vertex.x;
                vertexBuffer[i + 1] = vertex.y;
                vertexBuffer[i + 2] = vertex.z;
            }
        }

        function generateUVs() {
            const vertex = new Vector3();

            for (let i = 0; i < vertexBuffer.length; i += 3) {
                vertex.x = vertexBuffer[i + 0];
                vertex.y = vertexBuffer[i + 1];
                vertex.z = vertexBuffer[i + 2];

                const u = azimuth(vertex) / 2 / Math.PI + 0.5;
                const v = inclination(vertex) / Math.PI + 0.5;
                uvBuffer.push(u, 1 - v);
            }

            correctUVs();

            correctSeam();
        }

        function correctSeam() {
            // handle case when face straddles the seam, see #3269

            for (let i = 0; i < uvBuffer.length; i += 6) {
                // uv data of a single face

                const x0 = uvBuffer[i + 0];
                const x1 = uvBuffer[i + 2];
                const x2 = uvBuffer[i + 4];

                const max = Math.max(x0, x1, x2);
                const min = Math.min(x0, x1, x2);

                // 0.9 is somewhat arbitrary

                if (max > 0.9 && min < 0.1) {
                    if (x0 < 0.2) uvBuffer[i + 0] += 1;
                    if (x1 < 0.2) uvBuffer[i + 2] += 1;
                    if (x2 < 0.2) uvBuffer[i + 4] += 1;
                }
            }
        }

        function pushVertex(vertex) {
            vertexBuffer.push(vertex.x, vertex.y, vertex.z);
            vertexIndex++;
        }

        function getVertexByIndex(index, vertex) {
            const stride = index * 3;

            vertex.x = vertices[stride + 0];
            vertex.y = vertices[stride + 1];
            vertex.z = vertices[stride + 2];
        }

        function correctUVs() {
            const a = new Vector3();
            const b = new Vector3();
            const c = new Vector3();

            const centroid = new Vector3();

            const uvA = new Vector2();
            const uvB = new Vector2();
            const uvC = new Vector2();

            for (let i = 0, j = 0; i < vertexBuffer.length; i += 9, j += 6) {
                a.set(vertexBuffer[i + 0], vertexBuffer[i + 1], vertexBuffer[i + 2]);
                b.set(vertexBuffer[i + 3], vertexBuffer[i + 4], vertexBuffer[i + 5]);
                c.set(vertexBuffer[i + 6], vertexBuffer[i + 7], vertexBuffer[i + 8]);

                uvA.set(uvBuffer[j + 0], uvBuffer[j + 1]);
                uvB.set(uvBuffer[j + 2], uvBuffer[j + 3]);
                uvC.set(uvBuffer[j + 4], uvBuffer[j + 5]);

                centroid.copy(a).add(b).add(c).divideScalar(3);

                const azi = azimuth(centroid);

                correctUV(uvA, j + 0, a, azi);
                correctUV(uvB, j + 2, b, azi);
                correctUV(uvC, j + 4, c, azi);
            }
        }

        function correctUV(uv, stride, vector, azimuth) {
            if (azimuth < 0 && uv.x === 1) {
                uvBuffer[stride] = uv.x - 1;
            }

            if (vector.x === 0 && vector.z === 0) {
                uvBuffer[stride] = azimuth / 2 / Math.PI + 0.5;
            }
        }

        // Angle around the Y axis, counter-clockwise when looking from above.

        function azimuth(vector) {
            return Math.atan2(vector.z, -vector.x);
        }

        // Angle above the XZ plane.

        function inclination(vector) {
            return Math.atan2(-vector.y, Math.sqrt(vector.x * vector.x + vector.z * vector.z));
        }
    }
}

export default IndexedPolyhedronGeometry;
