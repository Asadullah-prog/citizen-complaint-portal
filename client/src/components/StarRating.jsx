import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 0, onChange = null, readOnly = false, size = 20 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const currentDisplay = hoverRating || rating || 0;

  return (
    <div className="star-rating" onMouseLeave={() => !readOnly && setHoverRating(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= currentDisplay;
        return (
          <Star
            key={star}
            size={size}
            className={`star-icon ${isFilled ? 'star-filled' : 'star-empty'}`}
            onClick={() => {
              if (!readOnly && onChange) {
                onChange(star);
              }
            }}
            onMouseEnter={() => {
              if (!readOnly) {
                setHoverRating(star);
              }
            }}
          />
        );
      })}
      {readOnly && rating > 0 && (
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
          {rating}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;
