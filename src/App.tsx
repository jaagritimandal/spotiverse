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

export interface Artist {
  name: string;
  position: [number, number, number];
  size: number;
  color: string;
  listeningHours?: number;
}

interface RawArtistData {
  name: string;
  listeningHours: number;
  color: string;
}

// 100 artist dataset with listening hours and vibrant cosmic colors
const rawArtistsData: RawArtistData[] = [
  // Top 10 (Core)
  { name: "Taylor Swift", listeningHours: 340, color: "#c084fc" },
  { name: "The Weeknd", listeningHours: 310, color: "#22d3ee" },
  { name: "Lana Del Rey", listeningHours: 285, color: "#f472b6" },
  { name: "Drake", listeningHours: 260, color: "#fbbf24" },
  { name: "Billie Eilish", listeningHours: 245, color: "#4ade80" },
  { name: "Arctic Monkeys", listeningHours: 230, color: "#818cf8" },
  { name: "Kendrick Lamar", listeningHours: 215, color: "#fb923c" },
  { name: "SZA", listeningHours: 205, color: "#f43f5e" },
  { name: "Frank Ocean", listeningHours: 195, color: "#38bdf8" },
  { name: "Olivia Rodrigo", listeningHours: 185, color: "#a855f7" },

  // Artists 11-24 (Existing sample preserved)
  { name: "Ariana Grande", listeningHours: 175, color: "#f9a8d4" },
  { name: "Dua Lipa", listeningHours: 165, color: "#fbbf24" },
  { name: "Post Malone", listeningHours: 158, color: "#f97316" },
  { name: "Chappell Roan", listeningHours: 150, color: "#ec4899" },
  { name: "Lorde", listeningHours: 142, color: "#818cf8" },
  { name: "Tyler, The Creator", listeningHours: 136, color: "#4ade80" },
  { name: "Miguel", listeningHours: 130, color: "#06b6d4" },
  { name: "Doja Cat", listeningHours: 124, color: "#f472b6" },
  { name: "Harry Styles", listeningHours: 118, color: "#f59e0b" },
  { name: "Sabrina Carpenter", listeningHours: 112, color: "#c084fc" },
  { name: "Radiohead", listeningHours: 107, color: "#6366f1" },
  { name: "Coldplay", listeningHours: 102, color: "#22d3ee" },
  { name: "Rihanna", listeningHours: 97, color: "#ea580c" },
  { name: "Bruno Mars", listeningHours: 93, color: "#10b981" },

  // Artists 25-50 (Expanded universe)
  { name: "Daft Punk", listeningHours: 89, color: "#f59e0b" },
  { name: "Beyoncé", listeningHours: 85, color: "#fbbf24" },
  { name: "Travis Scott", listeningHours: 82, color: "#ef4444" },
  { name: "Bad Bunny", listeningHours: 79, color: "#ec4899" },
  { name: "Adele", listeningHours: 76, color: "#c084fc" },
  { name: "Ed Sheeran", listeningHours: 73, color: "#f97316" },
  { name: "Kanye West", listeningHours: 70, color: "#eab308" },
  { name: "Lady Gaga", listeningHours: 67, color: "#f43f5e" },
  { name: "Justin Bieber", listeningHours: 64, color: "#38bdf8" },
  { name: "Mac Miller", listeningHours: 62, color: "#34d399" },
  { name: "J. Cole", listeningHours: 59, color: "#fb923c" },
  { name: "Fleetwood Mac", listeningHours: 57, color: "#a78bfa" },
  { name: "The Beatles", listeningHours: 55, color: "#60a5fa" },
  { name: "Queen", listeningHours: 53, color: "#facc15" },
  { name: "Pink Floyd", listeningHours: 51, color: "#2dd4bf" },
  { name: "Nirvana", listeningHours: 49, color: "#4ade80" },
  { name: "David Bowie", listeningHours: 47, color: "#f472b6" },
  { name: "Gorillaz", listeningHours: 45, color: "#10b981" },
  { name: "Tame Impala", listeningHours: 44, color: "#ec4899" },
  { name: "The Strokes", listeningHours: 42, color: "#818cf8" },
  { name: "Glass Animals", listeningHours: 41, color: "#06b6d4" },
  { name: "Mitski", listeningHours: 39, color: "#f43f5e" },
  { name: "Phoebe Bridgers", listeningHours: 38, color: "#c084fc" },
  { name: "Clairo", listeningHours: 37, color: "#f9a8d4" },
  { name: "Hozier", listeningHours: 36, color: "#d97706" },
  { name: "Noah Kahan", listeningHours: 35, color: "#84cc16" },

  // Artists 51-75 (Deep cosmic expanse)
  { name: "Charli XCX", listeningHours: 34, color: "#84cc16" },
  { name: "Troye Sivan", listeningHours: 33, color: "#38bdf8" },
  { name: "Kali Uchis", listeningHours: 32, color: "#f472b6" },
  { name: "Rosalía", listeningHours: 31, color: "#ef4444" },
  { name: "Peggy Gou", listeningHours: 30, color: "#22d3ee" },
  { name: "Fred again..", listeningHours: 29, color: "#a855f7" },
  { name: "Skrillex", listeningHours: 28, color: "#f59e0b" },
  { name: "Calvin Harris", listeningHours: 27, color: "#06b6d4" },
  { name: "Avicii", listeningHours: 26, color: "#60a5fa" },
  { name: "Flume", listeningHours: 25, color: "#c084fc" },
  { name: "ODESZA", listeningHours: 25, color: "#fbbf24" },
  { name: "RÜFÜS DU SOL", listeningHours: 24, color: "#2dd4bf" },
  { name: "Disclosure", listeningHours: 23, color: "#f43f5e" },
  { name: "Bon Iver", listeningHours: 23, color: "#93c5fd" },
  { name: "Sufjan Stevens", listeningHours: 22, color: "#fb923c" },
  { name: "Beach House", listeningHours: 21, color: "#c084fc" },
  { name: "Cigarettes After Sex", listeningHours: 21, color: "#94a3b8" },
  { name: "Deftones", listeningHours: 20, color: "#818cf8" },
  { name: "Linkin Park", listeningHours: 20, color: "#ef4444" },
  { name: "Red Hot Chili Peppers", listeningHours: 19, color: "#f87171" },
  { name: "The Cure", listeningHours: 19, color: "#a855f7" },
  { name: "Oasis", listeningHours: 18, color: "#38bdf8" },
  { name: "The Smiths", listeningHours: 18, color: "#6ee7b7" },
  { name: "Foo Fighters", listeningHours: 17, color: "#fbbf24" },
  { name: "Green Day", listeningHours: 17, color: "#4ade80" },

  // Artists 76-100 (Constellation fringe)
  { name: "Paramore", listeningHours: 16, color: "#f97316" },
  { name: "Blink-182", listeningHours: 16, color: "#06b6d4" },
  { name: "Dominic Fike", listeningHours: 15, color: "#f472b6" },
  { name: "Steve Lacy", listeningHours: 15, color: "#fbbf24" },
  { name: "Childish Gambino", listeningHours: 14, color: "#ea580c" },
  { name: "Brent Faiyaz", listeningHours: 14, color: "#818cf8" },
  { name: "Daniel Caesar", listeningHours: 13, color: "#34d399" },
  { name: "Giveon", listeningHours: 13, color: "#c084fc" },
  { name: "Joji", listeningHours: 12, color: "#e11d48" },
  { name: "Rex Orange County", listeningHours: 12, color: "#facc15" },
  { name: "boygenius", listeningHours: 12, color: "#a78bfa" },
  { name: "Conan Gray", listeningHours: 11, color: "#f472b6" },
  { name: "Gracie Abrams", listeningHours: 11, color: "#fb7185" },
  { name: "Reneé Rapp", listeningHours: 10, color: "#38bdf8" },
  { name: "Tate McRae", listeningHours: 10, color: "#2dd4bf" },
  { name: "beabadoobee", listeningHours: 10, color: "#f9a8d4" },
  { name: "Remi Wolf", listeningHours: 9, color: "#a3e635" },
  { name: "KAYTRANADA", listeningHours: 9, color: "#fb923c" },
  { name: "Thundercat", listeningHours: 9, color: "#f59e0b" },
  { name: "Khruangbin", listeningHours: 8, color: "#2dd4bf" },
  { name: "Men I Trust", listeningHours: 8, color: "#818cf8" },
  { name: "TV Girl", listeningHours: 8, color: "#f43f5e" },
  { name: "Sampha", listeningHours: 7, color: "#60a5fa" },
  { name: "Blood Orange", listeningHours: 7, color: "#fb923c" },
  { name: "Massive Attack", listeningHours: 6, color: "#a855f7" },
];

