/** Footer component with attribution and accessibility links */
const Footer = () => (
  <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-auto" role="contentinfo">
    <div className="container mx-auto px-4">
      <div className="text-center mb-6 max-w-2xl mx-auto">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Our Mission: To empower every citizen with clear, unbiased, and accurate election information, fostering higher participation and combating democratic misinformation through AI technology.
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-6">
        <div className="flex items-center gap-2">
          <span className="bg-primary-600 text-white p-1 rounded text-xs font-bold">✓</span>
          <span>ElecGuide © {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            Powered by
            <strong className="text-gray-700 dark:text-gray-300">Google Gemini</strong>
            &
            <strong className="text-gray-700 dark:text-gray-300">Cloud Run</strong>
          </span>
        </div>
        <div className="text-xs">
          Built for the Election Education Initiative
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
