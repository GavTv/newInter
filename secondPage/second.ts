import * as THREE from "three";

type CubeEdge = number[];

window.addEventListener("DOMContentLoaded", () => {
	try {
		const stage = document.getElementById("hypercube-stage") ?? document.body;
		new Hypercube(stage).init();
		initScrollStory();
		document.body.classList.add("is-ready");
	} catch (err) {
		const el = document.getElementById("load-msg");
		if (el) el.textContent = "WebGL error: " + (err instanceof Error ? err.message : String(err));
	}
});

function initScrollStory(): void {
	const panels = document.querySelectorAll<HTMLElement>(".story-panel");
	if (!panels.length) return;

	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) e.target.classList.add("is-visible");
			});
		},
		{ threshold: 0.4, rootMargin: "-12% 0px -12% 0px" }
	);

	panels.forEach((el) => io.observe(el));
}

class Hypercube {
	private readonly scene: THREE.Scene;
	private readonly camera: THREE.PerspectiveCamera;
	private readonly renderer: THREE.WebGLRenderer;
	private readonly background: THREE.ColorRepresentation = 0x000000;
	private readonly foreground: THREE.ColorRepresentation = 0xffffff;
	private readonly duration: number = 16000; // in milliseconds
	private tesseract?: THREE.Points;
	private mat?: THREE.ShaderMaterial;

	constructor(container: HTMLElement) {
		// Set up the scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(this.background);
		// Set up the camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
		this.camera.position.set(0, 0, 6);
		// Set up the renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		container.insertBefore(this.renderer.domElement, container.firstChild);
	}

