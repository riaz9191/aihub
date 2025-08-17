'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Code2, Image, Send, User, LoaderCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AiPage = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() && !isLoading) {
      const newMessages = [...messages, { role: 'user', content: input }];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: input }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from AI');
        }

        const data = await response.json();
        setMessages([...newMessages, { role: 'ai', content: data.text }]);
      } catch (error) {
        console.error(error);
        setMessages([
          ...newMessages,
          { role: 'ai', content: 'Sorry, something went wrong. Please try again.' },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-950 p-4 border-r dark:border-gray-800 hidden md:block">
        <h2 className="text-xl font-bold mb-4">Features</h2>
        <nav className="space-y-2">
          <Button variant="secondary" className="w-full justify-start">
            <Bot className="mr-2 h-4 w-4" />
            Chat
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Code2 className="mr-2 h-4 w-4" />
            Code Generation
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Image className="mr-2 h-4 w-4" />
            Image Analysis
          </Button>
        </nav>
      </aside>
      <main className="flex flex-col flex-1">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white flex-shrink-0">
                    <Bot className="h-6 w-6" />
                  </div>
                )}
                <div
                  className={`max-w-xl rounded-lg p-4 prose dark:prose-invert ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0">
                    <User className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white flex-shrink-0">
                        <LoaderCircle className="h-6 w-6 animate-spin" />
                    </div>
                    <div className="max-w-xl rounded-lg p-4 bg-gray-200 dark:bg-gray-800">
                        <p>Thinking...</p>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t dark:border-gray-800">
          <div className="flex items-center space-x-2 max-w-4xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiPage;
