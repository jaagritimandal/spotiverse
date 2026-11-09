
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Text,
  Billboard,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import "./App.css";

interface Artist {
  name: string;
  position: [number, number, number];
  size: number;
  color: string;
}

const artists: Artist[] = [
  { name: "Taylor Swift", position: [-5, 2, 0], size: 0.65, color: "#c084fc" },
  { name: "The Weeknd", position: [-3, 0, -1], size: 0.55, color: "#22d3ee" },
  { name: "Lana Del Rey", position: [-4, -2, 1], size: 0.5, color: "#f472b6" },
  { name: "Drake", position: [0, 3, -1], size: 0.6, color: "#fbbf24" },
  { name: "Billie Eilish", position: [2, 2, 0], size: 0.5, color: "#4ade80" },
  { name: "Arctic Monkeys", position: [4, 1, -2], size: 0.48, color: "#818cf8" },
  { name: "Kendrick Lamar", position: [5, -2, 0], size: 0.55, color: "#c29875" },
  { name: "SZA", position: [2, -2, 1], size: 0.45, color: "#f472b6" },
  { name: "Frank Ocean", position: [-1, -3, -1], size: 0.4, color: "#22d3ee" },
  { name: "Olivia Rodrigo", position: [-2, 3, 1], size: 0.42, color: "#c084fc" },
  { name: "Ariana Grande", position: [1, 0, 2], size: 0.5, color: "#f9a8d4" },
  { name: "Dua Lipa", position: [4, 3, 1], size: 0.4, color: "#fbbf24" },
  { name: "Post Malone", position: [-6, 0, -2], size: 0.35, color: "#fb923c" },
  { name: "Chappell Roan", position: [0, -1, -3], size: 0.35, color: "#f472b6" },
  { name: "Lorde", position: [-3, -3, -2], size: 0.32, color: "#818cf8" },
  { name: "Tyler, The Creator", position: [6, 0, 2], size: 0.42, color: "#4ade80" },
  { name: "Miguel", position: [-1, 1, -3], size: 0.3, color: "#22d3ee" },
  { name: "Doja Cat", position: [3, -3, -1], size: 0.38, color: "#f472b6" },
  { name: "Harry Styles", position: [-5, 3, -2], size: 0.4, color: "#fbbf24" },
  { name: "Sabrina Carpenter", position: [1, 4, 1], size: 0.38, color: "#c084fc" },
  { name: "Radiohead", position: [5, 3, -2], size: 0.35, color: "#818cf8" },
  { name: "Coldplay", position: [-4, 1, 3], size: 0.4, color: "#22d3ee" },
  { name: "Rihanna", position: [3, 1, 3], size: 0.45, color: "#fb923c" },
  { name: "Bruno Mars", position: [-2, -1, 3], size: 0.4, color: "#4ade80" },
];

function Planet({
  artist,
  isTopArtist,
}: {
  artist: Artist;
  isTopArtist: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const showLabel = isTopArtist || hovered;

  return (
    <group position={artist.position}>
      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[artist.size, 48, 48]} />
        <meshStandardMaterial
          color={artist.color}
          emissive={artist.color}
          emissiveIntensity={1.2}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {showLabel && (
        <Billboard position={[0, artist.size + 0.22, 0]}>
          <Text
            fontSize={0.19}
            color="#e2e8f0"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.015}
            outlineColor="#050510"
          >
            {artist.name}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

function Universe() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={2} />

      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        fade
        speed={0.5}
      />

      {artists.map((artist, index) => (
        <Planet
          key={artist.name}
          artist={artist}
          isTopArtist={index < 10}
        />
      ))}

      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={30}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        panSpeed={0.7}
      />
    </>
  );
}

function App() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const startIntroFade = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  useEffect(() => {
    if (!hasInteracted) return;

    const timer = setTimeout(() => {
      setIsFading(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  return (
    <main
      className="app"
      onPointerMove={startIntroFade}
      onTouchStart={startIntroFade}
    >
      <div className="universe">
        <Canvas camera={{ position: [0, 0, 16], fov: 50 }}>
          <color attach="background" args={["#050510"]} />
          <Universe />
        </Canvas>
      </div>

      <header className="top-bar">
        <div className="logo">✦ SPOTIVERSE</div>
        <div className="subtitle">YOUR MUSIC. YOUR UNIVERSE.</div>
      </header>

      <button
        className="create-universe-btn"
        onClick={() => setShowOnboarding(true)}
      >
        ✦ CREATE YOUR OWN UNIVERSE
      </button>

      <section
        className={`welcome intro-fade ${isFading ? "is-hidden" : ""}`}
      >
        <p className="eyebrow">WELCOME TO YOUR UNIVERSE</p>
        <h1>
          Explore your
          <br />
          soundscape.
        </h1>
        <p className="description">
          Every artist is a world. Every song is a star.
        </p>
      </section>

      <div
        className={`interaction-hint intro-fade ${
          isFading ? "is-hidden" : ""
        }`}
      >
        DRAG TO EXPLORE · SCROLL TO ZOOM
      </div>

      {showOnboarding && (
        <div className="onboarding-overlay">
          <div className="onboarding-panel">
            <button
              className="onboarding-close"
              onClick={() => setShowOnboarding(false)}
            >
              ✕
            </button>

            <p className="eyebrow">YOUR MUSIC. YOUR UNIVERSE.</p>
            <h2>Ready to explore your own soundscape?</h2>
            <p>
              Connect your Spotify account to start building a universe
              inspired by your listening history.
            </p>
            <p className="onboarding-note">
              Spotify connection is coming soon.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
