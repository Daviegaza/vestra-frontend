import { Shield, Users, TrendingUp, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Vestra</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We are building Kenya's most trusted property platform, using AI and blockchain technology to make real estate transactions safe, transparent, and efficient.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Property fraud affects thousands of Kenyans every year. Our mission is to eliminate property fraud by making verification accessible, affordable, and reliable for everyone. We combine AI-powered document analysis with blockchain-based title tracking to create an unbreakable chain of trust.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            A Kenya where every property transaction is secure, every title is verified, and every buyer has complete confidence. We envision a future where property ownership disputes are a thing of the past, and the real estate market operates with full transparency.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[
          { icon: Shield, title: 'Verification', desc: 'AI-powered document analysis and fraud detection' },
          { icon: Users, title: 'Trust', desc: 'Blockchain title tracking and transparent history' },
          { icon: TrendingUp, title: 'Growth', desc: 'Market insights and AI price estimation' },
          { icon: Globe, title: 'Coverage', desc: 'Serving all 47 counties across Kenya' },
        ].map((item) => (
          <div key={item.title} className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mx-auto">
              <item.icon size={24} className="text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="text-center bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Join Thousands of Satisfied Users</h2>
        <div className="grid grid-cols-3 gap-8 mt-8">
          {[
            { value: '50,000+', label: 'Registered Users' },
            { value: '12,000+', label: 'Properties Listed' },
            { value: 'KES 2B+', label: 'Fraud Prevented' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-emerald-600">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
