import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface DumbbellHeroProps {
  className?: string;
  enableControls?: boolean;
}

export const DumbbellHero3D: React.FC<DumbbellHeroProps> = ({ className = '', enableControls = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch (e) {
        return false;
      }
    })();

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#090B0A', 0.04);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2.4, 1.2, 3.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment map via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-Point Lighting Rig
    // 1. Warm Key Light
    const keyLight = new THREE.DirectionalLight('#ffffff', 3.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // 2. Cool Fill Light
    const fillLight = new THREE.DirectionalLight('#8baac9', 1.2);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    // 3. Electric Lime Rim Light (Brand identity)
    const limeRimLight = new THREE.DirectionalLight('#C7FF3D', 2.8);
    limeRimLight.position.set(-2, -1, 3);
    scene.add(limeRimLight);

    // Subtle Ambient
    const ambientLight = new THREE.HemisphereLight('#202822', '#090B0A', 0.8);
    scene.add(ambientLight);

    // ==========================================
    // PROCEDURAL PBR METALLIC DUMBBELL GROUP (9 distinct parts)
    // ==========================================
    const dumbbellGroup = new THREE.Group();

    // Procedural knurling canvas texture for the central grip handle
    const knurlCanvas = document.createElement('canvas');
    knurlCanvas.width = 256;
    knurlCanvas.height = 256;
    const ctx = knurlCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#777777';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#222222';
      ctx.lineWidth = 2;
      for (let i = -256; i < 512; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 256, 256);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i, 256);
        ctx.lineTo(i + 256, 0);
        ctx.stroke();
      }
    }
    const knurlTexture = new THREE.CanvasTexture(knurlCanvas);
    knurlTexture.wrapS = THREE.RepeatWrapping;
    knurlTexture.wrapT = THREE.RepeatWrapping;
    knurlTexture.repeat.set(4, 8);

    // Materials
    // 1. Black Brushed Steel (Plates)
    const blackSteelMaterial = new THREE.MeshStandardMaterial({
      color: 0x161819,
      metalness: 0.88,
      roughness: 0.28,
    });

    // 2. Chrome / Polished Titanium (Handle bar & collars)
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8ded8,
      metalness: 0.95,
      roughness: 0.18,
      bumpMap: knurlTexture,
      bumpScale: 0.015,
    });

    // 3. Electric Lime Anodized Ring Accent
    const limeAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xC7FF3D,
      emissive: 0x5a8a00,
      emissiveIntensity: 0.35,
      metalness: 0.85,
      roughness: 0.22,
    });

    // 4. Matte Cast Iron Core
    const castIronMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c1e1d,
      metalness: 0.75,
      roughness: 0.42,
    });

    // Part 1: Central Bar / Handle
    const barGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 32);
    barGeo.rotateZ(Math.PI / 2);
    const barMesh = new THREE.Mesh(barGeo, handleMaterial);
    barMesh.castShadow = !isSoftwareGl;
    barMesh.receiveShadow = !isSoftwareGl;
    dumbbellGroup.add(barMesh);

    // Inner stopper collars
    const collarGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.08, 32);
    collarGeo.rotateZ(Math.PI / 2);

    const leftCollar = new THREE.Mesh(collarGeo, handleMaterial);
    leftCollar.position.x = -0.55;
    dumbbellGroup.add(leftCollar);

    const rightCollar = new THREE.Mesh(collarGeo, handleMaterial);
    rightCollar.position.x = 0.55;
    dumbbellGroup.add(rightCollar);

    // Helper for composite dumbbell head plates (both sides)
    const createPlateAssembly = (direction: number) => {
      const headGroup = new THREE.Group();

      // Lime Anodized spacer ring
      const spacerGeo = new THREE.TorusGeometry(0.18, 0.02, 16, 32);
      spacerGeo.rotateY(Math.PI / 2);
      const spacerMesh = new THREE.Mesh(spacerGeo, limeAccentMaterial);
      spacerMesh.position.x = direction * 0.62;
      headGroup.add(spacerMesh);

      // Large Hexagonal / Outer Plate 1 (25 KG plate)
      const plate1Geo = new THREE.CylinderGeometry(0.68, 0.68, 0.16, 6); // Hexagonal bevel shape!
      plate1Geo.rotateZ(Math.PI / 2);
      const plate1 = new THREE.Mesh(plate1Geo, blackSteelMaterial);
      plate1.position.x = direction * 0.74;
      plate1.castShadow = !isSoftwareGl;
      plate1.receiveShadow = !isSoftwareGl;
      headGroup.add(plate1);

      // Plate 2 (Interleaved heavy plate)
      const plate2Geo = new THREE.CylinderGeometry(0.64, 0.64, 0.14, 6);
      plate2Geo.rotateZ(Math.PI / 2);
      const plate2 = new THREE.Mesh(plate2Geo, castIronMaterial);
      plate2.position.x = direction * 0.91;
      plate2.castShadow = !isSoftwareGl;
      plate2.receiveShadow = !isSoftwareGl;
      headGroup.add(plate2);

      // Plate 3 (Outer beveled plate)
      const plate3Geo = new THREE.CylinderGeometry(0.58, 0.58, 0.12, 6);
      plate3Geo.rotateZ(Math.PI / 2);
      const plate3 = new THREE.Mesh(plate3Geo, blackSteelMaterial);
      plate3.position.x = direction * 1.06;
      plate3.castShadow = !isSoftwareGl;
      plate3.receiveShadow = !isSoftwareGl;
      headGroup.add(plate3);

      // Outer End-Cap Collar with FitFlow Branding Ring
      const capGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 32);
      capGeo.rotateZ(Math.PI / 2);
      const cap = new THREE.Mesh(capGeo, handleMaterial);
      cap.position.x = direction * 1.16;
      headGroup.add(cap);

      // Central Hex Nut / Lock Bolt
      const boltGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.06, 6);
      boltGeo.rotateZ(Math.PI / 2);
      const bolt = new THREE.Mesh(boltGeo, limeAccentMaterial);
      bolt.position.x = direction * 1.21;
      headGroup.add(bolt);

      return headGroup;
    };

    dumbbellGroup.add(createPlateAssembly(-1));
    dumbbellGroup.add(createPlateAssembly(1));

    // Dynamic initial tilt for dramatic showcase angle
    dumbbellGroup.rotation.set(0.35, -0.4, 0.25);
    dumbbellGroup.position.set(0, 0.1, 0);
    scene.add(dumbbellGroup);

    // Soft Contact Shadow Plane Grounding
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 0, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(4, 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.95;
    scene.add(shadowPlane);

    // Subtle floating glowing particle field (Electric Lime energy aura)
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 4.5;
      particlePositions[i + 1] = (Math.random() - 0.5) * 2.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 3;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xC7FF3D,
      size: 0.025,
      transparent: true,
      opacity: 0.5,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    setIsLoaded(true);

    // Interactive Mouse & Scroll tracking
    let targetRotationX = 0.35;
    let targetRotationY = -0.4;
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Render loop with exponential damping
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Idle floating animation
      const floatOffset = Math.sin(elapsedTime * 1.5) * 0.08;
      dumbbellGroup.position.y = 0.1 + floatOffset;
      shadowPlane.scale.set(1 + floatOffset * 0.4, 1 + floatOffset * 0.4, 1);

      // Scroll-driven reaction
      const scrollInfluence = Math.min(scrollY * 0.0015, 1.2);

      // Mouse influence
      targetRotationY = -0.4 + mouseX * 0.9 + scrollInfluence * 1.5 + (isInteracting ? 0 : elapsedTime * 0.15);
      targetRotationX = 0.35 + mouseY * 0.6 - scrollInfluence * 0.3;

      dumbbellGroup.rotation.y = THREE.MathUtils.damp(dumbbellGroup.rotation.y, targetRotationY, 4, delta);
      dumbbellGroup.rotation.x = THREE.MathUtils.damp(dumbbellGroup.rotation.x, targetRotationX, 4, delta);
      dumbbellGroup.rotation.z = THREE.MathUtils.damp(dumbbellGroup.rotation.z, 0.25 + mouseX * 0.2, 4, delta);

      // Slowly rotate particle field
      particleSystem.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      knurlTexture.dispose();
      shadowTexture.dispose();
    };
  }, [isInteracting]);

  return (
    <div
      className={`relative w-full h-[450px] md:h-[550px] flex items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
    >
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating subtle specs badge (top-right or bottom-center as per skill) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111512]/90 border border-white/10 text-xs text-[#A1A99E] backdrop-blur-md pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#C7FF3D]" />
        <span>Interactive 3D Dumbbell • Move cursor to inspect</span>
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#090B0A]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#C7FF3D] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest text-[#A1A99E]">Rendering 3D Studio Model...</p>
          </div>
        </div>
      )}
    </div>
  );
};
