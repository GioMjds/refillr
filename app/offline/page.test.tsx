import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import OfflinePage from '@/app/offline/page';

describe('OfflinePage', () => {
  it('renders offline recovery message without implying queued work', () => {
    render(<OfflinePage />);
    expect(
      screen.getByRole('heading', { name: /you[’']re offline/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no order has been submitted or changed\./i),
    ).toBeInTheDocument();
  });
});
