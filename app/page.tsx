export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Investor Information Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A professional platform for managing investor information and
            documents securely and efficiently.
          </p>
        </div>

        <div className="border-t border-border pt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              Getting Started
            </h2>
            <p className="text-blue-800">
              The investor information form will be added here. This system will
              allow you to:
            </p>
            <ul className="mt-4 space-y-2 text-blue-800">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Collect and manage investor information
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Upload and store important documents
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-0.5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Track and organize investor data
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-sm text-gray-600">
                Enterprise-level security for sensitive investor data
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Organized</h3>
              <p className="text-sm text-gray-600">
                Keep all investor information in one centralized location
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Efficient</h3>
              <p className="text-sm text-gray-600">
                Streamlined workflows for managing investor relationships
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
