import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from '../ErrorState';

describe('ErrorState', () => {
  it('should render with default title and description', () => {
    render(<ErrorState errorType="unknown" />);
    
    expect(screen.getByText(/une erreur s'est produite/i)).toBeInTheDocument();
  });

  it('should render with custom title and description', () => {
    render(
      <ErrorState
        errorType="network"
        title="Custom Title"
        description="Custom Description"
      />
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
  });

  it('should show network error icon for network type', () => {
    render(<ErrorState errorType="network" />);
    
    // Check that the component renders (icon is aria-hidden)
    expect(screen.getByText(/problème de connexion/i)).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    
    render(<ErrorState errorType="server" onRetry={onRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /réessayer/i });
    await user.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should disable retry button when isRetrying is true', () => {
    render(<ErrorState errorType="unknown" onRetry={() => {}} isRetrying={true} />);
    
    const retryButton = screen.getByRole('button');
    expect(retryButton).toBeDisabled();
    expect(screen.getByText(/réessai en cours/i)).toBeInTheDocument();
  });

  it('should not show retry button when onRetry is not provided', () => {
    render(<ErrorState errorType="unknown" />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

