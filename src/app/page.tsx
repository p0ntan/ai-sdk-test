'use client';
import { useChat } from '@ai-sdk/react';
import { marked } from 'marked';

const renderer = new marked.Renderer();

renderer.paragraph = (text) => {
  return `<p class="mb-2">${text.text}</p>`;
};

marked.setOptions({
  breaks: true,
  renderer,
});


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  
  return (
    <div className="flex flex-col w-full max-w-6xl py-12 mx-auto stretch h-[100vh]">
      <div className='flex-1 flex-grow min-h-0 overflow-y-auto scrollbar-hide'>
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justiy-start'} mb-4`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 whitespace-pre-wrap
                ${message.role === 'user' 
                  ? 'bg-blue-200 text-white rounded-br-lg' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-lg'
                }
              `}
            >
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div 
                        key={`${message.id}-${i}`}
                        className="prose prose-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: marked.parse(part.text)
                        }}
                      />
                    );
                }
              })}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className='flex-0'>
        <input
          className="dark:bg-zinc-900 w-full w-full p-2 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
