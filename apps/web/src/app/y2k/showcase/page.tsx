"use client";

import React, { useState } from "react";
import {
  DesktopFolder,
  Window95,
  PixelButton,
  RetroCard,
} from "@/components/y2k";

export default function Y2KShowcasePage() {
  const [windowOpen, setWindowOpen] = useState(true);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const folders = [
    { id: "documents", label: "My Documents", icon: null },
    { id: "projects", label: "Projects", icon: null },
    { id: "images", label: "Pictures", icon: null },
  ];

  return (
    <div className="min-h-screen bg-[#008080] p-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(45deg, #000025 25%, transparent 25%),
            linear-gradient(-45deg, #000025 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #000025 75%),
            linear-gradient(-45deg, transparent 75%, #000025 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }} />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-12">
        <h1 className="text-4xl font-mono font-bold text-white text-center drop-shadow-lg">
          Y2K Design System Showcase
        </h1>
        <p className="text-center text-white/80 font-mono mt-2">
          Windows 95 + Cyberpunk + Vaporwave aesthetics
        </p>
      </div>

      {/* Desktop Folders */}
      <div className="relative z-10 flex gap-8 mb-12 flex-wrap justify-center">
        {folders.map((folder) => (
          <DesktopFolder
            key={folder.id}
            label={folder.label}
            isOpen={activeFolder === folder.id}
            onClick={() => setActiveFolder(folder.id)}
          />
        ))}
      </div>

      {/* Windows */}
      <div className="relative z-10 flex gap-8 flex-wrap justify-center mb-12">
        <Window95
          title="Welcome to Y2K"
          isOpen={windowOpen}
          onClose={() => setWindowOpen(false)}
          width="350px"
        >
          <div className="space-y-4">
            <p className="font-mono text-sm">
              Welcome to the Y2K Design System! This component library brings
              back the nostalgic aesthetic of late 90s and early 2000s computing.
            </p>
            <div className="flex gap-2">
              <PixelButton variant="primary">OK</PixelButton>
              <PixelButton>Cancel</PixelButton>
            </div>
          </div>
        </Window95>

        {!windowOpen && (
          <PixelButton onClick={() => setWindowOpen(true)}>
            Open Window
          </PixelButton>
        )}
      </div>

      {/* Retro Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <RetroCard variant="default" title="Windows 95" subtitle="Classic Style">
          <p className="font-mono text-sm">
            The classic Windows 95 interface with its iconic gray color scheme
            and 3D borders.
          </p>
        </RetroCard>

        <RetroCard variant="neon" title="Neon Nights" subtitle="Cyberpunk" showScanlines>
          <p className="font-mono text-sm text-pink-300">
            High contrast neon colors with scanline effects for that authentic
            cyberpunk feel.
          </p>
        </RetroCard>

        <RetroCard variant="matrix" title="The Matrix" subtitle="Digital Rain" showScanlines>
          <p className="font-mono text-sm text-green-400">
            Follow the white rabbit. Digital aesthetics inspired by the Matrix.
          </p>
        </RetroCard>

        <RetroCard variant="vaporwave" title="Vaporwave" subtitle="Aesthetic">
          <p className="font-mono text-sm text-white">
            Pink and purple gradients with cyan accents. The ultimate vaporwave
            experience.
          </p>
        </RetroCard>
      </div>

      {/* Button Showcase */}
      <div className="relative z-10 mt-12 max-w-4xl mx-auto">
        <Window95 title="Button Showcase" width="100%">
          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h3 className="font-mono text-sm font-bold mb-3">Variants:</h3>
              <div className="flex flex-wrap gap-2">
                <PixelButton variant="default">Default</PixelButton>
                <PixelButton variant="primary">Primary</PixelButton>
                <PixelButton variant="success">Success</PixelButton>
                <PixelButton variant="danger">Danger</PixelButton>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-mono text-sm font-bold mb-3">Sizes:</h3>
              <div className="flex flex-wrap gap-2 items-center">
                <PixelButton size="sm">Small</PixelButton>
                <PixelButton size="default">Default</PixelButton>
                <PixelButton size="lg">Large</PixelButton>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="font-mono text-sm font-bold mb-3">States:</h3>
              <div className="flex flex-wrap gap-2">
                <PixelButton state="default">Normal</PixelButton>
                <PixelButton state="active">Pressed</PixelButton>
                <PixelButton disabled>Disabled</PixelButton>
              </div>
            </div>
          </div>
        </Window95>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-16 text-center">
        <p className="font-mono text-sm text-white/60">
          Built with Next.js + TypeScript + Tailwind CSS
        </p>
      </div>
    </div>
  );
}
