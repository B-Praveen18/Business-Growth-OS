import { getRisksCollection, ObjectId } from '../db';
import { jsonResponse, errorResponse, parseJsonBody, requireAuth, AuthError } from './utils';
import { logActivity } from './activity-logger';
import { emitNotification } from './notification-emitter';

export async function handleRisksApi(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    const companyId = auth.company;
    const collection = await getRisksCollection();

    if (request.method === 'GET') {
      const risks = await collection.find({ companyId }).toArray();
      return jsonResponse(risks);
    }

    if (request.method === 'POST') {
      const body = await parseJsonBody(request);
      const newRisk = {
        title: body.title,
        description: body.description,
        severity: body.severity,
        probability: body.probability,
        category: body.category,
        owner: body.owner,
        mitigation: body.mitigation,
        status: body.status || 'open',
        dueDate: body.dueDate,
        companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await collection.insertOne(newRisk);
      
      await logActivity(companyId, auth.userId, 'risks', `Risk created: ${newRisk.title}`, `A new risk was added: ${newRisk.title}`);
      await emitNotification(auth.userId, 'New Risk Identified', `Risk "${newRisk.title}" has been created.`, 'alert');
      
      return jsonResponse({ _id: result.insertedId, ...newRisk });
    }

    if (request.method === 'PUT') {
      const body = await parseJsonBody(request);
      const { _id, ...updateData } = body;
      
      if (!_id) return errorResponse('Missing _id', 400);

      await collection.updateOne(
        { _id: new ObjectId(_id), companyId },
        { $set: { ...updateData, updatedAt: new Date().toISOString() } }
      );

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
    console.error('Risks API error:', error);
    return errorResponse('Internal server error', 500);
  }
}
