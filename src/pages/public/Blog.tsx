import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { blogPosts } from '../../data/blog';
import Card from '../../components/ui/Card';

export default function Blog() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Blog</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">Insights and guides for Kenya's property market.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post.slug}>
            <Card hover className="overflow-hidden h-full">
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full">{post.category}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                </div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white leading-tight">{post.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xs font-bold text-emerald-600">
                      {post.author[0]}
                    </div>
                    <span className="text-xs text-gray-500">{post.author}</span>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
