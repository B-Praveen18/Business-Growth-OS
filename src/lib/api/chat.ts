import { getChatSessionsCollection, getMetricsCollection, getRisksCollection, getRoadmapCollection, getCompetitorsCollection } from '../db';
import { jsonResponse, errorResponse, parseJsonBody, requireAuth, AuthError } from './utils';
import { logActivity } from './activity-logger';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function handleChatApi(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    const companyId = auth.company;
    const userId = auth.userId;
    const collection = await getChatSessionsCollection();

    if (request.method === 'GET') {
      let session = await collection.findOne({ companyId, userId });
      if (!session) {
        const newSession = {
          companyId,
          userId,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const result = await collection.insertOne(newSession);
        session = { _id: result.insertedId, ...newSession };
      }
      return jsonResponse(session);
    }

    if (request.method === 'POST') {
      const body = await parseJsonBody(request);
      const { message } = body;
      
      if (!message) return errorResponse('Missing message', 400);

      let session = await collection.findOne({ companyId, userId });
      if (!session) {
        const newSession = {
          companyId,
          userId,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const result = await collection.insertOne(newSession);
        session = { _id: result.insertedId, ...newSession };
      }

      // Load business context
      const metricsCol = await getMetricsCollection();
      const risksCol = await getRisksCollection();
      const roadmapCol = await getRoadmapCollection();
      const competitorsCol = await getCompetitorsCollection();

      const metrics = await metricsCol.find({ companyId }).sort({ createdAt: -1 }).limit(5).toArray();
      const risks = await risksCol.find({ companyId, status: 'open' }).toArray();
      const roadmap = await roadmapCol.find({ companyId, status: { $ne: 'done' } }).toArray();
      const competitors = await competitorsCol.find({ companyId }).toArray();

      const businessContext = `
        Company Metrics: ${JSON.stringify(metrics)}
        Open Risks: ${JSON.stringify(risks)}
        Pending Roadmap: ${JSON.stringify(roadmap)}
        Competitors: ${JSON.stringify(competitors)}
      `;

      const systemPrompt = `You are a strategic AI business advisor. Use this business context to answer questions: ${businessContext}`;

      const userMessageObj = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };

      await collection.updateOne(
        { _id: session._id },
        { 
          $push: { messages: userMessageObj },
          $set: { updatedAt: new Date().toISOString() } 
        }
      );

      let assistantMessageContent = 'Configure GEMINI_API_KEY to enable AI responses.';
      
      const apiKey = process.env.GEMINI_API_KEY || '';
      if (apiKey) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
          
          const history = session.messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          }));

          const chat = model.startChat({
            systemInstruction: systemPrompt,
            history
          });
          
          const result = await chat.sendMessage(message);
          assistantMessageContent = result.response.text();
        } catch (aiError) {
          console.error("AI Generation Error:", aiError);
          assistantMessageContent = "I encountered an error generating a response.";
        }
      }

      const assistantMessageObj = {
        role: 'assistant',
        content: assistantMessageContent,
        timestamp: new Date().toISOString()
      };

      await collection.updateOne(
        { _id: session._id },
        { 
          $push: { messages: assistantMessageObj },
          $set: { updatedAt: new Date().toISOString() }
        }
      );

      await logActivity(companyId, userId, 'chat', 'Boardroom chat message sent', `Sent message: ${message.substring(0, 50)}...`);

      return jsonResponse({ message: assistantMessageObj });
    }

    return errorResponse('Method not allowed', 405);
  } catch (error) {
    if (error instanceof AuthError) {
      return errorResponse(error.message, 401);
    }
    console.error('Chat API error:', error);
    return errorResponse('Internal server error', 500);
  }
}
