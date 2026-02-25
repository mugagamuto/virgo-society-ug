"use client";

import React, { useCallback, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import type { CropAreaPixels } from "@/lib/image";

export function ImageCropModal(props: {
  open: boolean;
  imageSrc: string; // dataURL
  title?: string;
  onClose: () => void;
  onConfirm: (area: CropAreaPixels, opts: { aspect: number; maxWidth: number; quality: number }) => void;
}) {
  const { open, imageSrc, title, onClose, onConfirm } = props;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<CropAreaPixels | null>(null);

  // “Premium” card ratios
  const aspects = useMemo(
    () => [
      { label: "Square 1:1", value: 1 / 1 },
      { label: "Card 4:3", value: 4 / 3 },
      { label: "Wide 16:9", value: 16 / 9 },
      { label: "Portrait 3:4", value: 3 / 4 },
    ],
    []
  );

  const [aspect, setAspect] = useState(aspects[1].value); // default 4:3
  const [maxWidth, setMaxWidth] = useState(1600);
  const [quality, setQuality] = useState(0.86);

  const onCropComplete = useCallback((_area: any, croppedAreaPixels: any) => {
    setAreaPixels(croppedAreaPixels);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 p-3 md:p-6">
      <div className="mx-auto flex h-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div>
            <div className="text-xs font-semibold tracking-widest text-mutedInk uppercase">Crop & Optimize</div>
            <div className="mt-1 text-lg font-semibold">{title ?? "Crop image"}</div>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:bg-black/[0.02]"
          >
            Close
          </button>
        </div>

        <div className="grid flex-1 gap-0 md:grid-cols-[1fr_320px]">
          {/* Cropper */}
          <div className="relative min-h-[340px] bg-black">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              restrictPosition={false}
              objectFit="contain"
            />
          </div>

          {/* Controls */}
          <div className="border-t border-black/10 p-5 md:border-l md:border-t-0">
            <div className="space-y-5">
              <div>
                <div className="text-xs font-semibold text-mutedInk uppercase">Aspect</div>
                <select
                  value={String(aspect)}
                  onChange={(e) => setAspect(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                >
                  {aspects.map((a) => (
                    <option key={a.label} value={String(a.value)}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs font-semibold text-mutedInk uppercase">Zoom</div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="mt-2 w-full"
                />
                <div className="mt-1 text-xs text-mutedInk">Zoom: {zoom.toFixed(2)}x</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-mutedInk uppercase">Auto Resize</div>
                <select
                  value={String(maxWidth)}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                >
                  <option value="1200">1200px (fast)</option>
                  <option value="1600">1600px (recommended)</option>
                  <option value="2000">2000px (high quality)</option>
                </select>
                <div className="mt-1 text-xs text-mutedInk">Outputs JPEG at selected width.</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-mutedInk uppercase">Compression</div>
                <input
                  type="range"
                  min={0.65}
                  max={0.92}
                  step={0.01}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="mt-2 w-full"
                />
                <div className="mt-1 text-xs text-mutedInk">Quality: {quality.toFixed(2)}</div>
              </div>

              <button
                onClick={() => {
                  if (!areaPixels) return;
                  onConfirm(areaPixels, { aspect, maxWidth, quality });
                }}
                className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                disabled={!areaPixels}
              >
                Crop, Optimize & Upload
              </button>

              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-3 text-xs text-mutedInk">
                Tip: Choose <b>Card 4:3</b> for consistent homepage cards on mobile.
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 px-5 py-3 text-xs text-mutedInk">
          Output: cropped + resized JPEG for clean mobile UI.
        </div>
      </div>
    </div>
  );
}