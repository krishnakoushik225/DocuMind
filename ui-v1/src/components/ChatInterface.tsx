import React, { useState, useRef, useEffect } from 'react';
import { usePDF } from '@/context/PDFContext';
import { Send, RefreshCw, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { queryPDF } from '@/utils/pdfUtils';
import { toast } from 'sonner';
import LoadingDots from './LoadingDots';
import MessageItem, { Message } from './MessageItem';
import TypingIndicator from './TypingIndicator';
import TypingMessage from './TypingMessage';
import ThemeToggle from './ThemeToggle';

const ChatInterface: React.FC = () => {
  const { pdfText, pdfName, resetPdfContext, isProcessing: isPdfProcessing, setIsProcessing: setPdfProcessing } = usePDF();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Derived state to determine if the interface should be disabled
  const isInterfaceDisabled = isPdfProcessing || isMessageSending;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isInterfaceDisabled) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsMessageSending(true);
    
    try {
      // Show typing indicator
      setIsTyping(true);
      
      // Simulate delay for a more natural conversation flow
      const response = await new Promise<{response: string, retrieved_chunks: string[]}>(resolve => {
        setTimeout(async () => {
          const result = await queryPDF(userMessage.content, pdfName);
          resolve(result);
        }, 1200);
      });
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        role: 'assistant',
        timestamp: new Date(),
        referenceChunks: response.retrieved_chunks
      };
      
      // Set the typing message
      setTypingMessage(assistantMessage);
      
    } catch (error) {
      console.error('Error querying PDF:', error);
      toast.error('Failed to process your question', {
        description: 'Please try again later'
      });
      setIsTyping(false);
    } finally {
      setIsMessageSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    if (messages.length > 0) {
      const confirmed = window.confirm('Are you sure you want to start a new chat? Your current conversation will be lost.');
      if (!confirmed) return;
    }
    resetPdfContext();
    setMessages([]);
    setTypingMessage(null);
    setIsTyping(false);
  };

  const handleTypingComplete = () => {
    if (typingMessage) {
      setMessages(prev => [...prev, typingMessage]);
      setTypingMessage(null);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen gradient-bg">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      {/* Modern header with PDF info */}
      <div className="glass-panel border-b border-white/10 dark:border-slate-800/50 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Chat with PDF</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                {pdfName}
              </p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReset}
            className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            disabled={isInterfaceDisabled}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Message history */}
      <div className="flex-grow overflow-y-auto">
        {messages.length === 0 && !isTyping ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center animate-float">
                <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ready to chat!</h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md text-lg leading-relaxed mb-6">
              {isPdfProcessing ? 
                "Your PDF is being processed. This will just take a moment..." : 
                "Your PDF is ready! Ask any questions about its content and get intelligent answers."
              }
            </p>
            
            {isPdfProcessing ? (
              <div className="flex items-center space-x-3">
                <LoadingDots className="text-blue-600" />
                <span className="text-slate-600 dark:text-slate-400">Processing...</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center">
                <div className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
                  💡 Try asking "What is this document about?"
                </div>
                <div className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm">
                  🔍 "Summarize the key points"
                </div>
                <div className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm">
                  ❓ "Ask specific questions"
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="pb-24">
            {messages.map((message, index) => (
              <MessageItem 
                key={message.id} 
                message={message} 
                isLatest={index === messages.length - 1} 
              />
            ))}
            
            {isTyping && !typingMessage && <TypingIndicator />}
            
            {typingMessage && (
              <TypingMessage 
                message={typingMessage} 
                onComplete={handleTypingComplete} 
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Modern input area */}
      <div className="glass-panel border-t border-white/10 dark:border-slate-800/50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className={`glass-input rounded-2xl overflow-hidden flex items-end transition-all duration-200 ${isPdfProcessing ? 'opacity-70' : ''}`}>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isPdfProcessing ? "PDF is being processed..." : "Ask a question about your PDF..."}
              className="w-full resize-none p-4 focus:outline-none bg-transparent min-h-[60px] max-h-[200px] text-base placeholder:text-slate-500 dark:placeholder:text-slate-400"
              rows={1}
              disabled={isInterfaceDisabled}
            />
            <div className="p-3 flex-shrink-0">
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={!inputValue.trim() || isInterfaceDisabled}
                className="btn-primary h-12 w-12 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isMessageSending ? (
                  <LoadingDots color="bg-white" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Press Enter to send</span>
              <span>•</span>
              <span>Shift + Enter for new line</span>
            </div>
            <div>
              {isPdfProcessing 
                ? "Processing your PDF..." 
                : "AI responses based on your PDF content"
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
