import React from 'react';

function DeckPreview({title, desc, count}){
    return (
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
          <h3>{title}</h3>
          <p>{desc}</p>
          <p>{count}</p>
        </div>
    );
}

export default DeckPreview;