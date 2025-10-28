import { NextRequest } from "next/server";
import { getStorageAdapter } from "@/lib/adapters";
import { createAPIResponse, createErrorResponse, getRequestId } from "@/lib/api-utils";
import type { Block } from "@/types";

interface BlockUpdate {
  blockId: string;
  sectionId: string;
  data: Partial<Block>;
}

interface BlockCreate {
  sectionId: string;
  tempId: string; // Client-side temporary ID for mapping
  data: Omit<Block, "id">;
}

interface BlockDelete {
  blockId: string;
  sectionId: string;
}

interface BatchUpdateRequest {
  updates?: BlockUpdate[];
  creates?: BlockCreate[];
  deletes?: BlockDelete[];
}

/**
 * POST /api/pages/{id}/batch-update
 * Batch update all blocks in a page at once
 * This reduces API calls from N blocks to 1 API call
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = getRequestId(request.headers);

  try {
    const { id: pageId } = await params;
    const body = await request.json() as BatchUpdateRequest;

    const { updates = [], creates = [], deletes = [] } = body;

    if (updates.length === 0 && creates.length === 0 && deletes.length === 0) {
      return createErrorResponse(
        new Error("At least one operation (update, create, or delete) is required"),
        400,
        { requestId }
      );
    }

    const adapter = await getStorageAdapter();
    const results = {
      updates: [] as any[],
      creates: [] as any[],
      deletes: [] as any[],
    };

    // Process deletes first (to avoid conflicts)
    for (const deleteOp of deletes) {
      try {
        await adapter.deleteBlock(pageId, deleteOp.sectionId, deleteOp.blockId);
        results.deletes.push({
          success: true,
          blockId: deleteOp.blockId,
          sectionId: deleteOp.sectionId,
        });
      } catch (error) {
        results.deletes.push({
          success: false,
          blockId: deleteOp.blockId,
          sectionId: deleteOp.sectionId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Process creates
    for (const createOp of creates) {
      try {
        const createData = {
          pageId,
          sectionId: createOp.sectionId,
          ...createOp.data,
        };
        const newBlock = await adapter.createBlock(createData as any);
        results.creates.push({
          success: true,
          tempId: createOp.tempId,
          block: newBlock,
        });
      } catch (error) {
        results.creates.push({
          success: false,
          tempId: createOp.tempId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Process updates
    for (const updateOp of updates) {
      try {
        await adapter.updateBlock(
          pageId,
          updateOp.sectionId,
          updateOp.blockId,
          updateOp.data
        );
        results.updates.push({
          success: true,
          blockId: updateOp.blockId,
          sectionId: updateOp.sectionId,
        });
      } catch (error) {
        results.updates.push({
          success: false,
          blockId: updateOp.blockId,
          sectionId: updateOp.sectionId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Calculate statistics
    const totalOperations = updates.length + creates.length + deletes.length;
    const successfulOps =
      results.updates.filter(r => r.success).length +
      results.creates.filter(r => r.success).length +
      results.deletes.filter(r => r.success).length;
    const failedOps = totalOperations - successfulOps;

    const allSuccessful = failedOps === 0;

    return createAPIResponse(
      {
        success: allSuccessful,
        results,
        statistics: {
          totalOperations,
          successfulOperations: successfulOps,
          failedOperations: failedOps,
          updates: updates.length,
          creates: creates.length,
          deletes: deletes.length,
        },
      },
      { requestId, status: allSuccessful ? 200 : 207 } // 207 Multi-Status if some failed
    );
  } catch (error) {
    console.error("Error in batch update:", error);
    return createErrorResponse(error as Error, 500, { requestId });
  }
}
