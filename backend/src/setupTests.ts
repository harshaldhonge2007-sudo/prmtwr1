// Global Jest Setup
jest.mock('./services/geminiService', () => ({
  getChatResponse: jest.fn().mockResolvedValue('This is a mock response for testing.'),
  initializeModel: jest.fn(),
}));

// Mock the environment variable for testing
process.env.GEMINI_API_KEY = 'test-api-key';
