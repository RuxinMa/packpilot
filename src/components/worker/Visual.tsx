import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { roomDatabase } from '../../components/common/data';
import { itemDatabase } from '../../components/common/data';

// Define types for the cube creation parameters
interface CubeParams {
  width: number;
  height: number;
  depth: number;
  position?: [number, number, number];
}

// Define types for room creation options
interface RoomOptions {
  width: number;
  height: number;
  depth: number;
  color?: number;
  doubleSided?: boolean;
}

// Define return type for room creation
interface RoomMeshes {
  floor: THREE.Mesh;
  wall1: THREE.Mesh;
  wall2: THREE.Mesh;
}

function createCube(
  scene: THREE.Scene,
  width: number,
  height: number,
  depth: number,
  color: number = 0x00ff00,
  position: [number, number, number] = [0, 0, 0]
): THREE.Group {
  // create cube
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.name = 'cube'; 
  cube.position.set(...position);

  // create frame
  const edges = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const line = new THREE.LineSegments(edges, lineMaterial);
  line.name = 'edge'; 
  line.position.set(...position);

  // Group
  const group = new THREE.Group();
  group.add(cube);
  group.add(line);

  scene.add(group);

  return group;
}



function createRoom(scene: THREE.Scene, options: RoomOptions): RoomMeshes {
  const {
    width,
    height,
    depth,
    color = 0xD3D3D3,
    doubleSided = true,
  } = options;

  const material = new THREE.MeshStandardMaterial({
    color,
    side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
  });

  const roomGroup = new THREE.Group(); // create group for room

  // floor
  const floorGeometry = new THREE.PlaneGeometry(width, depth);
  const floor = new THREE.Mesh(floorGeometry, material);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(width / 2, 0, depth / 2);
  floor.name = 'floor';
  roomGroup.add(floor);

  // floor frame
  const floorEdges = new THREE.EdgesGeometry(floorGeometry);
  const floorLine = new THREE.LineSegments(
    floorEdges,
    new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 }) // 把 linewidth 设置为3，明显加粗
  );  
  floorLine.rotation.x = -Math.PI / 2;
  floorLine.position.set(width / 2, 0.01, depth / 2);
  roomGroup.add(floorLine);

  // wall1
  const wall1Geometry = new THREE.PlaneGeometry(depth, height);
  const wall1 = new THREE.Mesh(wall1Geometry, material);
  wall1.rotation.y = Math.PI / 2;
  wall1.position.set(0, height / 2, depth / 2);
  wall1.name = 'wall1';
  roomGroup.add(wall1);

  const wall1Edges = new THREE.EdgesGeometry(wall1Geometry);
  const wall1Line = new THREE.LineSegments(
    wall1Edges,
    new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 })
  );
  
  wall1Line.rotation.y = Math.PI / 2;
  wall1Line.position.set(0.01, height / 2, depth / 2);
  roomGroup.add(wall1Line);

  // wall2
  const wall2Geometry = new THREE.PlaneGeometry(height, width);
  const wall2 = new THREE.Mesh(wall2Geometry, material);
  wall2.rotation.z = Math.PI / 2;
  wall2.position.set(width / 2, height / 2, 0);
  wall2.name = 'wall2';
  roomGroup.add(wall2);

  const wall2Edges = new THREE.EdgesGeometry(wall2Geometry);
  const wall2Line = new THREE.LineSegments(
    wall2Edges,
    new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 })
  );
  wall2Line.rotation.z = Math.PI / 2;
  wall2Line.position.set(width / 2, height / 2, 0.01);
  roomGroup.add(wall2Line);

  scene.add(roomGroup);
  return { floor, wall1, wall2 };
}


//ref expose
export interface ThreeSceneHandle {
  switchToTopView: () => void;
  switchToDefaultView: () => void;
  addItem: (params: CubeParams) => void;
  removeLastItem: () => void;
}
//new info item 
interface ThreeSceneProps {
  onItemClick?: (itemId: string) => void;
  onEmptyClick?: () => void; 
}

