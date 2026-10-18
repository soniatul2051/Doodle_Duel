'use client';

import React from 'react';
import {
  CheckCircle2,
  Flame,
  EyeOff,
  Timer,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface GameRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GameRulesModal({ isOpen, onClose }: GameRulesModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How to Play Doodle Duel"
      subtitle="Official party rules, turn flow, and team steal scoring"
      maxWidthClass="max-w-2xl"
      footer={
        <Button variant="primary" onClick={onClose}>
          Got It, Let&apos;s Play!
        </Button>
      }
    >
      <div className="space-y-5 text-sm text-slate-700">
        <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/70">
          <h3 className="font-extrabold text-indigo-950 flex items-center gap-2 text-base">
            <Timer className="w-5 h-5 text-indigo-600" />
            1. Round Setup &amp; Secret Word Lock
          </h3>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside text-slate-700">
            <li>
              On <strong>Team A&apos;s turn</strong>, one member of Team A is
              chosen to draw and the remaining members of Team A are the primary
              guessers.
            </li>
            <li>
              The drawing player clicks <strong>Generate Word</strong> and views
              the secret word privately.
            </li>
            <li>
              If the drawing player doesn&apos;t know what the word looks like,
              they can click{' '}
              <strong>&ldquo;Don&apos;t Know? Show Drawing Preview&rdquo;</strong>.
            </li>
            <li>
              The timer does <strong>not</strong> start until the drawing player
              clicks <strong>&ldquo;I Know This Word — Done!&rdquo;</strong>.
            </li>
          </ol>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/70">
          <h3 className="font-extrabold text-emerald-950 flex items-center gap-2 text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            2. Team-Based Guessing &amp; Steal Rules
          </h3>
          <ul className="mt-2 space-y-2 text-slate-700">
            <li>
              <strong>Primary Turn (Drawing Team Guesses First):</strong> On{' '}
              <em>Team A&apos;s</em> turn, a member of <em>Team A</em> draws and
              the other members of <em>Team A</em> must guess first.{' '}
              <em>Team B</em> may <strong>not</strong> guess during the primary
              timer. If <em>Team A</em> guesses correctly within the timer,
              click <strong>Correct Guess!</strong> to award <strong>+1 point to Team A</strong>.
            </li>
            <li>
              <strong>Opposing Team Steal Opportunity:</strong> If{' '}
              <em>Team A</em> fails to guess or the primary timer expires,{' '}
              <em>Team B</em> gets a <strong>Steal Opportunity</strong> (default
              15s). If <em>Team B</em> guesses correctly during the steal phase,{' '}
              <strong>Team B earns +1 point</strong>!
            </li>
            <li>
              <strong>Nobody Guesses It:</strong> If both the active team and
              the opposing stealing team fail, <strong>0 points</strong> are
              awarded (&ldquo;No points this round&rdquo;) and turns rotate so{' '}
              <em>Team B</em> draws &amp; guesses next round.
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70">
            <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-600" />
              Fair Play Rules
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              The drawing player personally cannot guess their own word — only
              their teammates may guess during the primary phase.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-slate-700" />
              Sketch Rules &amp; Privacy
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              No letters, numbers, or spoken clues! Keep the screen angled away
              from guessers when viewing the Secret Word or Drawing Preview.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
          <Trophy className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            Drawing turns rotate automatically after every round until all
            configured rounds are completed.
          </span>
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 ml-auto" />
        </div>
      </div>
    </Modal>
  );
}
