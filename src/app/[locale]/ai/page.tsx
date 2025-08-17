'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Code2, Image, Send, User, LoaderCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Textarea } from '@/components/ui/textarea';

type Feature = 'chat' | 'code' | 'image';

type Message = {
  role: 'ai' | 'user';
  content: string;
  personality?: string;
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! How can I help you today?', personality: 'Default' },
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
      const newMessages: Message[] = [...messages, { role: 'user', content: input }];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: input, feature: 'chat' }),
        });

        if (!response.ok) throw new Error('Failed to get response from AI');

        const data = await response.json();
        setMessages([...newMessages, { role: 'ai', content: data.text, personality: data.personality }]);
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
    <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
              >
                {msg.role === 'ai' && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white flex-shrink-0">
                    <Bot className="h-6 w-6" />
                  </div>
                )}
                <div
                  className={`max-w-xl rounded-lg p-4 prose dark:prose-invert ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
                >
                  {msg.personality && (
                    <div className="text-xs font-mono p-1 bg-gray-300 dark:bg-gray-700 rounded-md mb-2 inline-block">
                      Personality: {msg.personality}
                    </div>
                  )}
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
    </div>
  );
};

const CodeGenerationInterface = () => {
    const [language, setLanguage] = useState('javascript');
    const [prompt, setPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState('// Your generated code will appear here');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateCode = async () => { 
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setGeneratedCode('// Generating code...');

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, language, feature: 'code' }),
            });

            if (!response.ok) throw new Error('Failed to generate code');

            const data = await response.json();
            setGeneratedCode(data.text);
        } catch (error) {
            console.error(error);
            setGeneratedCode('// Sorry, something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-4 space-y-4">
            <h3 className="text-2xl font-bold">Code Generation</h3>
            <div className="flex items-center space-x-2">
                <label htmlFor="language">Language:</label>
                <Input id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-48" />
            </div>
            <Textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the code you want to generate... (e.g., a React button component)"
                className="flex-1"
            />
            <Button onClick={handleGenerateCode} disabled={isLoading}>
                {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Code2 className="mr-2 h-4 w-4" />}
                Generate Code
            </Button>
            <ScrollArea className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-md p-4">
                <ReactMarkdown>{` \`\`\`${language}\n${generatedCode}\n\`\`\` `}</ReactMarkdown>
            </ScrollArea>
        </div>
    );
}

const ImageAnalysisInterface = () => {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [analysis, setAnalysis] = useState('Analysis will appear here.');
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAnalyze = async () => {
        if (!image || isLoading) return;

        setIsLoading(true);
        setAnalysis('Analyzing image...');

        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('prompt', prompt);

            const response = await fetch('/api/gemini', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to analyze image');

            const data = await response.json();
            setAnalysis(data.text);
        } catch (error) {
            console.error(error);
            setAnalysis('Sorry, something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-4 space-y-4">
            <h3 className="text-2xl font-bold">Image Analysis</h3>
            <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4">
                    <Input type="file" accept="image/*" onChange={handleImageChange} />
                    {imagePreview && (
                        <div className="flex-1 rounded-md overflow-hidden">
                            <img src={imagePreview} alt="Image preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col space-y-4">
                    <Textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Optional: Ask something specific about the image..."
                        className="flex-1"
                    />
                    <Button onClick={handleAnalyze} disabled={!image || isLoading}>
                        {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Image className="mr-2 h-4 w-4" />}
                        Analyze Image
                    </Button>
                </div>
            </div>
            <ScrollArea className="h-48 bg-gray-200 dark:bg-gray-800 rounded-md p-4">
                <ReactMarkdown>{analysis}</ReactMarkdown>
            </ScrollArea>
        </div>
    );
}

const AiPage = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>('chat');

  const renderFeature = () => {
    switch (activeFeature) {
      case 'chat':
        return <ChatInterface />;
      case 'code':
        return <CodeGenerationInterface />;
      case 'image':
        return <ImageAnalysisInterface />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-950 p-4 border-r dark:border-gray-800 hidden md:block">
        <h2 className="text-xl font-bold mb-4">Features</h2>
        <nav className="space-y-2">
          <Button variant={activeFeature === 'chat' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setActiveFeature('chat')}>
            <Bot className="mr-2 h-4 w-4" />
            Chat
          </Button>
          <Button variant={activeFeature === 'code' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setActiveFeature('code')}>
            <Code2 className="mr-2 h-4 w-4" />
            Code Generation
          </Button>
          <Button variant={activeFeature === 'image' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setActiveFeature('image')}>
            <Image className="mr-2 h-4 w-4" />
            Image Analysis
          </Button>
        </nav>
      </aside>
      <main className="flex flex-col flex-1">
        {renderFeature()}
      </main>
    </div>
  );
};

export default AiPage;