	public init(): void {
		const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
		const particlesPerEdge: number = coarse ? 100 : 200;
		const sizeOut: number = 1;
		const sizeIn: number = 0.5;
		const cubeEdges: CubeEdge[] = [
			[0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4], [0, 4], [1, 5], [2, 6], [3, 7]
		];
		const unitCorners: THREE.Vector3[] = [];
		const geo: THREE.BufferGeometry = new THREE.BufferGeometry();
		const totalParticles: number = (cubeEdges.length + 8) * particlesPerEdge;
		const posStart: Float32Array<ArrayBuffer> = new Float32Array(totalParticles * 3);
		const posEnd: Float32Array<ArrayBuffer> = new Float32Array(totalParticles * 3);
		const offsets: Float32Array<ArrayBuffer> = new Float32Array(totalParticles);
		const hues: Float32Array<ArrayBuffer> = new Float32Array(totalParticles);
		let pIdx: number = 0;
	
		for (let x: number = -1; x <= 1; x += 2) {
			for (let y: number = -1; y <= 1; y += 2) {
				for (let z: number = -1; z <= 1; z += 2) {
					unitCorners.push(new THREE.Vector3(x, y, z));
				}
			}
		}

		cubeEdges.forEach((edge, edgeIdx) => {
			const [cornerA, cornerB] = edge;
			const vA: THREE.Vector3 = unitCorners[cornerA];
			const vB: THREE.Vector3 = unitCorners[cornerB];
			const hueBase: number = edgeIdx / cubeEdges.length;

			for (let p = 0; p < particlesPerEdge; p++) {
				const t: number = p / particlesPerEdge;
				const edgePoint: THREE.Vector3 = new THREE.Vector3().lerpVectors(vA, vB, t);
				const start: THREE.Vector3 = edgePoint.clone().multiplyScalar(sizeOut);
				const end: THREE.Vector3 = edgePoint.clone().multiplyScalar(sizeIn);
				// Half flow inward, half flow outward
				const inward: boolean = pIdx % 2 === 0;

				this.setParticleData(
					pIdx,
					inward ? start : end,
					inward ? end : start,
					posStart,
					posEnd,
					offsets
				);
				hues[pIdx] = (hueBase + (p / particlesPerEdge) * 0.12 + Utils.random() * 0.3) % 1;
				pIdx++;
			}
		});

		geo.setAttribute("position", new THREE.BufferAttribute(posStart, 3));
		geo.setAttribute("targetPos", new THREE.BufferAttribute(posEnd, 3));
		geo.setAttribute("offset", new THREE.BufferAttribute(offsets, 1));
		geo.setAttribute("aHue", new THREE.BufferAttribute(hues, 1));

		this.mat = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uResolution: { value: window.innerHeight * Math.min(window.devicePixelRatio, 2) }
			},
			vertexShader: `
				uniform float uTime;
				uniform float uResolution;
				attribute vec3 targetPos;
				attribute float offset;
				attribute float aHue;
				varying vec3 vColor;

				vec3 hsl2rgb(float h, float s, float l) {
					vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
					return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
				}
 
				float cubicBezierX(float t, float x1, float x2) {
					return 3.0 * (1.0 - t) * (1.0 - t) * t * x1 + 3.0 * (1.0 - t) * t * t * x2 + t * t * t;
				}
				float cubicBezierDX(float t, float x1, float x2) {
					return 3.0 * (1.0 - t) * (1.0 - t) * x1 + 6.0 * (1.0 - t) * t * (x2 - x1) + 3.0 * t * t * (1.0 - x2);
				}
				float cubicBezierEase(float x) {
					float x1 = 0.37;
					float y1 = 0.0;
					float x2 = 0.63;
					float y2 = 1.0;
					// Solve for t given x using Newton-Raphson
					float t = x;
					for (int i = 0; i < 8; i++) {
						float err = cubicBezierX(t, x1, x2) - x;
						float dt = cubicBezierDX(t, x1, x2);
						if (abs(dt) < 1e-6) break;
						t -= err / dt;
						t = clamp(t, 0.0, 1.0);
					}
					// Evaluate Y at solved t
					return 3.0 * (1.0 - t) * (1.0 - t) * t * y1 + 3.0 * (1.0 - t) * t * t * y2 + t * t * t;
				}
				void main() {
					float raw = mod(uTime * 0.5 + offset, 2.0);
					// Each leg gets its own 0-to-1 eased independently
					float leg = raw < 1.0 ? cubicBezierEase(raw) : 1.0 - cubicBezierEase(raw - 1.0);
					float easedProgress = leg;
					// Arc outward along the radial direction to avoid clipping through faces
					vec3 midDir = normalize(position + targetPos);
					float bulge = sin(easedProgress * 3.14159265) * 0.1;
					vec3 currentPos = mix(position, targetPos, easedProgress) + midDir * bulge;
					vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
					gl_PointSize = (uResolution / 45.0) * (1.0 / -mvPosition.z);

					float hue = fract(aHue + uTime * 0.14 + offset * 0.4);
					float sparkle = 0.5 + 0.5 * sin(uTime * 5.0 + offset * 6.2831853);
					vColor = hsl2rgb(hue, 0.92, 0.42 + 0.38 * sparkle);

					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				varying vec3 vColor;
				void main() {
					vec2 c = gl_PointCoord - vec2(0.5);
					float d = length(c);
					if (d > 0.5) discard;
					float soft = 1.0 - smoothstep(0.2, 0.5, d);
					float twinkle = 0.85 + 0.15 * sin(d * 12.0);
					gl_FragColor = vec4(vColor * soft * twinkle, soft);
				}
			`,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false
		});

		this.tesseract = new THREE.Points(geo, this.mat);
		this.tesseract.rotation.x = Math.sin(45 * Math.PI / 180);
		this.scene.add(this.tesseract);

		window.addEventListener("resize", this.onResize.bind(this));
		this.animate(0);
	}

	private animate(time: number): void {
		if (this.tesseract) {
			const msToSeconds = this.duration / 1e3;

			this.tesseract.rotation.y = time / 1e3 * (Math.PI * 2 / msToSeconds);
			this.tesseract.rotation.y %= Math.PI * 2;
		}
		if (this.mat) {
			this.mat.uniforms.uTime.value = time / 1e3;
		}

		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.animate.bind(this));
	}

	private onResize(): void {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		if (this.mat) {
			this.mat.uniforms.uResolution.value =
				window.innerHeight * Math.min(window.devicePixelRatio, 2);
		}
	}

	private setParticleData(
		i: number,
		start: THREE.Vector3,
		end: THREE.Vector3,
		posStart: Float32Array,
		posEnd: Float32Array,
		offsets: Float32Array
	): void {
		const index: number = i * 3;

		posStart[index] = start.x;
		posStart[index + 1] = start.y;
		posStart[index + 2] = start.z;
		posEnd[index] = end.x;
		posEnd[index + 1] = end.y;
		posEnd[index + 2] = end.z;
		offsets[i] = Utils.random();
	}
}

class Utils {
	static random() {
		return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
	}
}
