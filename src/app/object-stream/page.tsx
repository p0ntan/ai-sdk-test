'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { notificationSchema } from '../api/use-object-stream/schema';
import { z } from 'zod';
import { useEffect, useState } from 'react';

export default function Page() {
  const { object, submit, isLoading } = useObject({
    api: '/api/use-object-stream',
    schema: notificationSchema,
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [input, setInput] = useState('');
  const [cards, setCards] = useState(Array(9).fill(null));

  useEffect(() => {
    if (object && !!object.notifications?.length) {
      setCards(prevCards => {
        const newCards = [...prevCards];
        object.notifications?.forEach((item, index) => {
          if (item) {
            newCards[index] = item;
          }
        });
        return newCards;
      });
    }
  }, [object]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);
    submit(input);
  };

  return (
    <div className='p-4'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {hasSubmitted && cards.map((notification, index: number) => (
            <div 
              key={index} 
              className={`
                bg-white rounded-lg shadow-md p-6 
                hover:shadow-lg transition-all duration-300
                ${!notification ? 'animate-pulse' : ''}
              `}
            >
              {notification ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{notification?.title}</h3>
                  <p className="text-gray-600 mb-4">{notification?.description}</p>
                  <div className="space-y-2">
                    {notification?.suggestions?.map((suggestion: string, idx: number) => (
                      suggestion && (
                        <p key={idx} className="text-sm text-gray-500 flex items-center">
                          {suggestion}
                        </p>
                      )
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </>
              )}
            </div>
        ))}
      </div>
      {!hasSubmitted && (
        <form onSubmit={handleSubmit} className='fixed bottom-4 flex flex-col w-full items-center'>
          <input
            className="dark:bg-zinc-900 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            value={input}
            placeholder="Enter your expertise..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
          Generate areas
        </button>
        </form>
      )}
    </div>
  );
}