"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCompanyId } from '@/lib/session';
import Navbar from '@/components/Navbar';

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const cid = getCompanyId();
    if (!cid) {
      router.push('/auth/login');
      return;
    }

    async function fetchFinance() {
      try {
        // Mock data for now as DB might not have full finance tables yet
        setBalance(1250.75);
        setTransactions([
          { id: 1, type: 'EARNED', amount: 74, note: 'عمولة توصيل شحنة #A823', date: '2026-03-15' },
          { id: 2, type: 'PAID', amount: 74, note: 'رسوم اشتراك الباقة الاحترافية', date: '2026-03-14' },
          { id: 3, type: 'EARNED', amount: 150, note: 'تنفيذ طلب تبادل #B442', date: '2026-03-12' },
        ]);
      } catch (err) {
        console.error('Failed to fetch finance:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFinance();
  }, [router]);

  return (
    <div className="industrial-grid" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      
      <main className="container" style={{ padding: '6rem 1rem' }}>
        <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }} className="flex-mobile-col">
          <div>
            <h2 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '0.2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>المحفظة الإلكترونية</h2>
            <h1 className="gradient-text hero-title" style={{ fontWeight: '900' }}>إدارة مستحقاتك</h1>
          </div>
          
          <div className="card glass" style={{ padding: '2rem', border: '1px solid var(--primary)', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '700' }}>رصيدك المتاح</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text)' }}>{balance} <small style={{ fontSize: '1rem' }}>ج.م</small></h2>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>شحن الرصيد</button>
          </div>
        </header>

        <section className="card glass" style={{ padding: '3rem', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2.5rem', color: 'var(--text)' }}>سجل العمليات المالية</h3>
          
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>جاري تحميل المعاملات...</p>
          ) : transactions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {transactions.map((tx) => (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid var(--border)', gap: '1rem' }} className="flex-mobile-col">
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: tx.type === 'EARNED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: tx.type === 'EARNED' ? '#22c55e' : '#ef4444'
                    }}>
                      <span className="material-symbols-outlined">{tx.type === 'EARNED' ? 'add_circle' : 'remove_circle'}</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text)' }}>{tx.note}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{tx.date}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ 
                      fontSize: '1.4rem', 
                      fontWeight: '800',
                      color: tx.type === 'EARNED' ? '#22c55e' : '#ef4444'
                    }}>
                      {tx.type === 'EARNED' ? '+' : '-'}{tx.amount} ج.م
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>لا توجد عمليات مالية سابقة</p>
          )}
        </section>
      </main>
    </div>
  );
}
