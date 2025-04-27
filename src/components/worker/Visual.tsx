import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Define types for the cube creation parameters
interface CubeParams {
  width: number;
  height: number;
  depth: number;
  color?: number;
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
): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(...position);
  scene.add(cube);
  return cube;
}

function createRoom(scene: THREE.Scene, options: RoomOptions): RoomMeshes {
  const {
    width,
    height,
    depth,
    color = 0xcccccc,
    doubleSided = true,
  } = options;

  // 共用材质
  const material = new THREE.MeshStandardMaterial({
    color,
    side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
  });

  // 1. 创建地板
  const floorGeometry = new THREE.PlaneGeometry(width, depth);
  const floor = new THREE.Mesh(floorGeometry, material);
  floor.rotation.x = -Math.PI / 2; // 平铺在地面
  floor.position.set(width / 2, 0, depth / 2);
  scene.add(floor);

  // 2. 创建墙面1（沿X轴方向）
  const wall1Geometry = new THREE.PlaneGeometry(depth, height);
  const wall1 = new THREE.Mesh(wall1Geometry, material);
  wall1.rotation.y = Math.PI / 2; // 垂直于Z轴
  wall1.position.set(0, height/2, depth/2); // 放在X轴正方向
  scene.add(wall1);

  // 3. 创建墙面2（沿Z轴方向）
  const wall2Geometry = new THREE.PlaneGeometry(height, width);
  const wall2 = new THREE.Mesh(wall2Geometry, material);
  wall2.rotation.z = Math.PI / 2; // 垂直于X轴
  wall2.position.set(width/2, height/2, 0); // 放在Z轴负方向
  scene.add(wall2);

  // 返回引用（方便后续操作）
  return { floor, wall1, wall2 };
}

// 定义组件ref暴露的方法
export interface ThreeSceneHandle {
  switchToTopView: () => void;
  switchToDefaultView: () => void;
  addItem: (params: CubeParams) => void;
  removeLastItem: () => void;
}

const ThreeScene = forwardRef<ThreeSceneHandle>((props, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const itemsRef = useRef<THREE.Mesh[]>([]);
  
  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    switchToTopView: () => {
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.set(0, 20, 0);
        cameraRef.current.lookAt(6, 0, 4);
        controlsRef.current.target.set(6, 0, 4);
        controlsRef.current.update();
      }
    },
    switchToDefaultView: () => {
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.set(10, 10, 15);
        cameraRef.current.lookAt(6, 0, 4);
        controlsRef.current.target.set(6, 0, 4);
        controlsRef.current.update();
      }
    },
    addItem: (params: CubeParams) => {
        if (sceneRef.current) {
          const cube = createCube(
            sceneRef.current,
            params.width,
            params.height,
            params.depth,
            params.color ?? 0x00ff00,
            params.position ?? [0, 0, 0]
          );
          itemsRef.current.push(cube); // 添加到数组里
        }
      },
    removeLastItem: () => {
        if (sceneRef.current && itemsRef.current.length > 0) {
          const lastItem = itemsRef.current.pop(); // 拿出最后一个
          if (lastItem) {
            sceneRef.current.remove(lastItem); // 从场景中移除
            lastItem.geometry.dispose(); // 释放内存
            if (Array.isArray(lastItem.material)) {
              lastItem.material.forEach((m) => m.dispose());
            } else {
              lastItem.material.dispose();
            }
          }
        }
      }
      
  }));

  useEffect(() => {
    if (!mountRef.current || sceneRef.current) return;

    // 初始化
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // 浅灰色背景
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(10, 10, 15);
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer();
    rendererRef.current = renderer;

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    const axesHelper = new THREE.AxesHelper(20); // 参数表示坐标轴长度
    scene.add(axesHelper);

    const room = createRoom(scene, {
      width: 12,   // X轴方向长度
      height: 4,   // Y轴方向高度
      depth: 8,    // Z轴方向深度
      color: 0xdddddd, // 浅灰色
    });

    // 添加一些灯光（否则StandardMaterial会显示为黑色）
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 处理窗口大小变化
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);
    
  return <div ref={mountRef} className="three-container" />;
});

export default ThreeScene;