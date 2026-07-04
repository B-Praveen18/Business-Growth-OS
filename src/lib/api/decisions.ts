import { getDecisionsCollection, ObjectId } from '../db';
import { jsonResponse, errorResponse, parseJsonBody, requireAuth, AuthError } from './utils';
import { logActivity } from './activity-logger';
import { emitNotification } from './notification-emitter';

export async function handleDecisionsApi(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    const companyId = auth.company;
    const collection = await getDecisionsCollection();

    if (request.method === 'GET') {
      const decisions = await collection.find({ companyId }).sort({ createdAt: -1 }).toArray();
      return jsonResponse(decisions);
    }

    if (request.method === 'POST') {
      const body = await parseJsonBody(request);
      const newDecision = {
        title: body.title,
        description: body.description,
        decision: body.decision,
        impact: body.impact,
        owner: body.owner,
        status: body.status || 'pending',
        agents: body.agents || [],
        companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await collection.insertOne(newDecision);
      
      await logActivity(companyId, auth.userId, 'decisions', `Decision recorded: ${newDecision.title}`, `A new decision was recorded`);
      
      return jsonResponse({ _id: result.insertedId, ...newDecision });
    }

    if (request.method === 'PUT') {
      const body = await parseJsonBody(request);
      const { _id, ...updateData } = body;
      
      if (!_id) return errorResponse('Missing _id', 400);

      const existingDecision = await collection.findOne({ _id: new ObjectId(_id), companyId });

      await collection.updateOne(
        { _id: new ObjectId(_id), companyId },
        { $set: { ...updateData, updatedAt: new Date().toISOString() } }
      );

      if (updateData.status === 'approved' && existingDecision?.status !== 'approved') {
        await logActivity(companyId, auth.userId, 'decisions', 'Decision approved', `Approved decision: ${updateData.title || existingDecision?.title}`);
        await emitNotification(auth.userId, 'Decision Approved', 'A decision has been approved.', 'success');
      }

      return jsonResponse({ success: true });
    }

    if (request.method === 'DELETE') {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
      if (!id) return errorResponse('Missing id parameter', 400);

      await collection.deleteOne({ _id: new ObjectId(id), companyId });
      return jsonResponse({ success: true });
    }

    return errorResponse('Method not allowed', 405);
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message, 401);
    }
    console.error('Decisions API error:', error);
    return errorResponse('Internal server error', 500);
  }
}
