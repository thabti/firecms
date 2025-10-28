import { NextRequest } from "next/server";
import { getStorageAdapter } from "@/lib/adapters";
import { createAPIResponse, createErrorResponse, getRequestId } from "@/lib/api-utils";
import type { Block } from "@/types";

interface BatchBlockOperation {
  blockId?: string; // undefined for create operations
  action: "create" | "update" | "delete";
  data?: Partial<Block>;
}

/**
 * POST /api/pages/{id}/sections/{sectionId}/blocks/batch
 * Batch operations for blocks (create, update, delete)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sectionId: string }> }
) {
  const requestId = getRequestId(request.headers);

  try {
    const { id: pageId, sectionId } = await params;
    const { operations } = await request.json() as { operations: BatchBlockOperation[] };

    if (!Array.isArray(operations) || operations.length === 0) {
      return createErrorResponse(
        new Error("Operations array is required and must not be empty"),
        400,
        { requestId }
      );
    }

    const adapter = await getStorageAdapter();
    const results: any[] = [];

    // Process all operations in sequence
    for (const operation of operations) {
      try {
        switch (operation.action) {
          case "create":
            if (!operation.data?.type) {
              throw new Error("Block type is required for create operation");
            }
            const createData = {
              pageId,
              sectionId,
              type: operation.data.type,
              ...operation.data,
            };
            const newBlock = await adapter.createBlock(createData as any);
            results.push({ action: "create", success: true, block: newBlock });
            break;

          case "update":
            if (!operation.blockId) {
              throw new Error("Block ID is required for update operation");
            }
            await adapter.updateBlock(pageId, sectionId, operation.blockId, operation.data || {});
            results.push({ action: "update", success: true, blockId: operation.blockId });
            break;

          case "delete":
            if (!operation.blockId) {
              throw new Error("Block ID is required for delete operation");
            }
            await adapter.deleteBlock(pageId, sectionId, operation.blockId);
            results.push({ action: "delete", success: true, blockId: operation.blockId });
            break;

          default:
            results.push({
              action: operation.action,
              success: false,
              error: `Unknown action: ${operation.action}`,
            });
        }
      } catch (error) {
        results.push({
          action: operation.action,
          blockId: operation.blockId,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Check if any operations failed
    const allSuccessful = results.every(r => r.success);

    return createAPIResponse(
      {
        success: allSuccessful,
        results,
        totalOperations: operations.length,
        successfulOperations: results.filter(r => r.success).length,
        failedOperations: results.filter(r => !r.success).length,
      },
      { requestId, status: allSuccessful ? 200 : 207 } // 207 Multi-Status if some failed
    );
  } catch (error) {
    console.error("Error in batch block operations:", error);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}
