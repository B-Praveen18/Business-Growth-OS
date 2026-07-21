import { getCompetitorsCollection, ObjectId } from '../db';
import { jsonResponse, errorResponse, parseJsonBody, requireAuth, AuthError } from './utils';
import { logActivity } from './activity-logger';
import { emitNotification } from './notification-emitter';

export async function handleCompetitorsApi(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    const companyId = auth.company;
    const collection = await getCompetitorsCollection();

    if (request.method === 'GET') {
      const competitors = await collection.find({ companyId }).toArray();
      return jsonResponse({ competitors });
    }

    if (request.method === 'POST') {
      const body = await parseJsonBody(request);
      const newCompetitor = {
        name: body.name,
        industry: body.industry,
        positioning: body.positioning,
        strengths: body.strengths || [],
        weaknesses: body.weaknesses || [],
        pricing: body.pricing,
        website: body.website,
        marketShare: body.marketShare,
        momentum: body.momentum,
        notes: body.notes,
        companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await collection.insertOne(newCompetitor);
      
      await logActivity(companyId, auth.userId, 'competitors', `Competitor added: ${newCompetitor.name}`, `Added new competitor`);
      await emitNotification(auth.userId, 'Competitor Added', `Competitor "${newCompetitor.name}" has been tracked.`, 'info');
      
      return jsonResponse({ _id: result.insertedId, ...newCompetitor });
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
    console.error('Competitors API error:', error);
    return errorResponse('Internal server error', 500);
  }
}
