export const DEFAULT_PROMPT =
  "A realistic studio photograph of the person in Image 1 wearing the exact saree from Image 2. LOCK AND PRESERVE Image 1's person identity, face, facial expression, skin tone, hairstyle, head angle, body posture, hands, background, and studio lighting 100% identically without any changes. REPLACE ONLY the person's current clothing/dress in Image 1 with the Indian saree from Image 2 along with a color-matched blouse. Drape the saree from Image 2 in the authentic traditional Indian style with neat waist pleats and a crisp pallu over the shoulder, accurately transferring the fabric texture, zari border, motif patterns, and color palette from Image 2. Do not alter anything else in Image 1.";

export interface ModelOption {
  id: string;
  label: string;
  value: string;
  costLabel: string;
  description: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "idm-vton",
    label: "IDM-VTON (Dedicated Saree Model)",
    value: "cuuupid/idm-vton",
    costLabel: "~$0.003 / image (Lowest Cost)",
    description: "Dedicated virtual try-on model for preserving saree texture, pallu, and border weaves",
  },
  {
    id: "nano-banana-2",
    label: "Google Nano Banana 2",
    value: "google/nano-banana-2",
    costLabel: "~$0.067 / image (Premium)",
    description: "Multimodal Gemini image generation engine",
  },
];

export interface AspectRatioOption {
  id: string;
  label: string;
  value: string;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: "match", label: "Auto Match Person Image (Input 1)", value: "match_input_image" },
  { id: "3:4", label: "Portrait (3:4)", value: "3:4" },
  { id: "4:5", label: "Instagram Portrait (4:5)", value: "4:5" },
  { id: "9:16", label: "Mobile Story (9:16)", value: "9:16" },
  { id: "1:1", label: "Square (1:1)", value: "1:1" },
  { id: "4:3", label: "Standard (4:3)", value: "4:3" },
  { id: "16:9", label: "Widescreen (16:9)", value: "16:9" },
];

export interface ResolutionOption {
  id: string;
  label: string;
  value: string;
}

export const RESOLUTION_OPTIONS: ResolutionOption[] = [
  { id: "1k", label: "1K Fast & Lowest Cost (Recommended)", value: "1K" },
  { id: "2k", label: "2K High Definition", value: "2K" },
  { id: "4k", label: "4K Ultra HD", value: "4K" },
];

/**
 * Calculates the closest supported Replicate aspect ratio string given width and height.
 */
export function getClosestAspectRatio(width: number, height: number): string {
  if (!width || !height) return "3:4";
  const targetRatio = width / height;

  const candidateRatios = [
    { name: "1:1", val: 1.0 },
    { name: "3:4", val: 3 / 4 }, // 0.75
    { name: "4:5", val: 4 / 5 }, // 0.8
    { name: "9:16", val: 9 / 16 }, // 0.5625
    { name: "4:3", val: 4 / 3 }, // 1.333
    { name: "16:9", val: 16 / 9 }, // 1.777
    { name: "2:3", val: 2 / 3 }, // 0.666
    { name: "3:2", val: 3 / 2 }, // 1.5
  ];

  let closest = candidateRatios[0];
  let minDiff = Math.abs(targetRatio - closest.val);

  for (let i = 1; i < candidateRatios.length; i++) {
    const diff = Math.abs(targetRatio - candidateRatios[i].val);
    if (diff < minDiff) {
      minDiff = diff;
      closest = candidateRatios[i];
    }
  }

  return closest.name;
}
