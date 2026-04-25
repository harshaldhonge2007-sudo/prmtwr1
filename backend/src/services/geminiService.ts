import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: 'You are ElecGuide, a professional expert on Indian elections. Be concise and factual.'
      });
    }
  }

  async getChatResponse(prompt: string) {
    if (!this.model) return null;
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini Service Error:', error);
      return null;
    }
  }
}

export default new GeminiService();
