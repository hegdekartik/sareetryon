import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { DEFAULT_PROMPT } from "@/lib/presets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      personImage,
      sareeImage,
      prompt,
      model = "black-forest-labs/flux-schnell",
      aspect_ratio = "match_input_image",
      personAspectRatio,
      resolution = "2K",
      apiKey,
    } = body;

    if (!personImage) {
      return NextResponse.json(
        { error: "Reference image of person is required." },
        { status: 400 }
      );
    }

    if (!sareeImage) {
      return NextResponse.json(
        { error: "Reference image of saree style is required." },
        { status: 400 }
      );
    }

    const token = apiKey || process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        {
          error:
            "Replicate API token is missing. Please enter your Replicate API Token (r8_...) in Settings or set REPLICATE_API_TOKEN in .env.local.",
        },
        { status: 401 }
      );
    }

    const replicate = new Replicate({ auth: token });
    const inputPrompt = (prompt && prompt.trim()) ? prompt.trim() : DEFAULT_PROMPT;

    let output: any;
    let providerName = "FLUX SCHNELL (black-forest-labs/flux-schnell)";

    if (model === "google/nano-banana-2") {
      providerName = "Google Nano Banana 2 (Replicate)";
      let targetAspectRatio = aspect_ratio;
      if (aspect_ratio === "match_input_image" && personAspectRatio) {
        targetAspectRatio = personAspectRatio;
      }

      const input: Record<string, any> = {
        prompt: inputPrompt,
        image_input: [personImage, sareeImage],
        aspect_ratio: targetAspectRatio || "match_input_image",
        resolution: resolution || "2K",
      };

      output = await replicate.run("google/nano-banana-2", { input });
    } else if (model === "google/imagen-3-fast") {
      providerName = "Google Imagen 3 Fast (google/imagen-3-fast)";
      
      let targetAspectRatio = aspect_ratio;
      if (aspect_ratio === "match_input_image" && personAspectRatio) {
        targetAspectRatio = personAspectRatio;
      } else if (aspect_ratio === "match_input_image") {
        targetAspectRatio = "3:4";
      }

      const validImagenRatios = ["1:1", "9:16", "16:9", "3:4", "4:3"];
      if (!validImagenRatios.includes(targetAspectRatio)) {
        if (targetAspectRatio === "4:5" || targetAspectRatio === "2:3") {
          targetAspectRatio = "3:4";
        } else if (targetAspectRatio === "3:2") {
          targetAspectRatio = "4:3";
        } else {
          targetAspectRatio = "3:4";
        }
      }

      const input: Record<string, any> = {
        prompt: inputPrompt,
        aspect_ratio: targetAspectRatio || "3:4",
      };

      output = await replicate.run("google/imagen-3-fast", { input });
    } else {
      // Default: black-forest-labs/flux-schnell
      providerName = "FLUX SCHNELL (black-forest-labs/flux-schnell)";
      
      let targetAspectRatio = aspect_ratio;
      if (aspect_ratio === "match_input_image" && personAspectRatio) {
        targetAspectRatio = personAspectRatio;
      } else if (aspect_ratio === "match_input_image") {
        targetAspectRatio = "3:4";
      }

      const validFluxRatios = ["1:1", "16:9", "21:9", "3:2", "2:3", "4:5", "5:4", "3:4", "4:3", "9:16", "9:21"];
      if (!validFluxRatios.includes(targetAspectRatio)) {
        targetAspectRatio = "3:4";
      }

      const input: Record<string, any> = {
        prompt: inputPrompt,
        aspect_ratio: targetAspectRatio || "3:4",
        output_format: "webp"
      };

      output = await replicate.run(
        "black-forest-labs/flux-schnell",
        { input }
      );
    }

    let resultUrl: string | null = null;

    if (typeof output === "string") {
      resultUrl = output;
    } else if (output && typeof output.url === "function") {
      resultUrl = String(output.url());
    } else if (output && typeof output === "object" && "url" in output && typeof output.url === "string") {
      resultUrl = output.url;
    } else if (Array.isArray(output) && output.length > 0) {
      const first = output[0];
      if (typeof first === "string") {
        resultUrl = first;
      } else if (first && typeof first.url === "function") {
        const generatedUrl = first.url();
        resultUrl = typeof generatedUrl === "object" ? generatedUrl.href : String(generatedUrl);
      } else if (first && typeof first === "object" && "url" in first) {
        resultUrl = String(first.url);
      } else {
        resultUrl = String(first); // Fallback for streams with overloaded toString
      }
    } else if (output && typeof output.toString === "function") {
      resultUrl = output.toString();
    }
    
    // Explicit final check if Replicate SDK returned FileOutput directly without an array
    if (!resultUrl && output && typeof output.url === "function") {
      const singleUrl = output.url();
      resultUrl = typeof singleUrl === "object" ? singleUrl.href : String(singleUrl);
    }

    if (resultUrl && resultUrl.startsWith("[object")) {
      resultUrl = null;
    }

    if (!resultUrl || !(resultUrl.startsWith("http") || resultUrl.startsWith("data:"))) {
      console.error("Invalid output from Replicate:", output);
      throw new Error(`Invalid or missing image output returned from ${providerName}.`);
    }

    return NextResponse.json({
      resultImage: resultUrl,
      provider: providerName,
    });
  } catch (error: any) {
    console.error("Virtual Try-On route error:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "An unexpected error occurred while communicating with Replicate API.",
      },
      { status: 500 }
    );
  }
}
