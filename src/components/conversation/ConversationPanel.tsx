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
  const { startConversation, handleChipSelect, handleTextSubmit, handleMultiSelect } = useConversation();

  const scrollRef = useAutoScroll([messages.length, isTyping]);

  useEffect(() => {
    if (!started) {
      startConversation();
    }
  }, [started, startConversation]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 lg:px-12 xl:px-16">
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
                  isLatest={isLatest}
                  isFirst={i === 0}
                />
              );
            }
            return <UserMessage key={msg.id} content={msg.content} />;
          })}

          {isTyping && <TypingIndicator />}

          {/* Bottom spacer for scroll comfort */}
          <div className="h-4" />
        </div>
      </div>

      {/* Always-on text input for conversational AI experience */}
      <div className="border-t border-gray-100/80 px-6 lg:px-12 xl:px-16 py-4 bg-white/80 backdrop-blur-sm">
        <div className="max-w-[640px] mx-auto">
          <TextInput
            placeholder={
              currentNodeId === 'submitted'
                ? 'Conversation complete'
                : inputDisabled
                  ? 'Thinking...'
                  : 'Type your message or select an option above...'
            }
            onSubmit={handleTextSubmit}
            disabled={inputDisabled || currentNodeId === 'submitted'}
          />
          {currentNodeId !== 'submitted' && (
            <p className="text-[11px] text-gray-350 mt-2 text-center">
              Powered by AI — you can type naturally or select from the options above
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
