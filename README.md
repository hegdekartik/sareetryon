# SareeStudio AI 🥻✨

> **Virtual Saree Try-On Studio Powered by Google Nano Banana 2 (`google/nano-banana-2`) on Replicate**

SareeStudio AI is a modern, high-fidelity virtual garment fitting studio that enables users and retailers to preview how any saree design, fabric texture, or border pattern looks on a person using multimodal AI.

---

## 🌟 Key Features

* **Google Nano Banana 2 Engine**: Powered by `google/nano-banana-2` via the official Replicate JavaScript SDK.
* **Direct Image Uploads**: No presets required. Upload any **Person Reference Photo** and any **Saree Style Reference Photo**.
* **Identity & Neck-Lock Directive**: Built-in identity-preservation prompting ensures the person's face, facial expression, skin tone, hair, and posture from Image 1 remain unchanged.
* **Automatic Aspect Ratio Matching**: Measures the person photo's exact dimensions on upload and enforces matching aspect ratio outputs (e.g. `3:4`, `9:16`, `1:1`).
* **Client-Side Image Compression**: Automatically resizes and compresses heavy camera photos client-side (to 1280px / JPEG 0.85), reducing network payload size by ~95% for faster renders and lower API costs.
* **Interactive Studio Canvas**:
  * **Result Only View**: Clean full-size rendering.
  * **Split View**: Side-by-side comparison of Person + Saree + AI Output.
  * **Before / After Interactive Slider**: Drag to compare original person photo against virtual try-on result.
* **HD Export & Fullscreen Zoom**: One-click high-resolution download and full-screen preview modal.

---

## 🚀 Quick Start

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **Replicate API Token**: Obtain a free/paid token from [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens) (begins with `r8_...`).

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/hegdekartik/sareetryon.git
cd sareetryon
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
REPLICATE_API_TOKEN=r8_your_replicate_api_token_here
```

*(Note: You can also enter your Replicate API Token directly inside the web UI via the **API Setup** key modal).*

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📸 How It Works

1. **Step 1: Upload Person Photo**: Upload or drag-and-drop a front-facing photo of the person/model.
2. **Step 2: Upload Saree Photo**: Upload or drag-and-drop a photo of the saree pattern, weave, or border design.
3. **Step 3: Generate**: Click **Generate Virtual Try-On**. The system passes both images along with the identity-locking prompt to `google/nano-banana-2` on Replicate.
4. **Step 4: Preview & Download**: Compare before/after results with the interactive slider and download the rendered high-res output.

---

## 📁 Repository Structure

```
sareetryon/
├── app/
│   ├── api/
│   │   └── tryon/
│   │       └── route.ts         # Replicate API handler for google/nano-banana-2
│   ├── globals.css              # Glassmorphic & studio styling tokens
│   ├── layout.tsx               # Next.js root layout
│   └── page.tsx                 # Main Virtual Try-On Studio Page
├── components/
│   ├── ApiGuideModal.tsx        # Nano Banana 2 API documentation modal
│   ├── ApiSettingsModal.tsx     # Replicate API key configuration modal
│   ├── Header.tsx               # Studio header bar & status indicators
│   ├── PersonUploader.tsx       # Person reference image uploader
│   ├── SareeUploader.tsx        # Saree style reference image uploader
│   └── TryOnViewer.tsx          # Interactive before/after canvas & controls
├── lib/
│   ├── imageUtils.ts            # Client-side image compression & resizing
│   └── presets.ts              # System prompts & aspect ratio helpers
├── FUTURE_DIRECTIONS.md         # B2B SaaS roadmap for saree retailers & kiosks
└── README.md
```

---

## 🏢 Future B2B SaaS Roadmap

For saree boutiques, showrooms, and e-commerce platforms looking to integrate virtual try-on as an in-store tablet kiosk or Shopify plugin, refer to our detailed strategic roadmap:
👉 **[FUTURE_DIRECTIONS.md](FUTURE_DIRECTIONS.md)**

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
