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
): THREE.Group {
  // 创建立方体
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshBasicMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.name = 'cube'; // 设置名字，方便后面查找
  cube.position.set(...position);

  // 创建边框
  const edges = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const line = new THREE.LineSegments(edges, lineMaterial);
  line.name = 'edge'; // 设置名字，方便后面查找
  line.position.set(...position);

  // Group组合
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

  const roomGroup = new THREE.Group(); // 新建一个Group，装房间的东西

  // --- 地板 ---
  const floorGeometry = new THREE.PlaneGeometry(width, depth);
  const floor = new THREE.Mesh(floorGeometry, material);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(width / 2, 0, depth / 2);
  floor.name = 'floor';
  roomGroup.add(floor);

  // 给地板加边框
  const floorEdges = new THREE.EdgesGeometry(floorGeometry);
  const floorLine = new THREE.LineSegments(
    floorEdges,
    new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 }) // 把 linewidth 设置为3，明显加粗
  );  
  floorLine.rotation.x = -Math.PI / 2;
  floorLine.position.set(width / 2, 0.01, depth / 2);
  roomGroup.add(floorLine);

  // --- 墙1（X方向）---
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

  // --- 墙2（Z方向）---
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

  // 最后把整个房间 group 加到 scene
  scene.add(roomGroup);

  // 返回引用，方便后面用
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
  const itemsRef = useRef<THREE.Group[]>([]);
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthoCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const activeCameraRef = useRef<THREE.Camera | null>(null);
  
  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    switchToTopView: () => {
      if (controlsRef.current && orthoCameraRef.current) {
        activeCameraRef.current = orthoCameraRef.current;
        controlsRef.current.object = orthoCameraRef.current;
        controlsRef.current.enableRotate = false; // 禁止旋转
        controlsRef.current.enablePan = true;     // 允许平移
        controlsRef.current.enableZoom = true;    // 允许缩放
        controlsRef.current.update();
      }
    },
    
    switchToDefaultView: () => {
      if (controlsRef.current && perspectiveCameraRef.current) {
        activeCameraRef.current = perspectiveCameraRef.current;
        controlsRef.current.object = perspectiveCameraRef.current;
        controlsRef.current.enableRotate = true; // 恢复旋转
        controlsRef.current.enablePan = true;    // 允许平移
        controlsRef.current.enableZoom = true;   // 允许缩放
        controlsRef.current.update();
      }
    },
    
    
    addItem: (params: CubeParams) => {
      if (sceneRef.current) {
        const lastGroup = itemsRef.current[itemsRef.current.length - 1];
        if (lastGroup) {
          // 1. 移除上一个物体的边框
          const edge = lastGroup.getObjectByName('edge');
          if (edge) {
            lastGroup.remove(edge); // 从group中移除边框
          }
    
          // 2. 把上一个物体的颜色改成灰色
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
    
        // 添加新的物体
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
        const lastGroup = itemsRef.current.pop(); // 取出最后一个要删除的
        if (lastGroup) {
          sceneRef.current.remove(lastGroup); // 从场景里删掉
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
    
        // 处理新的最后一个物体（如果还有的话）
        const newLastGroup = itemsRef.current[itemsRef.current.length - 1];
        if (newLastGroup) {
          // 1. 恢复边框
          const cube = newLastGroup.getObjectByName('cube') as THREE.Mesh;
          if (cube) {
            const geometry = cube.geometry as THREE.BoxGeometry;
            const edges = new THREE.EdgesGeometry(geometry);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
            const line = new THREE.LineSegments(edges, lineMaterial);
            line.name = 'edge';
            line.position.copy(cube.position); // 注意边框和cube同步位置
            newLastGroup.add(line); // 加到group里
          }
    
          // 2. 把颜色改成浅蓝色
          if (cube && (cube.material instanceof THREE.MeshBasicMaterial || cube.material instanceof THREE.MeshStandardMaterial)) {
            cube.material.color.set(0xadd8e6); // 浅蓝色
            cube.material.opacity = 1; // 让它完全不透明
            cube.material.transparent = false;
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
    
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const aspect = width / height;
    
    // 创建Perspective相机
    const perspectiveCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    perspectiveCamera.position.set(10, 10, 15);
    perspectiveCamera.lookAt(6, 0, 4);
    perspectiveCameraRef.current = perspectiveCamera;
    
    // 创建Orthographic相机
    const frustumSize = 20; // 你可以根据场景大小调大一点
    const orthoCamera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2, 
      frustumSize * aspect / 2, 
      frustumSize / 2, 
      frustumSize / -2, 
      0.1, 
      1000
    );
    orthoCamera.position.set(0, 20, 0);
    orthoCamera.up.set(0, 0, -1); // 让上方向-Z轴（不设置也行）
    orthoCamera.lookAt(6, 0, 4);
    orthoCameraRef.current = orthoCamera;
    
    // 默认使用Perspective相机
    activeCameraRef.current = perspectiveCamera;
    
    
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // 添加轨道控制器
    if (perspectiveCameraRef.current) {
      const controls = new OrbitControls(perspectiveCameraRef.current, renderer.domElement);
      controlsRef.current = controls;
    }
    


    const room = createRoom(scene, {
      width: 12,   // X轴方向长度
      height: 4,   // Y轴方向高度
      depth: 8,    // Z轴方向深度
      color: 0xE8FFE8, 
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
    
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    
      if (rendererRef.current && sceneRef.current && activeCameraRef.current) {
        rendererRef.current.render(sceneRef.current, activeCameraRef.current);
      }
    };
    
    
    animate();

    // 处理窗口大小变化
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