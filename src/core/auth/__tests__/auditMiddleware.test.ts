import { withAuditLog } from "../auditMiddleware";
import { container } from "@/core/di/registry";
import { getServerSession } from "next-auth/next";

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn()
}));

describe("withAuditLog Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-1", role: "SUPER_ADMIN" }
    });

    // Inyectamos mock de auditoria
    (container as any)._auditLogRepo = {
      create: jest.fn().mockResolvedValue({}),
      getAll: jest.fn(),
    };
  });

  it("should log the action successfully and return handler result", async () => {
    const mockHandler = jest.fn().mockResolvedValue({ id: "project-1", name: "Test" });
    const formData = new FormData();
    formData.append("name", "Test Project");

    const wrappedAction = withAuditLog({ action: "CREATE", entity: "PROJECT" }, mockHandler);
    const result = await wrappedAction(formData);

    expect(result.id).toBe("project-1");
    expect(container.auditLogRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: "user-1",
      action: "CREATE",
      entity: "PROJECT",
      entityId: "project-1",
    }));
  });

  it("should throw error if user has no permission", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-2", role: "VOLUNTARIO_FALSO" }
    });

    const mockHandler = jest.fn();
    const wrappedAction = withAuditLog({ action: "DELETE", entity: "PROJECT", requiredPermission: "manage:projects" }, mockHandler);
    
    await expect(wrappedAction(new FormData())).rejects.toThrow("Permisos insuficientes");
    expect(mockHandler).not.toHaveBeenCalled();
  });
});
