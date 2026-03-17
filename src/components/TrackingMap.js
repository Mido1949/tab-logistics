"use client";
import React, { useState, useEffect } from 'react';

export default function TrackingMap({ order }) {
  if (!order) return null;
  
  // Simulate current position based on status
  const statuses = ['PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
  const index = statuses.indexOf(order.status);
  const progress = index === -1 ? 0 : (index / (statuses.length - 1)) * 100;

  return (
    <div className="card glass" style={{ padding: '2rem', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>near_me</span> تتبع الموقع المباشر
      </h3>

      {/* Industrial Grid Background for the "Map" area */}
      <div style={{ 
        position: 'relative', 
        height: '180px', 
        background: 'rgba(0,0,0,0.2)', 
        borderRadius: '16px', 
        border: '1px solid var(--border)',
        padding: '0 10%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
        
        {/* Origin */}
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--surface)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            <span className="material-symbols-outlined">home</span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>نقطة الاستلام</span>
        </div>

        {/* Progress Line */}
        <div style={{ flex: 1, height: '4px', background: 'var(--border)', margin: '0 1rem', position: 'relative', borderRadius: '4px' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: 'var(--primary)', borderRadius: '4px', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 0 10px var(--primary)' }}></div>
          
          {/* Mandoob Icon */}
          <div style={{ 
            position: 'absolute', 
            left: `${progress}%`, 
            top: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '45px', 
            height: '45px', 
            background: 'var(--primary)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white',
            boxShadow: '0 0 20px var(--primary)',
            transition: 'left 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 2
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.8rem' }}>local_shipping</span>
          </div>
        </div>

        {/* Destination */}
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--surface)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <span className="material-symbols-outlined">location_on</span>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>نقطة التسليم</span>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>الموقع الحالي:</p>
          <p style={{ fontSize: '1.1rem', fontWeight: '800' }}>{order.status === 'DELIVERED' ? 'تم الوصول للوجهة' : order.status === 'IN_TRANSIT' ? 'بين السرايات، الجيزة' : 'في انتظار التحرك'}</p>
        </div>
        <div className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>sensors</span> بث حي
        </div>
      </div>
    </div>
  );
}
