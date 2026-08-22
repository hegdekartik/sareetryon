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

    // Determine target aspect ratio. If user selected match_input_image,
    // use the measured aspect ratio of the person image if available, else match_input_image.
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

    const output: any = await replicate.run("google/nano-banana-2", { input });

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
        resultUrl = String(first.url());
      } else if (first && typeof first === "object" && "url" in first) {
        resultUrl = String(first.url);
      }
    } else if (output && typeof output.toString === "function") {
      resultUrl = output.toString();
    }

    if (!resultUrl) {
      throw new Error("No image output returned from Google Nano Banana 2.");
    }

    return NextResponse.json({
      resultImage: resultUrl,
      provider: "Google Nano Banana 2 (Replicate)",
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
