import { getChatSessionsCollection, getMetricsCollection, getRisksCollection, getRoadmapCollection, getCompetitorsCollection } from '../db';
import { jsonResponse, errorResponse, parseJsonBody, requireAuth, AuthError } from './utils';
import { logActivity } from './activity-logger';
import { GoogleGenerativeAI } from '@google/generative-ai';

const DASHBOARD_FORMAT = `
ALWAYS respond in clean Markdown formatted as an executive dashboard. Follow this exact structure:

# 📊 Current Market Status

## Overall Health
One line with an emoji status indicator (🟢 Healthy / 🟡 Caution / 🔴 Critical) followed by one sentence summary.

## KPI Summary
Compact table with columns: Metric | Current | Trend (use 📈 📉 ➡️)

## Key Insights
3–5 bullet points only. No paragraphs. Bold important numbers.

## Competitor Snapshot
Table with columns: Competitor | Status | Impact (Opportunity/Threat/Neutral)
Only include if competitor data is available.

## Risks
Top 3 risks only, each prefixed with 🔴 High / 🟡 Medium / 🟢 Low.

## Recommendations
3–5 actionable bullet points only. No paragraphs.

## Charts
Only if historical monthly data (3+ months) is available, generate Mermaid xychart-beta charts for Revenue, Customers, and Growth Rate.
Format:
\`\`\`mermaid
xychart-beta
    title "MetricName"
    x-axis ["Mon1","Mon2","Mon3"]
    y-axis "Label" minVal --> maxVal
    line [val1,val2,val3]
\`\`\`
If data is unavailable, omit the Charts section entirely.

RULES:
- Total response MUST be under 350 words.
- No long paragraphs — only tables, bullets, and charts.
- Bold all key numbers.
- Output must look like an executive dashboard, not a written report.
`;

const AGENT_PERSONAS: Record<string, string> = {
  boardroom: `You are a strategic AI business advisor speaking on behalf of the full executive team.${DASHBOARD_FORMAT}`,
  ceo: `You are the CEO Agent: a strategic AI executive focused on company-wide priorities, cross-team alignment, board narrative, and high-level decision making. Answer as the CEO would, decisively and with big-picture context.${DASHBOARD_FORMAT}`,
  marketing: `You are the Marketing Agent: an AI executive focused on demand generation, brand, CAC, channel performance, and campaign strategy. Answer with marketing-specific analysis and recommendations.${DASHBOARD_FORMAT}`,
  sales: `You are the Sales Agent: an AI executive focused on pipeline, win rate, forecasting, and account expansion. Answer with sales-specific analysis and recommendations.${DASHBOARD_FORMAT}`,
  finance: `You are the Finance Agent: an AI executive focused on runway, burn multiple, margins, and financial planning. Answer with finance-specific analysis and recommendations.${DASHBOARD_FORMAT}`,
  operations: `You are the Operations Agent: an AI executive focused on activation rate, time-to-value, infra reliability, and process efficiency. Answer with operations-specific analysis and recommendations.${DASHBOARD_FORMAT}`,
};

function resolveAgentId(request: Request): string {
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get('agentId');
  if (fromQuery && AGENT_PERSONAS[fromQuery]) return fromQuery;
  return 'boardroom';
}

export async function handleChatApi(request: Request): Promise<Response> {
  try {
    const auth = await requireAuth(request);
    const companyId = auth.company;
    const userId = auth.userId;
    const collection = await getChatSessionsCollection();
    const agentId = resolveAgentId(request);

    if (request.method === 'GET') {
      let session = await collection.findOne({ companyId, userId, agentId });
      if (!session) {
        const newSession = {
          companyId,
          userId,
          agentId,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const result = await collection.insertOne(newSession);
        session = { _id: result.insertedId, ...newSession };
      }
      return jsonResponse({ session });
    }

    if (request.method === 'POST') {
      const body = await parseJsonBody(request);
      const { message } = body;

      if (!message) return errorResponse('Missing message', 400);

      let session = await collection.findOne({ companyId, userId, agentId });
      if (!session) {
        const newSession = {
          companyId,
          userId,
          agentId,
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

      const persona = AGENT_PERSONAS[agentId] ?? AGENT_PERSONAS.boardroom;
      const systemPrompt = `${persona}

Business context (use this data to populate the dashboard):
${businessContext}

Remember: respond ONLY in the executive dashboard Markdown format defined in your instructions. Under 350 words. No prose paragraphs.`;

      const userMessageObj = {
        role: 'user' as const,
        content: String(message),
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
        // Model fallback chain: try each model in order until one succeeds
        const MODEL_CHAIN = [
          'gemini-2.0-flash-lite',
          'gemini-2.0-flash',
          'gemini-2.5-flash',
          'gemini-2.5-pro',
          'gemini-3-flash-preview',
        ];

        const history = session.messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: String(m.content) }]
        }));

        let lastError: any = null;
        const genAI = new GoogleGenerativeAI(apiKey);

        for (const modelName of MODEL_CHAIN) {
          try {
            const model = genAI.getGenerativeModel({
              model: modelName,
              systemInstruction: systemPrompt,
            });
            const chat = model.startChat({ history });
            const result = await chat.sendMessage(String(message));
            assistantMessageContent = result.response.text();
            lastError = null;
            break; // success — stop trying
          } catch (aiError: any) {
            lastError = aiError;
            const is429 = aiError?.status === 429 || aiError?.message?.includes('429') || aiError?.message?.includes('quota');
            const is404 = aiError?.status === 404;
            const is503 = aiError?.status === 503;
            if (!is429 && !is404 && !is503) break;
            console.warn(`Model ${modelName} quota exceeded, trying next model...`);
          }
        }

        if (lastError) {
          console.error('AI Generation Error:', lastError);
          const is429 = lastError?.status === 429 || lastError?.message?.includes('429') || lastError?.message?.includes('quota');
          assistantMessageContent = is429
            ? 'All AI models are currently rate-limited. The free tier quota is exhausted. Please wait a few minutes and try again, or upgrade your Gemini API plan at https://ai.dev/rate-limit.'
            : 'I encountered an error generating a response. Please try again.';
        }
      }

      const assistantMessageObj = {
        role: 'assistant' as const,
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

      await logActivity(companyId, userId, 'chat', `${agentId} chat message sent`, `Sent message: ${String(message).substring(0, 50)}...`);

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
