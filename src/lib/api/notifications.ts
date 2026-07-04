import { getNotificationsCollection, ObjectId } from '../db';
import { jsonResponse, errorResponse, parseJsonBody, requireAuth, AuthError } from './utils';

export async function handleNotificationsApi(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    const userId = auth.userId;
    const collection = await getNotificationsCollection();
    const url = new URL(request.url);

    if (request.method === 'GET') {
      const notifications = await collection.find({ userId }).sort({ createdAt: -1 }).toArray();
      return jsonResponse(notifications);
    }

    if (request.method === 'PUT') {
      if (url.pathname.includes('/read-all')) {
        await collection.updateMany(
          { userId, read: false },
          { $set: { read: true, updatedAt: new Date().toISOString() } }
        );
        return jsonResponse({ success: true });
      } 
      
      if (url.pathname.includes('/read')) {
        const body = await parseJsonBody(request);
        if (!body._id) return errorResponse('Missing _id', 400);
        
        await collection.updateOne(
          { _id: new ObjectId(body._id), userId },
          { $set: { read: true, updatedAt: new Date().toISOString() } }
        );
        return jsonResponse({ success: true });
      }
      
      return errorResponse('Invalid path', 400);
    }

    return errorResponse('Method not allowed', 405);
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message, 401);
    }
    console.error('Notifications API error:', error);
    return errorResponse('Internal server error', 500);
  }
}
