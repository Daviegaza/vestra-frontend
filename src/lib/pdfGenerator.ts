import type { LeaseAgreement } from '../types';

interface SaleAgreement {
  propertyTitle: string;
  buyerName: string;
  sellerName: string;
  price: number;
  deposit: number;
  date: string;
}

export function generateLeasePDF(lease: LeaseAgreement): string {
  const content = `
LEASE AGREEMENT
===============

Date: ${new Date(lease.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
Reference: ${lease.id}

1. PARTIES
   Landlord: ${lease.landlordName}
   Tenant: ${lease.tenantName}
   Tenant Phone: ${lease.tenantPhone}
   Tenant Email: ${lease.tenantEmail}

2. PROPERTY
   Unit: ${lease.unitTitle}
   Address: ${lease.unitTitle}

3. TERMS
   Lease Period: ${new Date(lease.startDate).toLocaleDateString()} to ${new Date(lease.endDate).toLocaleDateString()}
   Monthly Rent: KES ${lease.rentAmount.toLocaleString('en-KE')}
   Security Deposit: KES ${lease.deposit.toLocaleString('en-KE')}

4. CONDITIONS
   ${lease.terms}

5. SIGNATURES
   Landlord: ${lease.signedByLandlord ? '✓ Signed' : '☐ Pending'}
   Tenant: ${lease.signedByTenant ? '✓ Signed' : '☐ Pending'}
   Status: ${lease.status}

This lease is governed by the laws of Kenya and any disputes shall be resolved in accordance with the Landlord and Tenant Act.
  `.trim();

  return downloadTextFile(content, `lease-${lease.id}.txt`, 'text/plain');
}

export function generateSaleAgreementPDF(agreement: SaleAgreement): string {
  const content = `
SALE AGREEMENT
==============

Date: ${agreement.date}

1. PARTIES
   Buyer: ${agreement.buyerName}
   Seller: ${agreement.sellerName}

2. PROPERTY
   ${agreement.propertyTitle}

3. FINANCIAL TERMS
   Purchase Price: KES ${agreement.price.toLocaleString('en-KE')}
   Deposit: KES ${agreement.deposit.toLocaleString('en-KE')} (${Math.round((agreement.deposit / agreement.price) * 100)}%)
   Balance: KES ${(agreement.price - agreement.deposit).toLocaleString('en-KE')}

4. CONDITIONS PRECEDENT
   - Title deed verification
   - Land rates clearance
   - Spousal consent (if applicable)
   - Land Control Board consent (if agricultural land)
   - Physical inspection of property

5. SIGNATURES
   This agreement is subject to the laws of the Republic of Kenya.
   Both parties acknowledge receipt and understanding of these terms.
  `.trim();

  return downloadTextFile(content, `sale-agreement-${agreement.propertyTitle.toLowerCase().replace(/\s+/g, '-')}.txt`, 'text/plain');
}

export function generateReceiptPDF(receipt: {
  id: string;
  unitTitle: string;
  amount: number;
  period: string;
  paidAt: string;
  paymentMethod: string;
  mpesaRef?: string;
}): string {
  const content = `
RENT RECEIPT
============

Receipt No: ${receipt.id}
Date: ${new Date(receipt.paidAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}

Property: ${receipt.unitTitle}
Period: ${receipt.period}
Amount Paid: KES ${receipt.amount.toLocaleString('en-KE')}
Payment Method: ${receipt.paymentMethod}
${receipt.mpesaRef ? `M-Pesa Reference: ${receipt.mpesaRef}` : ''}

This receipt serves as proof of payment for the period stated above.
Issued by Vestra Properties Platform.
  `.trim();

  return downloadTextFile(content, `receipt-${receipt.id}.txt`, 'text/plain');
}

function downloadTextFile(content: string, filename: string, mimeType: string): string {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return url;
}
