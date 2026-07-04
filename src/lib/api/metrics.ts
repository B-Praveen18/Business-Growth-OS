import { getMetricsCollection, ObjectId } from '../db';
import { jsonResponse, errorResponse, parseJsonBody, requireAuth, AuthError } from './utils';
import { Metric } from '../types';
import { logActivity } from './activity-logger';
import { emitNotification } from './notification-emitter';

export async function handleMetricsApi(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    const companyId = auth.company;
    const collection = await getMetricsCollection();

    if (request.method === 'GET') {
      const metrics = await collection.find({ companyId }).sort({ createdAt: -1 }).toArray();
      return jsonResponse(metrics);
    }

    if (request.method === 'POST') {
      const body = await parseJsonBody(request);
      const newMetric = {
        ...body,
        companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const result = await collection.insertOne(newMetric);
      
      await logActivity(companyId, auth.userId, 'metrics', 'KPI snapshot recorded', `Recorded new metric ${body.name || ''}`);
      await emitNotification(auth.userId, 'KPI Updated', 'A new KPI metric has been recorded.', 'info');
      
      return jsonResponse({ _id: result.insertedId, ...newMetric });
    }

    if (request.method === 'PUT') {
      const body = await parseJsonBody(request);
      const { _id, ...updateData } = body;
      
      if (!_id) return errorResponse('Missing _id', 400);

      await collection.updateOne(
        { _id: new ObjectId(_id), companyId },
        { $set: { ...updateData, updatedAt: new Date().toISOString() } }
      );

      await logActivity(companyId, auth.userId, 'metrics', 'KPI metrics updated', `Updated metric data`);
      await emitNotification(auth.userId, 'KPI Updated', 'KPI metrics have been updated.', 'info');

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
    console.error('Metrics API error:', error);
    return errorResponse('Internal server error', 500);
  }
}
