import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!); 

// Helper function to analyze personality
async function getPersonality(prompt: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' })
        const personalityPrompt = `Analyze the following text and describe the author's personality and tone in 5 words or less: "${prompt}"`;
        const result = await model.generateContent(personalityPrompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Error getting personality:', error);
        return 'Default'; // Fallback personality
    }
}

// Helper function to convert a File object to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedData = Buffer.from(await file.arrayBuffer()).toString('base64');
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON for text-based features
    if (contentType.includes('application/json')) {
      const { prompt, feature, language } = await req.json();

      if (!prompt) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' })
      let finalPrompt = '';
      let text = '';

      switch (feature) {
        case 'chat':
          const personality = await getPersonality(prompt);
          finalPrompt = `System: Adopt this personality: [${personality}]. User: ${prompt}`;
          const result = await model.generateContent(finalPrompt);
          const response = await result.response;
          text = response.text();
          return NextResponse.json({ text, personality });

        case 'code':
          finalPrompt = `Generate a code snippet in ${language || 'javascript'} for the following request: ${prompt}`;
          const codeResult = await model.generateContent(finalPrompt);
          const codeResponse = await codeResult.response;
          text = codeResponse.text();
          return NextResponse.json({ text });

        case 'journal':
          finalPrompt = `You are a thoughtful journal analyzer. Read the following entry and provide: 1. A summary of the key events and feelings. 2. An analysis of the overall mood (e.g., happy, anxious, reflective). 3. For dreams, an interpretation of potential symbols and themes. Entry: ${prompt}`;
          const journalResult = await model.generateContent(finalPrompt);
          const journalResponse = await journalResult.response;
          text = journalResponse.text();
          return NextResponse.json({ text });

        case 'livecode':
          finalPrompt = `Generate a complete HTML file with embedded CSS and JavaScript for the following request: ${prompt}. The output should be only the HTML code.`;
          const livecodeResult = await model.generateContent(finalPrompt);
          const livecodeResponse = await livecodeResult.response;
          text = livecodeResponse.text();
          return NextResponse.json({ text });

        case 'story':
          finalPrompt = `Write a short story based on the following prompt: ${prompt}`;
          const storyResult = await model.generateContent(finalPrompt);
          const storyResponse = await storyResult.response;
          text = storyResponse.text();
          return NextResponse.json({ text });

        case 'recipe':
          finalPrompt = `I have the following ingredients: ${prompt}. Suggest a recipe I can make.`;
          const recipeResult = await model.generateContent(finalPrompt);
          const recipeResponse = await recipeResult.response;
          text = recipeResponse.text();
          return NextResponse.json({ text });

        case 'workout':
          finalPrompt = `Based on the following fitness goals: ${prompt}, create a personalized workout plan.`;
          const workoutResult = await model.generateContent(finalPrompt);
          const workoutResponse = await workoutResult.response;
          text = workoutResponse.text();
          return NextResponse.json({ text });

        case 'dream':
          // Placeholder for image generation. Replace with a real image generation API call.
          const imageUrl = `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(prompt)}`;
          return NextResponse.json({ imageUrl });

        case 'debugger':
          finalPrompt = `You are an expert code debugger. Analyze the following code snippet and provide a suggestion to fix the bug. Explain the bug and the fix. Code: ${prompt}`;
          const debuggerResult = await model.generateContent(finalPrompt);
          const debuggerResponse = await debuggerResult.response;
          text = debuggerResponse.text();
          return NextResponse.json({ text });

        default:
          return NextResponse.json({ error: `Unsupported feature: ${feature}` }, { status: 400 });
      }
    }
    // Handle multipart/form-data for image analysis
    else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const image = formData.get('image') as File | null;
      const prompt = formData.get('prompt') as string || 'Describe this image in detail.';

      if (!image) {
        return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
      }

      const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      const imagePart = await fileToGenerativePart(image);
      
      const result = await visionModel.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      return NextResponse.json({ text });
    }
    // Handle unsupported content types
    else {
        return NextResponse.json({ error: `Unsupported content-type: ${contentType}` }, { status: 415 });
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response from AI' },
      { status: 500 }
    );
  }
}