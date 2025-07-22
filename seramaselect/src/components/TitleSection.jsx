
import React from 'react';

export default function TitleSection() {
  return (
    <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <p style={{ 
        fontSize: '1.2rem', 
        fontWeight: '500', 
        lineHeight: '1.6',
        margin: '0 auto 1.5rem',
        maxWidth: '600px',
        background: 'linear-gradient(135deg, #4a90e2, #357abd)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: 'none'
      }}>
        <strong>Master Your Serama Breeding</strong><br/>
        Instantly classify traits • Track every hatch • Build your champion flock<br/>
        <em>The only breeding companion you'll ever need</em>
      </p>
      <h1>Your Dashboard</h1>
    </section>
  );
}
