import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Bot, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReferenceModal from './ReferenceModal';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  referenceChunks?: string[];
}

interface MessageItemProps {
  message: Message;
  isLatest: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isLatest }) => {
  const isUser = message.role === 'user';
  const [showReferences, setShowReferences] = useState(false);
  
  return (
    <div 
      className={cn(
        "py-8 flex animate-fade-in",
        isUser ? "bg-transparent" : "bg-white/30 dark:bg-slate-900/20 backdrop-blur-sm"
      )}
    >
      <div className="w-full max-w-4xl mx-auto flex gap-6 px-6">
        <div className="flex-shrink-0 mt-1">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
            isUser 
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white" 
              : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
          )}>
            {isUser ? (
              <User size={18} />
            ) : (
              <Bot size={18} />
            )}
          </div>
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="prose prose-slate dark:prose-invert max-w-none break-words">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20 dark:border-slate-700/50">
              <p className="whitespace-pre-line text-slate-900 dark:text-slate-100 leading-relaxed">{message.content}</p>
            </div>
            
            {/* {!isUser && message.referenceChunks && message.referenceChunks.length > 0 && (
              <div className="mt-4 flex">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-sm flex items-center gap-2 rounded-xl border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105"
                  onClick={() => setShowReferences(true)}
                >
                  <BookOpen size={16} />
                  <span>View Sources ({message.referenceChunks.length})</span>
                </Button>
              </div>
            )} */}
          </div>
        </div>
      </div>
      
      {!isUser && message.referenceChunks && (
        <ReferenceModal 
          isOpen={showReferences} 
          onClose={() => setShowReferences(false)} 
          chunks={message.referenceChunks} 
        />
      )}
    </div>
  );
};

export default MessageItem;
