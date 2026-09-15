import { beforeEach, describe, expect, it, vi } from "vitest";

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("next/navigation", () => ({ redirect }));

const { createClient } = vi.hoisted(() => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({ createClient }));

import {
  ensureAnonymousCustomer,
  getAuthContext,
  requireRole,
} from "@/lib/auth/guards";

describe("auth guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when no authenticated claim exists", async () => {
    createClient.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({ data: null }),
      },
    });

    const context = await getAuthContext();
    expect(context).toBeNull();
  });

  it("returns userId and role for a matching profile", async () => {
    createClient.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: "user-123" } },
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { role: "customer" },
              error: null,
            }),
          }),
        }),
      }),
    });

    const context = await getAuthContext();
    expect(context).toEqual({ userId: "user-123", role: "customer" });
  });

  it("redirects unauthenticated user to sign-in on requireRole", async () => {
    createClient.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({ data: null }),
      },
    });

    await expect(requireRole("admin")).rejects.toThrow("REDIRECT:/sign-in");
  });

  it("redirects mismatched role to access-denied", async () => {
    createClient.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: "user-staff" } },
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { role: "staff" },
              error: null,
            }),
          }),
        }),
      }),
    });

    await expect(requireRole("admin")).rejects.toThrow("REDIRECT:/access-denied");
  });

  it("creates anonymous customer when no session exists", async () => {
    const signInAnonymously = vi.fn().mockResolvedValue({
      data: { user: { id: "anon-456" } },
      error: null,
    });
    createClient.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({ data: null }),
        signInAnonymously,
      },
    });

    const userId = await ensureAnonymousCustomer();
    expect(userId).toBe("anon-456");
    expect(signInAnonymously).toHaveBeenCalled();
  });

  it("rejects non-customer identities calling ensureAnonymousCustomer", async () => {
    createClient.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: "admin-789" } },
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { role: "admin" },
              error: null,
            }),
          }),
        }),
      }),
    });

    await expect(ensureAnonymousCustomer()).rejects.toThrow(
      "Customer identity required",
    );
  });
});
