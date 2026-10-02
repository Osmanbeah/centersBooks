import type { CenterFinancialSummary } from '../types';

export const exportCenterLedgerToCSV = (
  summaries: CenterFinancialSummary[],
  filenamePrefix = 'centers_financial_settlement'
): void => {
  if (!summaries || summaries.length === 0) {
    alert('No center data to export.');
    return;
  }

  const headers = [
    'Center Name',
    'Governorate',
    'City',
    'Contact Person',
    'Phone',
    'Books Delivered (Qty)',
    'Book Price (EGP)',
    'Book Center Cut (EGP)',
    'Books Net Due (EGP)',
    'Books Collected (EGP)',
    'Books Unpaid Balance (EGP)',
    'Codes Delivered (Qty)',
    'Code Price (EGP)',
    'Code Center Cut (EGP)',
    'Codes Net Due (EGP)',
    'Codes Collected (EGP)',
    'Codes Unpaid Balance (EGP)',
    'Total Gross Sales (EGP)',
    'Total Center Commissions (EGP)',
    'Combined Owner Net Due (EGP)',
    'Total Collected (EGP)',
    'Total Remaining Unpaid (EGP)'
  ];

  const escapeCSV = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = summaries.map(s => {
    const c = s.center;

    return [
      escapeCSV(c.name),
      escapeCSV(c.governorate),
      escapeCSV(c.city),
      escapeCSV(c.contact_person),
      escapeCSV(c.phone),
      escapeCSV(s.total_books_delivered),
      escapeCSV(c.book_price.toFixed(2)),
      escapeCSV(c.book_center_cut.toFixed(2)),
      escapeCSV(s.books_owner_net_due.toFixed(2)),
      escapeCSV(s.books_collected.toFixed(2)),
      escapeCSV(s.books_outstanding_balance.toFixed(2)),
      escapeCSV(s.total_codes_delivered),
      escapeCSV(c.code_price.toFixed(2)),
      escapeCSV(c.code_center_cut.toFixed(2)),
      escapeCSV(s.codes_owner_net_due.toFixed(2)),
      escapeCSV(s.codes_collected.toFixed(2)),
      escapeCSV(s.codes_outstanding_balance.toFixed(2)),
      escapeCSV(s.gross_total_revenue.toFixed(2)),
      escapeCSV(s.center_total_cut.toFixed(2)),
      escapeCSV(s.owner_net_due.toFixed(2)),
      escapeCSV(s.total_collected.toFixed(2)),
      escapeCSV(s.outstanding_balance.toFixed(2)),
    ].join(',');
  });

  // Include UTF-8 BOM for Excel compatibility
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
