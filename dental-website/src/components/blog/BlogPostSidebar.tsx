import { BlogPost } from '@/lib/blog/posts';
import { Button } from '@/components/ui/Button';

interface BlogPostSidebarProps {
  post: BlogPost;
}

export function BlogPostSidebar({ post }: BlogPostSidebarProps) {
  return (
    <aside className="space-y-6 sticky top-8">
      {/* Author Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Sobre o Autor
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-medium">
              {post.author.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{post.author}</h4>
            <p className="text-xs text-gray-500">Especialista</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Especialista em odontologia com foco em bruxismo e DTM.
          Experiência comprovada em tratamentos inovadores.
        </p>
      </div>

      {/* CTA */}
      <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full filter blur-2xl opacity-50"></div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💬</span>
            <h3 className="font-semibold text-blue-900">Precisa de Ajuda?</h3>
          </div>

          <p className="text-blue-700 mb-6 text-sm leading-relaxed">
            Agende uma consulta gratuita com nossos especialistas e tire suas dúvidas
          </p>

          <div className="space-y-3">
            <Button variant="primary" size="sm" className="w-full bg-blue-500 hover:bg-blue-600 shadow-md">
              💬 Falar no WhatsApp
            </Button>
            <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
              📞 Ligar Agora
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs text-blue-600 text-center">
              ⚡ Resposta rápida garantida
            </p>
          </div>
        </div>
      </div>


    </aside>
  );
}