import { getReportsCollection, getMetricsCollection, getRisksCollection, getRoadmapCollection, ObjectId } from '../db';
import { jsonResponse, errorResponse, parseJsonBody, requireAuth, AuthError } from './utils';
import { logActivity } from './activity-logger';
import { emitNotification } from './notification-emitter';

export async function handleReportsApi(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    const companyId = auth.company;
    const collection = await getReportsCollection();

    if (request.method === 'GET') {
      const reports = await collection.find({ companyId }).sort({ createdAt: -1 }).toArray();
      return jsonResponse({ reports });
    }

    if (request.method === 'POST') {
      const body = await parseJsonBody(request);
      const { reportType, period } = body;
      
      const metricsCol = await getMetricsCollection();
      const risksCol = await getRisksCollection();
      const roadmapCol = await getRoadmapCollection();
      
      const metrics = await metricsCol.find({ companyId }).sort({ createdAt: -1 }).limit(10).toArray();
      const risksCount = await risksCol.countDocuments({ companyId, status: 'open' });
      const roadmapCount = await roadmapCol.countDocuments({ companyId, status: { $ne: 'done' } });
      
      const summary = `Generated ${reportType} report for ${period}. Found ${metrics.length} recent metrics. There are ${risksCount} open risks and ${roadmapCount} pending roadmap items.`;
      
      const newReport = {
        title: `${reportType} Report - ${period}`,
        type: reportType,
        period,
        status: 'ready',
        summary,
        generatedBy: auth.name,
        companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await collection.insertOne(newReport);
      
      await logActivity(companyId, auth.userId, 'reports', 'Report generated', `Generated ${reportType} report`);
      await emitNotification(auth.userId, 'Report Ready', `The ${reportType} report is ready.`, 'info');
      
      return jsonResponse({ _id: result.insertedId, ...newReport });
    }

    return errorResponse('Method not allowed', 405);
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message, 401);
    }
    console.error('Reports API error:', error);
    return errorResponse('Internal server error', 500);
  }
}
