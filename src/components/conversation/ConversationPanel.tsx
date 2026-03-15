'use client';

import { useEffect } from 'react';
import { useConversationStore } from '@/store/conversationStore';
import { useConversation } from '@/hooks/useConversation';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { getNode } from '@/engine/engine';
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

  const currentNode = getNode(currentNodeId);
  const showTextInput = currentNode.allowFreeText && !inputDisabled && currentNodeId !== 'submitted';

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

      {showTextInput && (
        <div className="border-t border-gray-100/80 px-6 lg:px-12 xl:px-16 py-4 bg-white/80 backdrop-blur-sm">
          <div className="max-w-[640px] mx-auto">
            <TextInput
              placeholder={currentNode.freeTextPlaceholder || 'Type your answer...'}
              onSubmit={handleTextSubmit}
              disabled={inputDisabled}
            />
          </div>
        </div>
      )}
    </div>
  );
}
