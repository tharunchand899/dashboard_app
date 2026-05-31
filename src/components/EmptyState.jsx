import React from 'react';
import { Compass } from 'lucide-react';

/**
 * Reusable EmptyState component.
 * Displays when lists are empty or search results return nothing.
 */
const EmptyState = ({ 
  title = 'No Results Found', 
  message = 'We couldn\'t find what you were looking for. Try adjusting your filters or search terms.',
  icon: IconComponent = Compass,
  actionButton
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon-wrapper">
        <IconComponent className="empty-state-icon" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionButton && <div className="empty-state-action">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
