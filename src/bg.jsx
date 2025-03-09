import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import earthTexture from './assets/2k_earth_daymap.jpg';

// Import post-processing for cinematic effects
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';

const Bg = () => {
  const earthRef = useRef(null);

  useEffect(() => {
    // === Cleanup extra canvases ===
    if (earthRef.current) {
      const existingCanvases = earthRef.current.getElementsByTagName('canvas');
      while (existingCanvases.length > 0) {
        existingCanvases[0].remove();
      }
    }

    // === Scene, Camera & Renderer ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Set background to black

    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    earthRef.current.appendChild(renderer.domElement);

    // === Load Earth Texture & Create Sphere ===
    const texture = new THREE.TextureLoader().load(earthTexture);
    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({ map: texture });
    const globe = new THREE.Mesh(earthGeometry, earthMaterial);
    globe.rotation.x = Math.PI / 8;
    scene.add(globe);

    // === Position Camera ===
    camera.position.z = 10;

    // === Lighting ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // === Starfield Background ===
    const starsGeometry = new THREE.BufferGeometry();
    const starVertices = [];

    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 1000;
      const y = (Math.random() - 0.5) * 1000;
      const z = (Math.random() - 0.5) * 1000;
      starVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // === Distant Asteroids ===
    const asteroidGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

    const asteroids = [];
    for (let i = 0; i < 5; i++) {
      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
      asteroid.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );
      scene.add(asteroid);
      asteroids.push(asteroid);
    }

    // === Post-Processing Effects (Cinematic Look) ===
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const vignettePass = new ShaderPass(VignetteShader);
    vignettePass.uniforms['darkness'].value = 1.5;
    composer.addPass(vignettePass);

    // === Animation Loop ===
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate globe
      globe.rotation.y += 0.0005;

      // Rotate asteroids
      asteroids.forEach(asteroid => {
        asteroid.rotation.x += 0.002;
        asteroid.rotation.y += 0.002;
      });

      composer.render();
    };

    animate();

    // === Cleanup Function ===
    return () => {
      scene.remove(globe, starField, ...asteroids);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={earthRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

export default Bg;
