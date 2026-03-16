'use client';

import { useEffect } from 'react';
import { useConversationStore } from '@/store/conversationStore';
import { useConversation } from '@/hooks/useConversation';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { BotMessage } from './BotMessage';
import { UserMessage } from './UserMessage';
import { TypingIndicator } from './TypingIndicator';
import { TextInput } from './TextInput';

export function ConversationPanel() {
  const { messages, isTyping, inputDisabled, started, currentNodeId } = useConversationStore();
  const { startConversation, handleChipSelect, handleTextSubmit, handleMultiSelect, handleServiceConfirm } = useConversation();

  const scrollRef = useAutoScroll([messages.length, isTyping]);

  useEffect(() => {
    if (!started) {
      startConversation();
    }
  }, [started, startConversation]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 lg:px-12 xl:px-16" role="log" aria-live="polite" aria-label="Conversation">
        <div className="max-w-[640px] mx-auto py-8 lg:py-12">
          {messages.map((msg, i) => {
            const isLatest = i === messages.length - 1 && !isTyping;
            if (msg.role === 'bot') {
              return (
                <BotMessage
                  key={msg.id}
                  message={msg}
                  onChipSelect={isLatest ? handleChipSelect : undefined}
                  onMultiSelect={isLatest ? handleMultiSelect : undefined}
                  onServiceConfirm={isLatest ? handleServiceConfirm : undefined}
                  isLatest={isLatest}
                  isFirst={i === 0}
                />
              );
            }
            return <UserMessage key={msg.id} content={msg.content} />;
          })}

          {isTyping && <TypingIndicator />}

          {/* Bottom spacer — extra on mobile for fixed input bar */}
          <div className="h-20 md:h-4" />
        </div>
      </div>

      {/* Text input — fixed to bottom on mobile, normal flow on md+ */}
      <div
        className="border-t border-gray-100/80 bg-white px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] fixed bottom-0 left-0 right-0 z-30 md:relative md:bottom-auto md:left-auto md:right-auto md:z-auto md:py-4 md:pb-4 lg:px-12 xl:px-16"
      >
        <div className="max-w-[640px] mx-auto">
          <TextInput
            placeholder={
              currentNodeId === 'submitted'
                ? 'Conversation complete'
                : inputDisabled
                  ? 'Thinking...'
                  : 'Type your message or select an option..'
            }
            onSubmit={handleTextSubmit}
            disabled={inputDisabled || currentNodeId === 'submitted'}
          />
          {currentNodeId !== 'submitted' && (
            <p className="text-[11px] text-gray-350 mt-2 text-center hidden md:block">
              You can type naturally or select from the options above
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
