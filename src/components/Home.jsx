import React from 'react';

function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Homepage</h1>
      <p>This is a project for CPSC 362!!</p>

      {/*Container for deck preview thing*/}
      <h2>Popular Decks...</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column', 
          gap: '12px'
        }}
      >
        <div
          style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              border: '1px solid #ccc',
              borderRadius: '8px'
          }}
        >
          <h3>Title</h3>
          <p>Description</p>
          <p>0</p>
        </div>
        
        <div
          style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              border: '1px solid #ccc',
              borderRadius: '8px'
          }}
        >
          <h3>Title</h3>
          <p>Description</p>
          <p>0</p>
        </div>
        
        <div
          style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              border: '1px solid #ccc',
              borderRadius: '8px'
          }}
        >
          <h3>Title</h3>
          <p>Description</p>
          <p>0</p>
        </div>
      </div>
    </div>
  );
}

export default Home;