/**
 * Generates deterministic 3D positions with collision relaxation using a seeded PRNG.
 * Ensures the exact same layout on every app reload, well-distributed across depth.
 */
function generateDeterministicUniverse(rawData: RawArtistData[]): Artist[] {
  // Mulberry32 deterministic PRNG
  let seed = 133709;
  function rng() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  const count = rawData.length;
  const maxHours = rawData[0]?.listeningHours || 340;

  // 1. Initial seeded layout based on rank
  const layout = rawData.map((item, i) => {
    // Realistic power-law sizing representing listening volume
    const normalized = item.listeningHours / maxHours;
    const size = Number((0.22 + Math.pow(normalized, 0.52) * 0.50).toFixed(2));

    let x: number;
    let y: number;
    let z: number;

    if (i < 10) {
      // Top 10 core: spread across a wide Z range so rotation reveals depth immediately
      const angle = i * 2.39996 + (rng() - 0.5) * 0.2;
      const radius = 3.8 + (i / 10) * 4.2 + (rng() - 0.5) * 0.8;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * (radius * 0.72) + (rng() - 0.5) * 1.5;
      z = (rng() - 0.5) * 18.0;
    } else if (i < 40) {
      // Mid-tier: very deep Z range for strong parallax on camera rotation
      const angle = i * 2.39996 + (rng() - 0.5) * 0.4;
      const radius = 7.5 + ((i - 10) / 30) * 6.5 + (rng() - 0.5) * 1.8;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * (radius * 0.78) + (rng() - 0.5) * 3.0;
      z = (rng() - 0.5) * 30.0;
    } else {
      // Outer galaxy: extreme Z spread — the universe should feel truly volumetric
      const angle = i * 2.39996 + (rng() - 0.5) * 0.5;
      const radius = 13.0 + ((i - 40) / 60) * 8.0 + (rng() - 0.5) * 2.5;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * (radius * 0.82) + (rng() - 0.5) * 4.0;
      z = (rng() - 0.5) * 44.0;
    }

    return { ...item, size, x, y, z };
  });

  // 2. XY-only collision relaxation — Z is left untouched so the full depth spread is preserved.
  //    Two planets only collide in XY; if they're far apart in Z they're visually separated anyway.
  const iterations = 80;
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = layout[j].x - layout[i].x;
        const dy = layout[j].y - layout[i].y;
        const dz = layout[j].z - layout[i].z;
        // Only push apart when planets are genuinely close in 3D (within 1.5× their combined size)
        const dist3d = Math.hypot(dx, dy, dz);
        const minDist3d = (layout[i].size + layout[j].size + 0.5) * 1.5;
        if (dist3d >= minDist3d) continue;

        // Resolve the overlap in XY only, keeping Z exactly as seeded
        const dist2d = Math.hypot(dx, dy);
        const minDist2d = layout[i].size + layout[j].size + 0.5;
        if (dist2d < minDist2d && dist2d > 0.0001) {
          const push = (minDist2d - dist2d) * 0.5;
          const nx = dx / dist2d;
          const ny = dy / dist2d;
          layout[i].x -= nx * push;
          layout[i].y -= ny * push;
          layout[j].x += nx * push;
          layout[j].y += ny * push;
        }
      }
    }
  }

  // 3. Return final immutable artist array
  return layout.map((item) => ({
    name: item.name,
    position: [
      Number(item.x.toFixed(2)),
      Number(item.y.toFixed(2)),
      Number(item.z.toFixed(2)),
    ],
    size: item.size,
    color: item.color,
    listeningHours: item.listeningHours,
  }));
}

