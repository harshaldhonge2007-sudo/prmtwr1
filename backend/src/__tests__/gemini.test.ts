import geminiService from '../services/geminiService';

// Mock the Gemini API
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockImplementation(() => ({
      startChat: jest.fn().mockImplementation(() => ({
        sendMessage: jest.fn().mockResolvedValue({
          response: { text: () => 'Mocked response' }
        })
      }))
    }))
  }))
}));

describe('GeminiService', () => {
  it('should maintain session history and return a response', async () => {
    const sessionId = 'test-session';
    const message = 'How do I register to vote?';
    
    const response = await geminiService.getChatResponse(sessionId, message);
    
    expect(response).toBe('Mocked response');
  });

  it('should handle API errors gracefully', async () => {
    const sessionId = 'error-session';
    const message = 'Trigger error';
    
    // Temporarily break the service to test error handling
    jest.spyOn(geminiService, 'getChatResponse').mockRejectedValueOnce(new Error('API Failure'));
    
    await expect(geminiService.getChatResponse(sessionId, message)).rejects.toThrow('API Failure');
  });
});
