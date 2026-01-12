"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, FileText, ExternalLink } from "lucide-react";
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
          <div className="divide-y divide-slate-100">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="p-4 hover:bg-slate-50/80 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Post Info - Clickable to view post */}
                  <Link 
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* Thumbnail/Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-400 truncate max-w-[200px]">
                            /{post.slug}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-400">
                            {format(new Date(post.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Status & Stats */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Views */}
                    <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
                      <Eye className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-600">{post.views}</span>
                    </div>
                    
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
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

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Ver post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
