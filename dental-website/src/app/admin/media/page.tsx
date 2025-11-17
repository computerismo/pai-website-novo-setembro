export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Mídia</h1>
        <p className="text-gray-600 mt-1">
          Gerencie imagens e arquivos do seu site
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload de Mídia
          </h3>
          <p className="text-gray-600 mb-6">
            O sistema de upload de mídia será implementado em breve. Por enquanto,
            você pode usar URLs diretas de imagens no editor de posts.
          </p>
          <div className="text-sm text-gray-500">
            Formatos suportados: JPG, PNG, GIF, WebP
          </div>
        </div>
      </div>
    </div>
  );
}
