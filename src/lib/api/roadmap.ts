import { getRoadmapCollection, ObjectId } from '../db';
import { jsonResponse, errorResponse, parseJsonBody, requireAuth, AuthError } from './utils';
import { logActivity } from './activity-logger';
import { emitNotification } from './notification-emitter';

export async function handleRoadmapApi(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    const companyId = auth.company;
    const collection = await getRoadmapCollection();

    if (request.method === 'GET') {
      const items = await collection.find({ companyId }).sort({ createdAt: 1 }).toArray();
      return jsonResponse(items);
    }

    if (request.method === 'POST') {
      const body = await parseJsonBody(request);
      const newItem = {
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: body.status,
        assignee: body.assignee,
        progress: body.progress || 0,
        quarter: body.quarter,
        theme: body.theme,
        dueDate: body.dueDate,
        companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await collection.insertOne(newItem);
      
      await logActivity(companyId, auth.userId, 'roadmap', `Roadmap item added: ${newItem.title}`, `Added item to roadmap`);
      
      return jsonResponse({ _id: result.insertedId, ...newItem });
    }

    if (request.method === 'PUT') {
      const body = await parseJsonBody(request);
      const { _id, ...updateData } = body;
      
      if (!_id) return errorResponse('Missing _id', 400);

      const existingItem = await collection.findOne({ _id: new ObjectId(_id), companyId });
      
      await collection.updateOne(
        { _id: new ObjectId(_id), companyId },
        { $set: { ...updateData, updatedAt: new Date().toISOString() } }
      );

      if (updateData.status === 'done' && existingItem?.status !== 'done') {
        await logActivity(companyId, auth.userId, 'roadmap', 'Roadmap item completed', `Completed item: ${updateData.title || existingItem?.title}`);
        await emitNotification(auth.userId, 'Roadmap Completed', `Roadmap item completed.`, 'success');
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
    console.error('Roadmap API error:', error);
    return errorResponse('Internal server error', 500);
  }
}
