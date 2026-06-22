import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { getBlogPostBySlug, blogPosts } from '../../data/blog';
import Card from '../../components/ui/Card';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug || '');

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-emerald-600 hover:underline">Back to Blog</Link>
      </div>
    );
  }

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/blog" className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-6">
        <ArrowLeft size={16} /> Back to Blog
      </Link>

      <article>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full">{post.category}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.publishedAt).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>

        <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-8" />

        <div className="prose prose-gray dark:prose-invert max-w-none">
          {post.content.split('\n\n').map((para, i) => (
            <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{para.trim()}</p>
          ))}
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Related Articles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {related.map((rp) => (
            <Link to={`/blog/${rp.slug}`} key={rp.slug}>
              <Card hover className="p-4 space-y-2">
                <span className="text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 rounded-full">{rp.category}</span>
                <h4 className="font-medium text-gray-900 dark:text-white">{rp.title}</h4>
                <p className="text-xs text-gray-500">{rp.readTime}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
