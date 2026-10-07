import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../auth/requireUser.js", () => ({
  requireUser: vi.fn(),
  sendUserAuthError: vi.fn((res, authResult) =>
    res.status(authResult.status).json({
      ok: false,
      error: authResult.error,
    }),
  ),
}));

vi.mock("../userData/loadFinancialData.js", () => ({
  loadFinancialData: vi.fn(),
}));

vi.mock("../financial-signals/runFinancialSignals.js", () => ({
  runFinancialSignals: vi.fn(),
}));

vi.mock("../ai/services/orchestrator.js", () => ({
  runOrchestrator: vi.fn(),
}));

vi.mock("../ai/telemetry/businessBehaviourTelemetry.js", () => ({
  recordFinancialBehaviourTelemetry: vi.fn(),
}));

vi.mock("../userData/loadPilotContext.js", () => ({
  loadPilotContext: vi.fn(),
}));

import { requireUser } from "../auth/requireUser.js";
import { loadFinancialData } from "../userData/loadFinancialData.js";
import handler from "../../api/insights/run.js";

const createResponse = () => ({
  status: vi.fn(function status(code) {
    this.statusCode = code;
    return this;
  }),
  json: vi.fn(function json(payload) {
    this.body = payload;
    return this;
  }),
});

describe("POST /api/insights/run", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks an unverified user before running the insight pipeline", async () => {
    requireUser.mockResolvedValue({
      ok: true,
      uid: "user-1",
      claims: { email_verified: false },
    });

    const res = createResponse();

    await handler(
      {
        method: "POST",
        body: { userId: "user-1", currency: "NGN" },
      },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.body).toEqual({
      ok: false,
      error: {
        code: "EMAIL_VERIFICATION_REQUIRED",
        message: "Verify your email address before generating insights.",
      },
    });
    expect(loadFinancialData).not.toHaveBeenCalled();
  });
});
