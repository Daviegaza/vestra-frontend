export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed">
        <p><strong>Last updated:</strong> June 2026</p>

        <p>Vestra ("we", "us", "our") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal data, in compliance with the <strong>Kenya Data Protection Act, 2019</strong> and the <strong>EU GDPR</strong>.</p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">1. Information We Collect</h2>
        <p><strong>Account Data:</strong> Full name, email address, phone number, national ID/passport (for KYC), role, location.</p>
        <p><strong>Transaction Data:</strong> Payment records, escrow transactions, M-Pesa references, rental payment history.</p>
        <p><strong>Property Data:</strong> Listings you create, verification documents uploaded, saved favorites, search history.</p>
        <p><strong>Communication Data:</strong> Messages between users, inquiry records, notifications.</p>
        <p><strong>Technical Data:</strong> IP address, device type, browser, usage patterns, session recordings (anonymized).</p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. How We Use Your Data</h2>
        <p>We use your data to provide and improve our services, verify identities (KYC), process payments, match buyers with properties, generate AI insights, prevent fraud, and communicate with you about your account and transactions.</p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3. Data Sharing</h2>
        <p>We share data with: financial partners (for escrow and payments), verification partners (for KYC and property verification), and law enforcement when required by Kenyan law. We do NOT sell your personal data to third parties.</p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">4. Data Storage & Security</h2>
        <p>Data is stored on secure servers with bank-grade encryption. We use AES-256 encryption for sensitive data, TLS for data in transit, and regular security audits. Your data is stored for as long as your account is active.</p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">5. Your Rights</h2>
        <p>Under the Kenya Data Protection Act, you have the right to: access your data, request correction of inaccurate data, request deletion of your data, object to processing, and data portability. Contact us at privacy@vestra.co.ke to exercise these rights.</p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">6. Cookies</h2>
        <p>We use essential cookies for authentication and session management. Analytics cookies help us improve the platform. You can control cookie preferences in your browser settings.</p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">7. Children's Privacy</h2>
        <p>Vestra is not intended for users under 18. We do not knowingly collect data from minors.</p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">8. Changes to This Policy</h2>
        <p>We may update this policy from time to time. We will notify users of material changes via email or platform notification.</p>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">9. Contact</h2>
        <p>For privacy-related inquiries, contact our Data Protection Officer at <a href="mailto:privacy@vestra.co.ke" className="text-emerald-600 hover:underline">privacy@vestra.co.ke</a> or the <strong>Office of the Data Protection Commissioner, Kenya</strong>.</p>
      </div>
    </div>
  );
}
