import React from 'react';

export default function QuotationCard({ items = [], quotation = null, fileName, onBack }) {
  // fallback sample when no server response
  const fallbackItems = items && items.length ? items : [{ name: 'Work Chair', qty: 6, unitPrice: 2500 }, { name: 'Work Table', qty: 1, unitPrice: 12000 }];
  const q = quotation || {
    currency: 'INR',
    subtotal: fallbackItems.reduce((s, it) => s + (it.qty * (it.unitPrice || it.unit || 0)), 0),
    taxes: Math.round(0.18 * fallbackItems.reduce((s, it) => s + (it.qty * (it.unitPrice || it.unit || 0)), 0)),
    total: 0
  };
  q.total = q.subtotal + (q.taxes || 0);

  return (
    <div className="panel">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>Quotation</h2>
        <div>
          <button className="ghost" onClick={onBack}>Back</button>
        </div>
      </div>

      <div className="muted">Source: {fileName || 'uploaded document'}</div>

      <div className="quotation-list">
        {(items && items.length ? items : fallbackItems).map((it, idx) => (
          <div className="quote-row" key={idx}>
            <div>
              <div className="quote-name">{it.name}</div>
              <div className="muted">Qty: {it.qty} • Unit price: {it.unitPrice ? it.unitPrice.toLocaleString() : (it.unit || '-')}</div>
            </div>
            <div className="quote-amount">{(it.qty * (it.unitPrice || it.unit || 0)).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="quote-summary">
        <div className="flex-between"><div>Subtotal</div><div>{q.subtotal.toLocaleString()}</div></div>
        <div className="flex-between"><div>Taxes</div><div>{q.taxes.toLocaleString()}</div></div>
        <div className="flex-between total"><div>Total</div><div>{q.currency} {q.total.toLocaleString()}</div></div>
      </div>

      <div style={{marginTop:12,display:'flex',gap:8}}>
        <button className="primary">Approve & Add to ERP</button>
        <button className="ghost">Download PDF</button>
      </div>
    </div>
  );
}
