import React from 'react';
import { X, BookOpen, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  chunks: string[];
}

const ReferenceModal: React.FC<ReferenceModalProps> = ({ isOpen, onClose, chunks }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm" onClick={onClose}>
      <div 
        className="glass-panel rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl animate-slide-in-right border border-white/20 dark:border-slate-700/50" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">Source References</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Excerpts used to generate this response</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-12rem)]">
          {chunks.length > 0 ? (
            <div className="space-y-4">
              {chunks.map((chunk, index) => (
                <div 
                  key={index} 
                  className="p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl text-sm border border-white/20 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Quote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">{chunk}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">No references available</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 dark:border-slate-700/50 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            These excerpts from the document were used to generate the AI response
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceModal; 