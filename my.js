import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
    import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

    let scene, camera, renderer, character, mixer, animationsMap = {}, currentAction;

    const clock = new THREE.Clock();

    init();

    function init() {
      const container = document.getElementById('three-container');
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x202040);

      camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 3;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(2, 2, 2);
      scene.add(light);

      const loader = new GLTFLoader();
      loader.load('https://models.readyplayer.me/687f348ffe81071316984e27.glb', (gltf) => {
        character = gltf.scene;
        scene.add(character);

        // Setup animations
        mixer = new THREE.AnimationMixer(character);
        gltf.animations.forEach((clip) => {
          animationsMap[clip.name.toLowerCase()] = mixer.clipAction(clip);
        });

        playAnimation('idle'); // fallback animation if others don't exist

        animate();
      });
    }

    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      renderer.render(scene, camera);
    }

    function playAnimation(name) {
      const action = animationsMap[name];
      if (!action) return;

      if (currentAction && currentAction !== action) {
        currentAction.fadeOut(0.5);
      }

      action.reset().fadeIn(0.5).play();
      currentAction = action;
    }

    window.handleEmotion = function () {
      const emotion = document.getElementById('emotionInput').value.toLowerCase();

      switch (emotion) {
        case 'happy':
          playAnimation('happy');
          break;
        case 'sad':
          playAnimation('sad');
          break;
        case 'angry':
          playAnimation('angry');
          break;
        default:
          playAnimation('idle');
          break;
      }
    };

    window.playAnimation = playAnimation;