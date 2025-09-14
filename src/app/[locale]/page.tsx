'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Code2, BrainCircuit, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 z-10">
        <Link href="/home" className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-purple-500" />
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Gemini Nexus
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/ai">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
              Launch App <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative flex items-center justify-center h-[calc(100vh-5rem)] overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] animate-aurora"></div>
          <div className="container mx-auto px-4 text-center z-10">
            <div style={{ animationDelay: '0.2s' }} className="animate-fadeInUp">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-300 to-purple-400">
                Your Personal AI Universe
              </h1>
            </div>
            <div style={{ animationDelay: '0.4s' }} className="animate-fadeInUp">
              <p className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-gray-300">
                Experience the next generation of AI. Create, code, and converse with the most advanced models at your fingertips.
              </p>
            </div>
            <div style={{ animationDelay: '0.6s' }} className="animate-fadeInUp mt-10">
              <Link href="/ai">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-lg px-8 py-6 shadow-lg hover:shadow-purple-500/50 transition-shadow duration-300">
                  <Zap className="mr-3 h-6 w-6" />
                  Start Creating Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-black">
          <div className="container mx-auto px-4">
            <div style={{ animationDelay: '0.8s' }} className="animate-fadeInUp text-center">
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">
                A New Dimension of Features
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                Push the boundaries of what's possible.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[ 
                { icon: Bot, title: 'Advanced AI Chat', description: 'Engage in fluid, intelligent conversations that understand context and nuance.' },
                { icon: Code2, title: 'Live Code Generation', description: 'Generate production-ready code in any language, for any framework.' },
                { icon: BrainCircuit, title: 'Image Analysis', description: 'Upload an image and get detailed insights and descriptions in seconds.' },
              ].map((feature, i) => (
                <div key={i} style={{ animationDelay: `${1 + i * 0.2}s` }} className="animate-fadeInUp bg-gray-900/50 border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/60 hover:bg-gray-900/80 transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-gray-500">
        <p>&copy; 2025 Gemini Nexus. All rights reserved.</p>
      </footer>
    </div>
  );
}