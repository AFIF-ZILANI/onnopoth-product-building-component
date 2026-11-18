'use client';

import { Printer } from 'lucide-react';

/** Prints the page — the browser's "Save as PDF" is available in the print dialog. */
export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-primary no-print">
      <Printer className="h-4 w-4" /> Print / Save as PDF
    </button>
  );
}
