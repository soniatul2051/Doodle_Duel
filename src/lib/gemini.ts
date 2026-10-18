import { GoogleGenAI } from '@google/genai';
import { findLocalSvgIllustration } from '@/lib/svg-illustrations';
import { WORD_BANK } from '@/lib/words';

export const DEFAULT_GEMINI_IMAGE_MODEL = 'imagen-4.0-generate-001';

export interface GeneratePreviewRequest {
  word: string;
  category?: string;
}

export interface GeneratePreviewResponse {
  word: string;
  category: string;
  imageUrl: string | null;
  source: 'gemini' | 'svg-fallback' | 'unavailable';
  modelUsed?: string;
  drawingDescription: string;
  drawingSteps: string[];
  notice?: string;
  error?: string;
}

export type SupportedImageModelKind = 'imagen' | 'gemini-image' | 'unsupported';

/**
 * Verifies whether a configured model name is a supported image-generation model
 * (either an Imagen model via generateImages or a Gemini image-generation model via generateContent).
 * Rejects text-only models so we never assume a text model will return an image.
 */
export function classifyImageModel(
  modelName?: string
): { kind: SupportedImageModelKind; resolvedModel: string } {
  const raw = (modelName || '').trim();
  const effective = raw || DEFAULT_GEMINI_IMAGE_MODEL;
  const lower = effective.toLowerCase();

  if (lower.startsWith('imagen-')) {
    return { kind: 'imagen', resolvedModel: effective };
  }

  // Gemini native image generation models include 'image' in their model identifier
  // (e.g., gemini-2.5-flash-image-preview, gemini-2.0-flash-preview-image-generation)
  if (lower.startsWith('gemini-') && lower.includes('image')) {
    return { kind: 'gemini-image', resolvedModel: effective };
  }

  return { kind: 'unsupported', resolvedModel: effective };
}

const AMBIGUOUS_WORD_MEANINGS: Record<string, Record<string, string>> = {
  bat: {
    animals:
      'a nocturnal flying mammal bat with leathery scalloped wings and pointed ears (NOT a baseball or cricket sports bat)',
    sports:
      'a wooden baseball or cricket sports bat used for hitting a ball (NOT the flying animal mammal)',
  },
  mouse: {
    animals:
      'a small furry rodent animal with round ears, whiskers, and a long tail (NOT a computer mouse)',
    technology:
      'a handheld computer mouse device with left/right click buttons and scroll wheel (NOT the rodent animal)',
  },
  crane: {
    animals:
      'a tall long-legged, long-necked wading bird (NOT a construction crane machine)',
    objects:
      'a tall mechanical construction crane with a lifting hook and boom arm (NOT the bird)',
  },
  apple: {
    'food and drinks':
      'a whole red orchard apple fruit with a short brown stem and a single green leaf (NOT a tech logo or orange)',
    technology:
      'a laptop or smartphone electronic device (without any trademarked logos)',
  },
};

export function getSemanticDisambiguation(
  word: string,
  category?: string
): string | null {
  const normWord = word.trim().toLowerCase();
  const normCat = (category || '').trim().toLowerCase();
  const entry = AMBIGUOUS_WORD_MEANINGS[normWord];
  if (!entry) return null;

  if (normCat && entry[normCat]) {
    return entry[normCat];
  }

  for (const [catKey, meaning] of Object.entries(entry)) {
    if (normCat.includes(catKey) || catKey.includes(normCat)) {
      return meaning;
    }
  }

  return null;
}

export interface PromptBuildInput {
  word: string;
  category?: string;
  hint?: string;
  drawingDescription?: string;
}

/**
 * Dedicated prompt-building function that produces precise, unambiguous
 * illustration instructions for the exact target Pictionary word.
 */
export function buildWordIllustrationPrompt({
  word,
  category,
  hint,
  drawingDescription,
}: PromptBuildInput): string {
  const cleanWord = word.trim();
  const cleanCategory = (category || 'General').trim();
  const disambiguation = getSemanticDisambiguation(cleanWord, cleanCategory);

  const matchedBankEntry =
    WORD_BANK.find(
      (w) =>
        w.word.toLowerCase() === cleanWord.toLowerCase() &&
        w.category.toLowerCase() === cleanCategory.toLowerCase()
    ) ??
    WORD_BANK.find((w) => w.word.toLowerCase() === cleanWord.toLowerCase());

  const effectiveDescription =
    drawingDescription || matchedBankEntry?.drawingDescription;
  const effectiveHint = hint || matchedBankEntry?.hint;

  const subjectLine = disambiguation
    ? `Subject: "${cleanWord}" in the "${cleanCategory}" category — specifically ${disambiguation}.`
    : `Subject: "${cleanWord}" (Category: ${cleanCategory}).`;

  const detailsLine = effectiveDescription
    ? `Visual details to depict clearly: ${effectiveDescription}`
    : effectiveHint
    ? `Meaning and key traits: ${effectiveHint}.`
    : `Depict the unmistakable defining visual traits of "${cleanWord}".`;

  return [
    `Create a single, clear, recognizable illustration of the exact Pictionary word "${cleanWord}".`,
    subjectLine,
    detailsLine,
    'Style requirements:',
    '- Colorful, friendly, hand-drawn cartoon illustration style with bold clean outlines and simple recognizable shapes.',
    '- Center the main subject and make it large, filling most of the frame.',
    '- Plain, solid white uncluttered background with zero background scenery clutter or unrelated objects.',
    '- STRICT RULE: Do NOT include any written words, letters, captions, labels, numbers, watermarks, or typography anywhere in the image.',
    '- Family-friendly party game illustration; do not use copyrighted character designs.',
  ].join('\n');
}

