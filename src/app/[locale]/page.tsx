import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Code2, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            AI Nexus
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/ai">
            <Button>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-24 md:py-32 lg:py-40">
          <div className="absolute inset-0 -z-10 bg-gray-50 dark:bg-gray-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-gray-900 dark:text-gray-100">
              Welcome to the Future of AI
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Unleash your creativity with a suite of powerful AI tools. From
              code generation to content creation, we have you covered.
            </p>
            <div className="mt-8">
              <Link href="/ai">
                <Button size="lg">
                  Start Creating <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                Features
              </h2>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Everything you need in one place
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <Bot className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  AI Chat
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Engage in intelligent conversations with our advanced AI chat.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Code Generation
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Generate code in any language with a simple prompt.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  And Much More
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Explore a growing list of features to boost your productivity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2025 AI Nexus. All rights reserved.</p>
      </footer>
    </div>
  );
}