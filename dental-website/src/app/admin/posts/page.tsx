"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import LoadingSpinner from "@/components/admin/LoadingSpinner";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  author: { name: string | null };
  views: number;
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este post?")) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        alert("Erro ao deletar post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Erro ao deletar post");
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Posts</h1>
          <p className="text-slate-500 mt-1">Gerencie seus posts do blog</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Post
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium text-slate-600"
          >
            <option value="all">Todos os Status</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
            <option value="scheduled">Agendados</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="text-slate-400 mt-4 text-sm">Carregando posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">Nenhum post encontrado</p>
            <p className="text-sm text-slate-400 mt-1">Crie seu primeiro post clicando em "Novo Post"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Visualizações
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </div>
                          <div className="text-sm text-slate-400">
                            /{post.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-lg ${
                          post.status === "published"
                            ? "bg-gradient-to-r from-emerald-400 to-green-500 text-white"
                            : post.status === "scheduled"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white"
                            : "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                        }`}
                      >
                        {post.status === "published"
                          ? "Publicado"
                          : post.status === "scheduled"
                          ? "Agendado"
                          : "Rascunho"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg w-fit">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{post.views}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {format(new Date(post.createdAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
