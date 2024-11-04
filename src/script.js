import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//GLTF Loader
const gltfLoader = new GLTFLoader()
gltfLoader.load(
  '/models/ModeloFlor.gltf',
  (gltf) =>
  {
    console.log(gltf)
    /*gltf.scene.scale.set(1, 1, 1); // Ajusta el valor según sea necesario
    gltf.scene.position.set(0, 0, 0); // Centra el modelo en la escena
    scene.add(gltf.scene);
    console.log(gltf.scene.children)
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
          console.log(child.name, child.position);
        }
      });*/
    //console.log(gltf.scene.children); // Muestra los hijos del modelo cargado
    
    // Asegúrate de que el índice 17 existe y es un objeto THREE.Object3D
    
   console.log(scene.position)


   const box = new THREE.Box3().setFromObject(gltf.scene);
   const center = box.getCenter(new THREE.Vector3());
   gltf.scene.position.sub(center); // Reubica el modelo al origen
   scene.add(gltf.scene);

   gltf.scene.scale.set(0.1, 0.1, 0.1); // Prueba con valores más grandes si es necesario

   camera.position.set(10, 10, 10); // Prueba con esta posición para ver mejor el modelo
   controls.target.set(0, 0, 0);
   controls.update();
   
   const helper = new THREE.BoxHelper(gltf.scene, 0xff0000);
   scene.add(helper);
  }
)
/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()