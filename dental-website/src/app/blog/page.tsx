import { getAllPosts, getFeaturedPosts, getAllCategories } from '@/lib/blog/posts';
import { Navigation } from '@/components/shared/Navigation';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogHero } from '@/components/blog/BlogHero';
import { BlogCategories } from '@/components/blog/BlogCategories';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Clínica Odontológica',
  description: 'Artigos sobre saúde bucal, tratamento de bruxismo, dicas de cuidados dentários e novidades da odontologia.',
  keywords: ['blog odontológico', 'saúde bucal', 'bruxismo', 'dicas dentárias'],
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  const categories = getAllCategories();

  return (
    <>
      <Navigation />
      <main>
        <BlogHero />

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-white to-blue-50/30 relative border-b border-blue-100/50">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-block mb-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100">
                    ⭐ Em Destaque
                  </span>
                </div>
                <h2 className="text-4xl font-bold mb-4 text-gray-900">
                  Artigos em Destaque
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Nossos conteúdos mais importantes sobre saúde bucal e tratamento de bruxismo
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} featured />
                ))}
              </div>
            </div>

            {/* Bottom Decorative Line */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
          </section>
        )}

        {/* Categories */}
        <BlogCategories categories={categories} />

        {/* All Posts */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative border-t border-gray-100/50">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  📚 Biblioteca
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Todos os Artigos
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore nossa coleção completa de artigos sobre saúde bucal e odontologia
              </p>
            </div>

            {allPosts.length > 0 ? (
              <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full filter blur-2xl"></div>
                  <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-200 rounded-full filter blur-2xl"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                  {allPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Artigos em Breve
                  </h3>
                  <p className="text-gray-600">
                    Estamos preparando conteúdo exclusivo sobre saúde bucal e bruxismo.
                    Volte em breve para conferir nossas publicações!
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-700 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300 rounded-full filter blur-3xl translate-y-48 -translate-x-48"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-4xl mx-auto">
              <div className="inline-block mb-6">
                <span className="text-sm font-medium text-blue-100 bg-blue-500 px-4 py-2 rounded-full">
                  💌 Newsletter
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Receba Nossas Dicas de Saúde Bucal
              </h2>

              <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Inscreva-se para receber artigos exclusivos, dicas importantes sobre cuidados dentários
                e novidades sobre tratamento de bruxismo
              </p>

              <div className="max-w-lg mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      placeholder="Seu melhor email"
                      className="flex-1 px-6 py-4 rounded-lg text-gray-900 bg-gray-50 border-2 border-transparent focus:outline-none focus:ring-0 focus:border-blue-500 transition-colors placeholder-gray-500"
                    />
                    <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
                      Inscrever-se
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    📧 Enviamos apenas conteúdo de qualidade • 🔒 Seus dados estão seguros
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}