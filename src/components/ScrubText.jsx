import React from 'react';

const ScrubText = React.memo(function ScrubText({ text = '', className }) {
  if (!text) return null;

  const words = text.trim().split(/\s+/);

  return (
    <span className={className}>
      {words.map((word, idx) => (
        <React.Fragment key={idx}>
          <span data-scrub-word>{word}</span>
          {idx < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </span>
  );
});

export default ScrubText;
