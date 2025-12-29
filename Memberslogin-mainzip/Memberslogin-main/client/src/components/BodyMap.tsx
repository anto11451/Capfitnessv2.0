import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, PlayCircle, ExternalLink, Dumbbell } from 'lucide-react';
import { exercises } from '@/lib/mockData';

interface MuscleZone {
  id: string;
  name: string;
  path: string;
  labelX: number;
  labelY: number;
}

const MusclePath = ({ 
  zone, 
  isActive, 
  onClick
}: { 
  zone: MuscleZone;
  isActive: boolean; 
  onClick: (id: string) => void;
}) => (
  <motion.path
    d={zone.path}
    className={cn(
      "cursor-pointer transition-all duration-300 stroke-[1px]",
      isActive 
        ? "fill-primary/70 stroke-primary filter drop-shadow-[0_0_12px_rgba(0,255,157,0.8)]" 
        : "fill-white/10 stroke-white/30 hover:fill-primary/40 hover:stroke-primary/60"
    )}
    onClick={() => onClick(zone.id)}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.02 }}
  />
);

export default function BodyMap() {
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [view, setView] = useState<'front' | 'back'>('front');

  const frontMuscles: MuscleZone[] = [
    { id: 'chest', name: 'Chest', path: 'M120,95 C125,85 145,80 150,80 C155,80 175,85 180,95 L182,110 C182,120 175,130 150,130 C125,130 118,120 118,110 Z', labelX: 150, labelY: 105 },
    { id: 'shoulders', name: 'Shoulders', path: 'M100,80 C105,70 115,68 120,75 L125,95 L118,110 L105,105 L95,90 C95,85 97,82 100,80 Z M200,80 C195,70 185,68 180,75 L175,95 L182,110 L195,105 L205,90 C205,85 203,82 200,80 Z', labelX: 100, labelY: 90 },
    { id: 'biceps', name: 'Biceps', path: 'M95,110 L105,108 L108,140 C108,150 100,155 95,155 L88,140 Z M205,110 L195,108 L192,140 C192,150 200,155 205,155 L212,140 Z', labelX: 95, labelY: 130 },
    { id: 'forearms', name: 'Forearms', path: 'M88,145 L100,155 L98,190 C95,195 85,195 82,185 L78,160 Z M212,145 L200,155 L202,190 C205,195 215,195 218,185 L222,160 Z', labelX: 88, labelY: 170 },
    { id: 'abs', name: 'Abs', path: 'M135,132 L165,132 L168,180 C168,188 162,195 150,195 C138,195 132,188 132,180 Z', labelX: 150, labelY: 162 },
    { id: 'obliques', name: 'Obliques', path: 'M118,115 L135,130 L132,185 L120,180 L115,140 Z M182,115 L165,130 L168,185 L180,180 L185,140 Z', labelX: 120, labelY: 150 },
    { id: 'quads', name: 'Quads', path: 'M125,200 L145,198 L148,270 C148,280 140,285 132,285 L120,275 L118,230 Z M175,200 L155,198 L152,270 C152,280 160,285 168,285 L180,275 L182,230 Z', labelX: 135, labelY: 240 },
    { id: 'calves', name: 'Calves', path: 'M122,290 L138,288 L140,340 C140,348 132,352 125,350 L118,330 Z M178,290 L162,288 L160,340 C160,348 168,352 175,350 L182,330 Z', labelX: 130, labelY: 315 },
  ];

  const backMuscles: MuscleZone[] = [
    { id: 'traps', name: 'Traps', path: 'M130,55 L150,50 L170,55 L165,75 C160,80 155,82 150,82 C145,82 140,80 135,75 Z', labelX: 150, labelY: 65 },
    { id: 'back', name: 'Back', path: 'M118,80 L135,78 L150,82 L165,78 L182,80 L185,130 C185,145 175,155 150,155 C125,155 115,145 115,130 Z', labelX: 150, labelY: 115 },
    { id: 'reardelts', name: 'Rear Delts', path: 'M100,75 C105,68 115,66 120,72 L118,78 L105,82 L95,78 C95,76 97,74 100,75 Z M200,75 C195,68 185,66 180,72 L182,78 L195,82 L205,78 C205,76 203,74 200,75 Z', labelX: 100, labelY: 76 },
    { id: 'triceps', name: 'Triceps', path: 'M95,85 L105,82 L108,125 C108,135 100,142 92,138 L85,120 Z M205,85 L195,82 L192,125 C192,135 200,142 208,138 L215,120 Z', labelX: 95, labelY: 110 },
    { id: 'forearms', name: 'Forearms', path: 'M85,125 L95,140 L92,185 C88,192 78,190 75,180 L72,150 Z M215,125 L205,140 L208,185 C212,192 222,190 225,180 L228,150 Z', labelX: 85, labelY: 155 },
    { id: 'glutes', name: 'Glutes', path: 'M125,160 L150,158 L175,160 L180,195 C180,210 165,218 150,218 C135,218 120,210 120,195 Z', labelX: 150, labelY: 188 },
    { id: 'hamstrings', name: 'Hamstrings', path: 'M122,220 L145,218 L148,285 C145,295 135,298 125,295 L118,260 Z M178,220 L155,218 L152,285 C155,295 165,298 175,295 L182,260 Z', labelX: 135, labelY: 255 },
    { id: 'calves', name: 'Calves', path: 'M120,300 L138,298 L140,355 C138,362 128,365 122,360 L115,340 Z M180,300 L162,298 L160,355 C162,362 172,365 178,360 L185,340 Z', labelX: 130, labelY: 325 },
  ];

  const currentMuscles = view === 'front' ? frontMuscles : backMuscles;
  
  const getMuscleGroupName = (id: string): string => {
    const mappings: Record<string, string> = {
      'chest': 'Chest',
      'shoulders': 'Shoulders',
      'biceps': 'Biceps',
      'triceps': 'Triceps',
      'forearms': 'Forearms',
      'abs': 'Abs',
      'obliques': 'Obliques',
      'quads': 'Quads',
      'calves': 'Calves',
      'traps': 'Traps',
      'back': 'Back',
      'glutes': 'Glutes',
      'hamstrings': 'Hamstrings',
      'reardelts': 'Rear Delts',
    };
    return mappings[id] || id;
  };

  const selectedExercises = selectedMuscle 
    ? exercises.filter(e => e.muscleGroup.toLowerCase() === getMuscleGroupName(selectedMuscle).toLowerCase())
    : [];

  const selectedMuscleName = selectedMuscle ? getMuscleGroupName(selectedMuscle) : '';

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      
      <div className="flex-1 w-full relative min-h-[650px] flex flex-col items-center justify-center bg-gradient-to-b from-card/50 to-card/20 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-2xl">
        
        <div className="absolute top-6 right-6 flex gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10 z-10">
          <button 
            onClick={() => { setView('front'); setSelectedMuscle(null); }}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all",
              view === 'front' 
                ? "bg-primary text-black shadow-[0_0_15px_rgba(0,255,157,0.6)]" 
                : "text-muted-foreground hover:text-white hover:bg-white/10"
            )}
          >
            FRONT
          </button>
          <button 
            onClick={() => { setView('back'); setSelectedMuscle(null); }}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all",
              view === 'back' 
                ? "bg-primary text-black shadow-[0_0_15px_rgba(0,255,157,0.6)]" 
                : "text-muted-foreground hover:text-white hover:bg-white/10"
            )}
          >
            BACK
          </button>
        </div>

        <div className="relative h-[550px] w-[320px]">
          <svg viewBox="0 0 300 400" className="w-full h-full">
            <defs>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(40,40,50,0.9)" />
                <stop offset="100%" stopColor="rgba(20,20,25,0.95)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {view === 'front' ? (
              <path 
                d="M150,25 C165,25 175,35 175,50 C175,62 168,72 160,75 L165,78 C185,82 200,80 210,95 L220,115 L225,160 L220,195 C218,200 212,200 208,195 L200,155 L195,108 L182,110 L185,145 L180,200 L175,205 L180,280 L182,360 L175,375 L160,378 L152,290 L150,220 L148,290 L140,378 L125,375 L118,360 L120,280 L125,205 L120,200 L115,145 L118,110 L105,108 L100,155 L92,195 C88,200 82,200 80,195 L75,160 L80,115 L90,95 C100,80 115,82 135,78 L140,75 C132,72 125,62 125,50 C125,35 135,25 150,25 Z"
                fill="url(#bodyGradient)" 
                stroke="rgba(255,255,255,0.15)" 
                strokeWidth="1"
              />
            ) : (
              <path 
                d="M150,25 C165,25 175,35 175,50 C175,62 168,72 160,75 L165,78 C185,82 200,80 210,95 L220,115 L228,170 L222,200 C218,205 212,200 208,195 L200,150 L195,85 L182,82 L185,130 L180,160 L175,220 L180,295 L182,370 L175,385 L160,388 L152,305 L150,235 L148,305 L140,388 L125,385 L118,370 L120,295 L125,220 L120,160 L115,130 L118,82 L105,85 L100,150 L92,195 C88,200 82,205 78,200 L72,170 L80,115 L90,95 C100,80 115,82 135,78 L140,75 C132,72 125,62 125,50 C125,35 135,25 150,25 Z"
                fill="url(#bodyGradient)" 
                stroke="rgba(255,255,255,0.15)" 
                strokeWidth="1"
              />
            )}
            
            {currentMuscles.map((muscle) => (
              <MusclePath
                key={muscle.id + muscle.name}
                zone={muscle}
                isActive={selectedMuscle === muscle.id}
                onClick={setSelectedMuscle}
              />
            ))}
          </svg>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {currentMuscles.map((muscle) => (
            <button
              key={muscle.id + muscle.name}
              onClick={() => setSelectedMuscle(muscle.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                selectedMuscle === muscle.id
                  ? "bg-primary text-black border-primary shadow-[0_0_10px_rgba(0,255,157,0.5)]"
                  : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-white"
              )}
            >
              {muscle.name}
            </button>
          ))}
        </div>
        
        <p className="text-muted-foreground text-sm mt-4 font-mono tracking-wider">
          TAP A MUSCLE GROUP TO VIEW EXERCISES
        </p>
      </div>

      <AnimatePresence>
        {selectedMuscle && (
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className="w-full lg:w-[420px] bg-card/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 shadow-2xl lg:sticky lg:top-8 max-h-[650px] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Dumbbell className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-display font-bold text-white uppercase">{selectedMuscleName}</h2>
                </div>
                <p className="text-primary text-sm font-mono tracking-wider">{selectedExercises.length} EXERCISES AVAILABLE</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedMuscle(null)} className="hover:bg-white/10">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-3">
              {selectedExercises.length > 0 ? (
                selectedExercises.map((ex) => (
                  <Card key={ex.id} className="bg-black/50 border-white/10 p-4 hover:border-primary/50 transition-all group cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-white group-hover:text-primary transition-colors text-sm">{ex.name}</h4>
                        <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{ex.instructions}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full border",
                            ex.difficulty === 'Beginner' && "bg-green-500/10 text-green-400 border-green-500/30",
                            ex.difficulty === 'Intermediate' && "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
                            ex.difficulty === 'Advanced' && "bg-red-500/10 text-red-400 border-red-500/30"
                          )}>{ex.difficulty}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10">{ex.equipment}</span>
                        </div>
                      </div>
                      {ex.videoUrl && (
                        <a 
                          href={ex.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                        >
                          <PlayCircle className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    {ex.cues && ex.cues.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Key Cues:</p>
                        <div className="flex flex-wrap gap-1">
                          {ex.cues.slice(0, 3).map((cue, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary/80">{cue}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No exercises found for this muscle group.</p>
                </div>
              )}
            </div>

            {selectedExercises.length > 0 && (
              <Button className="w-full bg-primary text-black hover:bg-primary/90 font-bold tracking-wide mt-6 h-12">
                <Dumbbell className="w-4 h-4 mr-2" />
                GENERATE MINI-WORKOUT
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
