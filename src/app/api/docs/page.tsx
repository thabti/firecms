export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FireCMS API Documentation</h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore the FireCMS REST API using Swagger UI
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <a
                href="/api/openapi.yaml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download OpenAPI YAML
              </a>
              <a
                href="/api/openapi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download OpenAPI JSON
              </a>
            </div>
          </div>

          {/* Swagger UI iframe */}
          <div className="border rounded-lg overflow-hidden" style={{ height: "800px" }}>
            <iframe
              src={`https://petstore.swagger.io/?url=${typeof window !== 'undefined' ? window.location.origin : ''}/api/openapi.yaml`}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="API Documentation"
            />
          </div>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">API Endpoints</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>OpenAPI YAML:</strong> <code className="bg-blue-100 px-2 py-1 rounded">/api/openapi.yaml</code></p>
              <p><strong>OpenAPI JSON:</strong> <code className="bg-blue-100 px-2 py-1 rounded">/api/openapi</code></p>
              <p><strong>Base URL:</strong> <code className="bg-blue-100 px-2 py-1 rounded">/api</code></p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Block Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Text Block</h3>
                <p className="text-sm text-gray-600">Markdown-supported text content</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Heading Block</h3>
                <p className="text-sm text-gray-600">H1-H6 headings with customizable levels</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Image Block</h3>
                <p className="text-sm text-gray-600">Responsive images with multiple sizes</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">List Block</h3>
                <p className="text-sm text-gray-600">Ordered or unordered lists</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Quote Block</h3>
                <p className="text-sm text-gray-600">Blockquotes with optional author attribution</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Action Block</h3>
                <p className="text-sm text-gray-600">Buttons and links with styling options</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Video Block</h3>
                <p className="text-sm text-gray-600">YouTube video embeds with captions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