export const buildSafeIllustrationPrompt = (word: string, category?: string) =>
  buildWordIllustrationPrompt({ word, category });

/**
 * Extracts and validates base64 image data and MIME type from either
 * generateImages (Imagen) or generateContent (Gemini native image output).
 */
export function parseGeminiImageResponse(
  response: unknown
): { dataUri: string; mimeType: string } | null {
  if (!response || typeof response !== 'object') {
    return null;
  }

  // 1. Check Imagen generateImages response structure
  const maybeImagen = response as {
    generatedImages?: Array<{
      image?: { imageBytes?: string; mimeType?: string };
    }>;
  };

  const firstImagen = maybeImagen.generatedImages?.[0]?.image;
  if (
    firstImagen?.imageBytes &&
    typeof firstImagen.imageBytes === 'string' &&
    firstImagen.imageBytes.trim().length > 16
  ) {
    const mimeType = firstImagen.mimeType || 'image/png';
    return {
      dataUri: `data:${mimeType};base64,${firstImagen.imageBytes.trim()}`,
      mimeType,
    };
  }

  // 2. Check Gemini generateContent response structure
  const maybeContent = response as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          inlineData?: { data?: string; mimeType?: string };
        }>;
      };
    }>;
  };

  const parts = maybeContent.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const base64Data = part.inlineData?.data;
    if (
      base64Data &&
      typeof base64Data === 'string' &&
      base64Data.trim().length > 16
    ) {
      const mimeType = part.inlineData?.mimeType || 'image/png';
      return {
        dataUri: `data:${mimeType};base64,${base64Data.trim()}`,
        mimeType,
      };
    }
  }

  return null;
}

export async function generateWordIllustration(
  req: GeneratePreviewRequest
): Promise<GeneratePreviewResponse> {
  const cleanWord = req.word.trim();
  const cleanCategory = (req.category || 'General').trim();

  // Match word + category first so homographs ("Bat" in Animals vs Sports) get the right description
  const bankEntry =
    WORD_BANK.find(
      (w) =>
        w.word.toLowerCase() === cleanWord.toLowerCase() &&
        w.category.toLowerCase() === cleanCategory.toLowerCase()
    ) ??
    WORD_BANK.find((w) => w.word.toLowerCase() === cleanWord.toLowerCase());

  const drawingDescription =
    bankEntry?.drawingDescription ||
    `A simple, recognizable hand-drawn sketch of "${cleanWord}" focusing on its main silhouette and defining features.`;

  const drawingSteps = bankEntry?.drawingSteps || [
    `Start by sketching the main outline and basic geometric shapes of ${cleanWord}.`,
    'Add 2 or 3 signature details that distinguish it immediately.',
    'Use motion lines or simple context clues without writing any letters or numbers.',
  ];

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const configuredModel = process.env.GEMINI_IMAGE_MODEL?.trim();
  const { kind, resolvedModel } = classifyImageModel(configuredModel);

  const resolveLocalOrUnavailable = (reasonNotice: string): GeneratePreviewResponse => {
    const exactLocalSvg = findLocalSvgIllustration(cleanWord, cleanCategory);
    if (exactLocalSvg) {
      return {
        word: cleanWord,
        category: cleanCategory,
        imageUrl: exactLocalSvg,
        source: 'svg-fallback',
        drawingDescription,
        drawingSteps,
        notice: reasonNotice,
      };
    }

    return {
      word: cleanWord,
      category: cleanCategory,
      imageUrl: null,
      source: 'unavailable',
      drawingDescription,
      drawingSteps,
      error: `No exact local illustration is available for "${cleanWord}" and AI image generation is unavailable. ${reasonNotice}`,
    };
  };

  if (!apiKey) {
    return resolveLocalOrUnavailable(
      'Showing built-in vector sketch (GEMINI_API_KEY is not configured on the server).'
    );
  }

  if (kind === 'unsupported') {
    return resolveLocalOrUnavailable(
      `Configured model "${resolvedModel}" is a text-only or unsupported image model. Set GEMINI_IMAGE_MODEL to an image-capable model such as "${DEFAULT_GEMINI_IMAGE_MODEL}".`
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildWordIllustrationPrompt({
      word: cleanWord,
      category: cleanCategory,
      hint: bankEntry?.hint,
      drawingDescription,
    });

    if (kind === 'imagen') {
      const response = await ai.models.generateImages({
        model: resolvedModel,
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
        },
      });

      const parsed = parseGeminiImageResponse(response);
      if (parsed) {
        return {
          word: cleanWord,
          category: cleanCategory,
          imageUrl: parsed.dataUri,
          source: 'gemini',
          modelUsed: resolvedModel,
          drawingDescription,
          drawingSteps,
        };
      }
    } else if (kind === 'gemini-image') {
      const response = await ai.models.generateContent({
        model: resolvedModel,
        contents: prompt,
        config: {
          responseModalities: ['IMAGE', 'TEXT'],
        },
      });

      const parsed = parseGeminiImageResponse(response);
      if (parsed) {
        return {
          word: cleanWord,
          category: cleanCategory,
          imageUrl: parsed.dataUri,
          source: 'gemini',
          modelUsed: resolvedModel,
          drawingDescription,
          drawingSteps,
        };
      }
    }

    return resolveLocalOrUnavailable(
      'The configured Gemini model did not return image data. Showing built-in vector sketch preview instead.'
    );
  } catch {
    return resolveLocalOrUnavailable(
      'AI image generation request failed. Showing built-in vector sketch preview instead.'
    );
  }
}
