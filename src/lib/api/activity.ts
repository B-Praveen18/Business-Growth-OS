import { getActivityCollection } from '../db';
import { jsonResponse, errorResponse, requireAuth, AuthError } from './utils';

export async function handleActivityApi(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    const companyId = auth.company;
    
    if (request.method === 'GET') {
      const collection = await getActivityCollection();
      const activities = await collection.find({ companyId })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
        
      return jsonResponse(activities);
    }

    return errorResponse('Method not allowed', 405);
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message, 401);
    }
    console.error('Activity API error:', error);
    return errorResponse('Internal server error', 500);
  }
}
