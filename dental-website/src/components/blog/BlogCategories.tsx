import Link from 'next/link';
import { Tag } from 'lucide-react';

interface BlogCategoriesProps {
  categories: string[];
}

export function BlogCategories({ categories }: BlogCategoriesProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-16 relative bg-gradient-to-r from-blue-50/50 via-white to-teal-50/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-200 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-teal-200 rounded-full filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Categories Container with Backdrop Blur */}
        <div className="backdrop-blur-sm bg-white/80 border border-white/50 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                🏷️ Categorias
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Explore por Categoria
            </h2>
            <p className="text-gray-600 mt-2">
              Encontre artigos organizados por área de interesse
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog/categoria/${category.toLowerCase()}`}
                className="group bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-teal-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <span className="group-hover:scale-105 transition-transform inline-block">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}