const ThreeScene = forwardRef<ThreeSceneHandle, ThreeSceneProps>((props, ref) => {
  //end here
  
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const itemsRef = useRef<THREE.Group[]>([]);
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthoCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const activeCameraRef = useRef<THREE.Camera | null>(null);
  const selectedMesh = useRef<THREE.Mesh | null>(null);

  //expose to parent
  useImperativeHandle(ref, () => ({
    switchToTopView: () => {
      if (controlsRef.current && orthoCameraRef.current) {
        activeCameraRef.current = orthoCameraRef.current;
        controlsRef.current.object = orthoCameraRef.current;
        controlsRef.current.enableRotate = false; // rotate
        controlsRef.current.enablePan = true;     // move
        controlsRef.current.enableZoom = true;    // zoom
        controlsRef.current.update();
      }
    },
    
    switchToDefaultView: () => {
      if (controlsRef.current && perspectiveCameraRef.current) {
        activeCameraRef.current = perspectiveCameraRef.current;
        controlsRef.current.object = perspectiveCameraRef.current;
        controlsRef.current.enableRotate = true; 
        controlsRef.current.enablePan = true;    
        controlsRef.current.enableZoom = true;   
        controlsRef.current.update();
      }
    },
    
    
    addItem: (params: CubeParams) => {
      if (sceneRef.current) {
        const lastGroup = itemsRef.current[itemsRef.current.length - 1];
        if (lastGroup) {
       
          // change color to grey
          const cube = lastGroup.getObjectByName('cube') as THREE.Mesh;
          if (cube && (cube.material instanceof THREE.Material || Array.isArray(cube.material))) {
            if (Array.isArray(cube.material)) {
              cube.material.forEach(m => {
                if (m instanceof THREE.MeshBasicMaterial || m instanceof THREE.MeshStandardMaterial) {
                  m.color.set(0x999999);
                }
              });
            } else {
              if (cube.material instanceof THREE.MeshBasicMaterial || cube.material instanceof THREE.MeshStandardMaterial) {
                cube.material.color.set(0x999999);
              }
            }
          }
        }
    
        // add new item
        const group = createCube(
          sceneRef.current,
          params.width,
          params.height,
          params.depth,
          0xadd8e6,
          params.position ?? [0, 0, 0]
        );
        itemsRef.current.push(group);
      }
    },
    
    removeLastItem: () => {
      if (sceneRef.current && itemsRef.current.length > 0) {
        const lastGroup = itemsRef.current.pop(); // delete last one
        if (lastGroup) {
          sceneRef.current.remove(lastGroup); 
          lastGroup.traverse((child) => {
            if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
              child.geometry.dispose();
              if (Array.isArray(child.material)) {
                child.material.forEach((m) => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          });
        }
    
        //handle last item
        const newLastGroup = itemsRef.current[itemsRef.current.length - 1];
        if (newLastGroup) {
          // recovery frame
          const cube = newLastGroup.getObjectByName('cube') as THREE.Mesh;
          if (cube) {
            const geometry = cube.geometry as THREE.BoxGeometry;
            const edges = new THREE.EdgesGeometry(geometry);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
            const line = new THREE.LineSegments(edges, lineMaterial);
            line.name = 'edge';
            line.position.copy(cube.position); 
            newLastGroup.add(line); 
          }
    
          // change color to blue
          if (cube && (cube.material instanceof THREE.MeshBasicMaterial || cube.material instanceof THREE.MeshStandardMaterial)) {
            cube.material.color.set(0xadd8e6); 
            cube.material.opacity = 1; 
            cube.material.transparent = false;
          }
        }
      }
    }
      
  }));

  useEffect(() => {
    if (!mountRef.current || sceneRef.current) return;

    // init
    const scene = new THREE.Scene();
    console.log('success load scene')
    scene.background = new THREE.Color(0xf0f0f0); // 浅灰色背景
    sceneRef.current = scene;
    
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const aspect = width / height;
    
    // Perspective camera
    const perspectiveCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    perspectiveCamera.position.set(10, 10, 15);
    perspectiveCamera.lookAt(6, 0, 4);
    perspectiveCameraRef.current = perspectiveCamera;
    
    // Orthographic camera
    const frustumSize = 20; 
    const orthoCamera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2, 
      frustumSize * aspect / 2, 
      frustumSize / 2, 
      frustumSize / -2, 
      0.1, 
      1000
    );
    orthoCamera.position.set(0, 20, 0);
    orthoCamera.up.set(0, 0, -1); 
    orthoCamera.lookAt(6, 0, 4);
    orthoCameraRef.current = orthoCamera;
    
    // default Perspective camera
    activeCameraRef.current = perspectiveCamera;
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);
    
    renderer.domElement.addEventListener('click', (event) => {
      console.log('canvas clicked');
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left)/rect.width)*2 - 1;
      const y = -((event.clientY - rect.top)/rect.height)*2 + 1;
      const mousePoint = new THREE.Vector2(x, y);
      const raycaster = new THREE.Raycaster();
    
      const camera = activeCameraRef.current;
      const scene  = sceneRef.current;
      if (!camera || !scene) return;
    
      raycaster.setFromCamera(mousePoint, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const pickable = intersects.filter(intersect => {
        const obj = intersect.object;
    
        // 1. 跳过地板和三面墙
        if (obj.name === 'floor' || obj.name === 'wall1' || obj.name === 'wall2') {
          return false;
        }
    
        // 2. 跳过所有边框线（LineSegments）
        if (obj instanceof THREE.LineSegments) {
          return false;
        }
    
        return true;
      });
      if (pickable.length === 0) {
        // 如果没有选中任何物体，同时需要把之前选中的物体恢复颜色
        if (selectedMesh.current) {
          const prevMaterial = selectedMesh.current.material as THREE.MeshBasicMaterial;
          const lastGroup = itemsRef.current[itemsRef.current.length - 1];
          const lastCube = lastGroup?.getObjectByName('cube') as THREE.Mesh;
      
          if (selectedMesh.current === lastCube) {
            // 是最新物体 → 恢复浅蓝色
            prevMaterial.color.set(0xadd8e6);
          } else {
            // 是旧物体 → 恢复灰色
            prevMaterial.color.set(0x999999);
          }
      
          selectedMesh.current = null;
        }

        if (props.onEmptyClick) {
          props.onEmptyClick();
        }

        console.log('未点击到有效物体');

        return;
      }
      
      const picked = pickable[0].object as THREE.Mesh;
      console.log('拾取到：', picked);
      
      // item info click
      if (picked && props.onItemClick) {
        const group = picked.parent as THREE.Group;
        const index = itemsRef.current.findIndex(item => item === group);
        if (index !== -1) {
          const item = itemDatabase[index];
          if (item) {
            props.onItemClick(item.id); // 传回id
          }
        }
      }
      
    
      // 如果有上一个选中的物体，恢复它的颜色
      if (selectedMesh.current && selectedMesh.current !== picked) {
        const prevMaterial = selectedMesh.current.material as THREE.MeshBasicMaterial;

        const lastGroup = itemsRef.current[itemsRef.current.length - 1];
        const lastCube = lastGroup?.getObjectByName('cube') as THREE.Mesh;

        if (selectedMesh.current === lastCube) {
          prevMaterial.color.set(0xadd8e6); // 浅蓝色
        } else {
          prevMaterial.color.set(0x999999); // 灰色
        }
      }
    
      // 给当前选中的物体上色
      const material = picked.material as THREE.MeshBasicMaterial;
      material.color.set(0xffff00); // 高亮成黄色
    
      // 更新保存
      selectedMesh.current = picked;

    });
    

    // controls
    if (perspectiveCameraRef.current) {
      const controls = new OrbitControls(perspectiveCameraRef.current, renderer.domElement);
      controlsRef.current = controls;
    }
    

    const roomin = roomDatabase[0]
    const room = createRoom(scene, {
      width: roomin.width,   // X轴方向长度
      height: roomin.height,   // Y轴方向高度
      depth: roomin.depth,    // Z轴方向深度
      color: 0xE8FFE8, 
    });

    // back light 
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    

    // animate
    const animate = () => {
      requestAnimationFrame(animate);
    
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    
      if (rendererRef.current && sceneRef.current && activeCameraRef.current) {
        rendererRef.current.render(sceneRef.current, activeCameraRef.current);
      }
    };
    
    
    animate();

    // resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      const aspect = width / height;
    
      if (perspectiveCameraRef.current) {
        perspectiveCameraRef.current.aspect = aspect;
        perspectiveCameraRef.current.updateProjectionMatrix();
      }
      if (orthoCameraRef.current) {
        const frustumSize = 20;
        orthoCameraRef.current.left = frustumSize * aspect / -2;
        orthoCameraRef.current.right = frustumSize * aspect / 2;
        orthoCameraRef.current.top = frustumSize / 2;
        orthoCameraRef.current.bottom = frustumSize / -2;
        orthoCameraRef.current.updateProjectionMatrix();
      }
    
      rendererRef.current.setSize(width, height);
    };
    
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);
    
  return <div ref={mountRef} className="three-container w-full h-full relative" />;
});

export default ThreeScene;