const artists: Artist[] = generateDeterministicUniverse(rawArtistsData);

function Planet({
  artist,
  isTopArtist,
}: {
  artist: Artist;
  isTopArtist: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const showLabel = isTopArtist || hovered;
  const labelFontSize = isTopArtist
    ? Math.max(0.2, artist.size * 0.36)
    : 0.18;

  return (
    <group position={artist.position}>
      {/* Core planet body — emissive glow driven entirely by bloom post-processing */}
      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[artist.size, 48, 48]} />
        <meshStandardMaterial
          color={artist.color}
          emissive={artist.color}
          emissiveIntensity={hovered ? 2.2 : isTopArtist ? 1.3 : 0.9}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* Billboard label — name only, no sub-text */}
      {showLabel && (
        <Billboard position={[0, artist.size + 0.24, 0]}>
          <Text
            fontSize={labelFontSize}
            color={hovered ? "#ffffff" : "#f1f5f9"}
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.018}
            outlineColor="#050510"
            letterSpacing={0.02}
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
      {/* Fog starts late so even deep-Z planets stay visible; tapers into dark space beyond */}
      <fog attach="fog" args={["#050510", 50, 100]} />

      {/* Lighting: key from front-right, rim from deep back-left, warm fill at centre-back */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[14, 10, 8]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-10, -6, -18]} intensity={1.4} color="#818cf8" distance={55} decay={1.8} />
      <pointLight position={[8, 4, -22]} intensity={0.9} color="#c084fc" distance={50} decay={2} />
      <pointLight position={[0, 0, 12]} intensity={0.6} color="#38bdf8" distance={30} decay={2} />

      {/* Multi-layered starfields for enhanced cosmic depth */}
      <Stars
        radius={120}
        depth={60}
        count={4000}
        factor={3.5}
        fade
        speed={0.4}
      />
      <Stars
        radius={55}
        depth={35}
        count={1800}
        factor={4.5}
        fade
        speed={0.8}
      />

      {/* 100 Deterministically Positioned Artists */}
      {artists.map((artist, index) => (
        <Planet
          key={artist.name}
          artist={artist}
          isTopArtist={index < 10}
        />
      ))}

      <EffectComposer>
        <Bloom
          intensity={1.6}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={65}
        rotateSpeed={0.55}
        zoomSpeed={0.85}
        panSpeed={0.65}
        enableDamping={true}
        dampingFactor={0.05}
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
        <Canvas camera={{ position: [0, 0, 18], fov: 54 }}>
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
        <div className="onboarding-overlay" onClick={() => setShowOnboarding(false)}>
          <div
            className="onboarding-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="onboarding-close"
              onClick={() => setShowOnboarding(false)}
              aria-label="Close"
            >
              ✕
            </button>

            <p className="eyebrow">YOUR MUSIC. YOUR UNIVERSE.</p>
            <h2>Ready to explore your own soundscape?</h2>
            <p>
              Connect your Spotify account to start building a universe
              inspired by your listening history.
            </p>

            <div className="onboarding-action">
              <button className="spotify-connect-mock" disabled>
                ✦ CONNECT WITH SPOTIFY
              </button>
            </div>

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
