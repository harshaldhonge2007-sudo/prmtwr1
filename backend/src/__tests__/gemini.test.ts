import geminiService from '../services/geminiService';

// Mock the Gemini API module
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockImplementation(() => ({
      startChat: jest.fn().mockImplementation(() => ({
        sendMessage: jest.fn().mockResolvedValue({
          response: { text: () => 'India follows a parliamentary democratic system with elections conducted by the Election Commission.' },
        }),
      })),
    })),
  })),
}));

describe('GeminiService', () => {
  describe('getChatResponse', () => {
    it('should return a response for a valid message', async () => {
      const response = await geminiService.getChatResponse('test-session', 'How do elections work?');
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should maintain separate sessions', async () => {
      const res1 = await geminiService.getChatResponse('session-a', 'Question 1');
      const res2 = await geminiService.getChatResponse('session-b', 'Question 2');
      expect(typeof res1).toBe('string');
      expect(typeof res2).toBe('string');
    });

    it('should handle API errors gracefully', async () => {
      jest.spyOn(geminiService, 'getChatResponse').mockRejectedValueOnce(
        new Error('API rate limit exceeded')
      );
      await expect(
        geminiService.getChatResponse('error-session', 'test')
      ).rejects.toThrow('API rate limit exceeded');
    });
  });
});
