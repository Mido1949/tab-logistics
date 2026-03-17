'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import { getCompanyId } from '@/lib/session';

export default function BatchOrderPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      parseFile(selected);
    }
  };

  const parseFile = (fileToParse) => {
    Papa.parse(fileToParse, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPreview(results.data.slice(0, 5)); // Show first 5 rows
      },
      error: (err) => {
        setErrorMsg('Error reading file: ' + err.message);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a file first.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccess(false);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const cid = getCompanyId();
          const payload = { 
             orders: results.data,
             originCompanyId: cid || null
          };

          const res = await fetch('/api/orders/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to upload batch orders.');
          
          setSuccess(true);
          setFile(null);
          setPreview([]);
          e.target.reset();
        } catch (err) {
          setErrorMsg(err.message);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <section className="glass animate-fade-in" style={{ padding: '2.5rem', borderRadius: '24px', maxWidth: '900px', margin: '2rem auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>رفع الطلبات مجمعاً (Batch Upload)</h2>
        <p style={{ color: 'var(--text-muted)' }}>قم برفع ملف CSV يحتوي على الأوردرات لإضافتها دفعة واحدة للنظام</p>
      </header>

      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', border: '1px solid var(--secondary)' }}>
          ✅ تم إضافة الطلبات بنجاح!
        </div>
      )}

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', textAlign: 'center', border: '1px solid #ef4444' }}>
          ❌ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ padding: '2rem', border: '2px dashed var(--border)', borderRadius: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <label style={{ display: 'block', marginBottom: '1rem', cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
            اختر ملف CSV
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
          </label>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {file ? file.name : 'أو قم بسحب وإسقاط الملف هنا'}
          </p>
        </div>

        {preview.length > 0 && (
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--background)', border: '1px solid var(--border)', overflowX: 'auto' }}>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>معاينة مبدئية (أول 5 صفوف):</h4>
            <table style={{ width: '100%', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {Object.keys(preview[0]).map(key => (
                    <th key={key} style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i !== preview.length -1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    {Object.values(row).map((val, idx) => (
                      <td key={idx} style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button 
            type="submit" 
            disabled={loading || !file}
            className="btn btn-primary" 
            style={{ padding: '1.2rem 4rem', fontSize: '1.2rem', opacity: (loading || !file) ? 0.5 : 1 }}
          >
            {loading ? 'جاري الرفع...' : 'رفع ومعالجة الطلبات'}
          </button>
        </div>
      </form>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
        <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>صيغة الأعمدة المطلوبة:</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          customerId, regionId, destinationCompanyId, price, productId, quantity, itemPrice
          <br/>
          <small>* إذا لم تضع destinationCompanyId سيتم إرساله لنظام الفرز الذكي تلقائياً.</small>
          <br/>
          <small>* معرّفات مثل regionId و customerId يمكن أن تكون أسماء عادية وسنحاول تحويلها تلقائياً خلف الكواليس.</small>
        </p>
      </div>

    </section>
  );
}
