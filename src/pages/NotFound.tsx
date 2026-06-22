import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-black text-emerald-600/20 select-none">404</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button size="lg"><Home size={16} className="mr-2" /> Go Home</Button>
          </Link>
          <Link to="/market">
            <Button variant="outline" size="lg"><Search size={16} className="mr-2" /> Browse Properties</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
