import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RegisterServiceWorker } from '@/components/pwa/register-service-worker';

describe('RegisterServiceWorker', () => {
  const registerMock = vi.fn();

  beforeEach(() => {
    registerMock.mockReset();
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: registerMock,
      },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers the service worker with correct options', () => {
    render(<RegisterServiceWorker />);
    expect(registerMock).toHaveBeenCalledTimes(1);
    expect(registerMock).toHaveBeenCalledWith('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
  });
});
