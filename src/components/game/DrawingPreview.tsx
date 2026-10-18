'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  EyeOff,
  CheckCircle2,
  Lock,
  PencilRuler,
  XCircle,
} from 'lucide-react';
import {
  DrawingPreviewData,
  GamePhase,
  PreviewAvailability,
  WordEntry,
} from '@/types/game';
import { localGameStorage } from '@/lib/storage';
import { findLocalSvgIllustration } from '@/lib/svg-illustrations';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface DrawingPreviewProps {
  wordEntry: WordEntry | null;
  phase: GamePhase;
  previewAvailability: PreviewAvailability;
}

function isPreviewMatchingWord(
  preview: DrawingPreviewData | null,
  wordEntry: WordEntry | null
): boolean {
  if (!preview || !wordEntry) return false;
  return (
    preview.word.trim().toLowerCase() ===
      wordEntry.word.trim().toLowerCase() &&
    preview.category.trim().toLowerCase() ===
      wordEntry.category.trim().toLowerCase()
  );
}

export function DrawingPreview({
  wordEntry,
  phase,
  previewAvailability,
}: DrawingPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<DrawingPreviewData | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const activeRequestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const latestWordEntryRef = useRef<WordEntry | null>(wordEntry);

  useEffect(() => {
    latestWordEntryRef.current = wordEntry;
  }, [wordEntry]);

  // Cancel any in-flight request when the component unmounts or wordEntry changes
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [wordEntry?.id, wordEntry?.word, wordEntry?.category]);

  const isCompetitiveActivePhase =
    phase === 'preparation' || phase === 'drawing' || phase === 'stealing';

  const isLockedBySetting =
    previewAvailability === 'disabled' ||
    (previewAvailability === 'before_timer' && isCompetitiveActivePhase);

  const fetchPreview = useCallback(
    async (entry: WordEntry, forceRefresh = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const requestId = ++activeRequestIdRef.current;
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setErrorMessage(null);

      if (!forceRefresh) {
        const cached = localGameStorage.getCachedPreview(
          entry.word,
          entry.category
        );
        if (cached && isPreviewMatchingWord(cached, entry)) {
          setPreviewData(cached);
          setFromCache(true);
          setIsLoading(false);
          return;
        }
      }

      // Clear any previous word's preview immediately so a stale image is never shown
      setPreviewData((prev) => (isPreviewMatchingWord(prev, entry) ? prev : null));
      setIsLoading(true);
      setFromCache(false);

      const isStillCurrentRequest = () => {
        const current = latestWordEntryRef.current;
        return (
          activeRequestIdRef.current === requestId &&
          !controller.signal.aborted &&
          current !== null &&
          current.word.trim().toLowerCase() ===
            entry.word.trim().toLowerCase() &&
          current.category.trim().toLowerCase() ===
            entry.category.trim().toLowerCase()
        );
      };

      try {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            word: entry.word,
            category: entry.category,
          }),
          signal: controller.signal,
        });

        const data = await response.json();

        if (!isStillCurrentRequest()) {
          return;
        }

        if (!response.ok || !data?.imageUrl) {
          throw new Error(
            data?.error ||
              `Could not generate an illustration for "${entry.word}".`
          );
        }

        const resolvedPreview: DrawingPreviewData = {
          word: entry.word,
          category: entry.category,
          imageUrl: data.imageUrl,
          source: data.source === 'gemini' ? 'gemini' : 'svg-fallback',
          modelUsed: data.modelUsed,
          drawingDescription:
            data.drawingDescription || entry.drawingDescription,
          drawingSteps:
            Array.isArray(data.drawingSteps) && data.drawingSteps.length > 0
              ? data.drawingSteps
              : entry.drawingSteps,
          cachedAt: Date.now(),
          notice: data.notice,
        };

        localGameStorage.saveCachedPreview(resolvedPreview);
        setPreviewData(resolvedPreview);
      } catch (err) {
        if (controller.signal.aborted || !isStillCurrentRequest()) {
          return;
        }

        // Only fall back to local SVG if an EXACT illustration exists for this word and category
        const exactLocalSvg = findLocalSvgIllustration(
          entry.word,
          entry.category
        );

        if (exactLocalSvg) {
          const fallbackPreview: DrawingPreviewData = {
            word: entry.word,
            category: entry.category,
            imageUrl: exactLocalSvg,
            source: 'svg-fallback',
            drawingDescription: entry.drawingDescription,
            drawingSteps: entry.drawingSteps,
            cachedAt: Date.now(),
            notice:
              'AI service unavailable — displaying exact built-in vector illustration for this word.',
          };
          localGameStorage.saveCachedPreview(fallbackPreview);
          setPreviewData(fallbackPreview);
        } else {
          // Never display an unrelated placeholder drawing if no exact match exists
          setPreviewData(null);
          setErrorMessage(
            err instanceof Error
              ? err.message
              : `Unable to generate an illustration for "${entry.word}". Click Retry Generation to try again.`
          );
        }
      } finally {
        if (isStillCurrentRequest()) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  const handleOpenPreview = () => {
    if (!wordEntry || isLockedBySetting) return;
    setIsOpen(true);
    fetchPreview(wordEntry, false);
  };

  if (!wordEntry) {
    return null;
  }

  // Guarantee we never render a stale preview from a previous word
  const validPreviewForCurrentWord = isPreviewMatchingWord(
    previewData,
    wordEntry
  )
    ? previewData
    : null;

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200/80 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
            {isLockedBySetting ? (
              <Lock className="w-5 h-5 text-slate-400" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Unsure How to Sketch This Word?
            </h3>
            {previewAvailability === 'disabled' ? (
              <p className="text-xs text-slate-500">
                Drawing previews are disabled in your current match settings.
              </p>
            ) : isLockedBySetting ? (
              <p className="text-xs text-slate-500">
                Locked during active countdown for fair play (available before
                clicking Done! or after the round).
              </p>
            ) : (
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <EyeOff className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  Drawer-only visual reference! Keep screen angled away from
                  guessing teammates.
                </span>
              </p>
            )}
          </div>
        </div>

        <Button
          variant="secondary"
          size="md"
          disabled={isLockedBySetting}
          onClick={handleOpenPreview}
          leftIcon={<Sparkles className="w-4 h-4 text-indigo-600" />}
          className="shrink-0"
        >
          Don&apos;t Know? Show Drawing Preview
        </Button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Drawing Preview: ${wordEntry.word}`}
        subtitle={`Category: ${wordEntry.category} • Visual reference for the drawing player only`}
        maxWidthClass="max-w-xl"
        footer={
          <div className="flex items-center justify-between w-full gap-3">
            <Button
              variant="secondary"
              size="sm"
              isLoading={isLoading}
              onClick={() => fetchPreview(wordEntry, true)}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Retry Generation
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsOpen(false)}
            >
              Close Preview
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Fair Play Warning Banner */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Game Integrity Notice:</strong> Shield your screen! Showing
              this preview to guessing teammates will give away the answer.
              Opening this preview does not affect points.
            </div>
          </div>

          {/* Illustration Canvas */}
          <div className="relative rounded-2xl border-2 border-slate-200 bg-slate-50 overflow-hidden aspect-4/3 flex items-center justify-center">
            {isLoading ? (
              <div className="text-center space-y-3 p-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mx-auto animate-pulse">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
                <p className="text-sm font-extrabold text-slate-800">
                  Generating Sketch Reference for &ldquo;{wordEntry.word}&rdquo;...
                </p>
                <p className="text-xs text-slate-500">
                  Creating a clean, family-friendly Pictionary illustration
                </p>
              </div>
            ) : validPreviewForCurrentWord ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={validPreviewForCurrentWord.imageUrl}
                  alt={`Drawing preview illustration for ${wordEntry.word}`}
                  className="w-full h-full object-contain p-2"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {fromCache && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-900/80 text-white backdrop-blur-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                      Cached
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/75 text-white backdrop-blur-xs">
                    {validPreviewForCurrentWord.source === 'gemini'
                      ? `Gemini AI (${
                          validPreviewForCurrentWord.modelUsed || 'Image'
                        })`
                      : 'Built-in Vector Sketch'}
                  </span>
                </div>
              </>
            ) : (
              /* Clear Error State & Retry Button when neither AI nor exact local illustration is available */
              <div className="text-center space-y-3 p-6 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <XCircle className="w-6 h-6" />
                </div>
                <p className="text-sm font-extrabold text-slate-900">
                  Preview Unavailable for &ldquo;{wordEntry.word}&rdquo;
                </p>
                <p className="text-xs text-slate-600">
                  {errorMessage ||
                    'Could not generate an exact illustration for this word.'}
                </p>
                <div className="pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => fetchPreview(wordEntry, true)}
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                  >
                    Retry Generation
                  </Button>
                </div>
              </div>
            )}
          </div>

          {validPreviewForCurrentWord?.notice && (
            <p className="text-[11px] text-slate-500 text-center italic">
              {validPreviewForCurrentWord.notice}
            </p>
          )}

          {/* Step-by-Step How to Draw Guide */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <PencilRuler className="w-4 h-4" />
              3-Step Quick Sketch Guide
            </h4>
            <p className="text-xs text-slate-600">
              {validPreviewForCurrentWord?.drawingDescription ||
                wordEntry.drawingDescription}
            </p>
            <ol className="space-y-1.5 text-xs text-slate-800 list-decimal list-inside font-medium">
              {(
                validPreviewForCurrentWord?.drawingSteps ||
                wordEntry.drawingSteps
              ).map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </Modal>
    </div>
  );
}
