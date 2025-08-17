import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

    // Handle JSON for text-based features (chat, code)
    if (contentType.includes('application/json')) {
      const { prompt, feature, language } = await req.json();

      if (!prompt) {
        return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      let finalPrompt = prompt;
      if (feature === 'code') {
        finalPrompt = `Generate a code snippet in ${language || 'javascript'} for the following request: ${prompt}`;
      }

      const result = await model.generateContent(finalPrompt);
      const response = await result.response;
      const text = response.text();
      return NextResponse.json({ text });
    }
    // Handle multipart/form-data for image analysis
    else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const image = formData.get('image') as File | null;
      const prompt = formData.get('prompt') as string || 'Describe this image in detail.';

      if (!image) {
        return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      const imagePart = await fileToGenerativePart(image);
      
      const result = await model.generateContent([prompt, imagePart]);
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