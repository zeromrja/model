// Configura la escena, la cámara y el renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 10000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Carga el modelo GLTF con textura integrada
const loader = new THREE.GLTFLoader();
loader.load(
    'model.gltf', // Asegúrate de que esta ruta es correcta
    function (gltf) {
        console.log('Model loaded successfully');

        // Configura un material básico para cada malla del modelo
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({ map: child.material.map });
            }
        });

        // Añade el modelo a la escena
        scene.add(gltf.scene);

        // Configura la posición de la cámara para que mire al modelo
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());

        camera.position.copy(center);
        camera.position.x += size.x * 0.5;
        camera.position.y += size.y * 0.5;
        camera.position.z += size.z * 2;
        camera.lookAt(center);

        // Configura una luz direccional que apunte al modelo desde la posición de la cámara
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.copy(camera.position);
        scene.add(light);

        animate();
    },
    undefined,
    function (error) {
        console.error('Error loading model:', error);
    }
);

// Configura el control de órbita para la cámara
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2;

// Ajusta el tamaño del renderizador al tamaño de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Inicia la animación
animate();
