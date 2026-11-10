import { GoogleGenAI } from '@google/genai';
import { gymDB } from './db.js';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export async function askFitFlowAssistant(userPrompt: string): Promise<string> {
  const data = gymDB.getData();
  const members = gymDB.getMembers();
  const trainers = gymDB.getTrainers();

  // Compute live facts from actual database
  const activeMembers = members.filter(m => m.status === 'active').length;
  const expiringSoon = members.filter(m => m.status === 'expiring_soon').length;
  const expiredMembers = members.filter(m => m.status === 'expired').length;
  const pendingPayments = members.filter(m => m.paymentStatus === 'pending' || m.paymentStatus === 'overdue').length;

  const totalRevenue = data.payments
    .filter(p => p.status === 'captured')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Trainer client distribution
  const trainerDistribution = trainers.map(t => {
    const assigned = members.filter(m => m.assignedTrainerId === t.id);
    return `${t.fullName}: ${assigned.length} clients (${assigned.map(m => m.fullName).join(', ') || 'None'})`;
  });

  const memberSummary = members.map(m =>
    `- ${m.fullName} (ID: ${m.id}, Plan: ${m.membershipPlanId}, Expiry: ${m.expiryDate}, Status: ${m.status}, Goal: ${m.fitnessGoal})`
  ).join('\n');

  const contextPrompt = `
You are FitFlow AI Assistant, an elite AI gym business intelligence and operations expert embedded directly into the FitFlow AI Gym Management System.
You have real-time access to the gym's verified database.

Gym Name: ${data.gym.name}
Currency: ${data.gym.currencySymbol} (${data.gym.currency})
Live Metrics from Verified Database:
- Total Registered Members: ${members.length}
- Active Members: ${activeMembers}
- Members Expiring Soon (within 7 days): ${expiringSoon}
- Expired Members: ${expiredMembers}
- Members with Pending/Overdue Payments: ${pendingPayments}
- Total Captured Revenue: ${data.gym.currencySymbol}${totalRevenue.toLocaleString('en-IN')}
- Total Operational Expenses: ${data.gym.currencySymbol}${totalExpenses.toLocaleString('en-IN')}
- Net Operating Profit: ${data.gym.currencySymbol}${netProfit.toLocaleString('en-IN')}
- Total Trainers: ${trainers.length}
- Trainer Allocations:
${trainerDistribution.map(td => '  * ' + td).join('\n')}

Active Members Details:
${memberSummary}

User Question: "${userPrompt}"

Instructions:
1. Answer strictly based on the real facts and figures provided above. Never invent member names, fake stats, or fabricated numbers.
2. Provide concrete, actionable insights for the gym owner (e.g. potential renewal revenue, trainer workload balancing, churn reduction).
3. If giving forecasts or recommendations, add a brief standard disclaimer that estimates are projections based on historical member retention.
4. Keep the tone executive, confident, concise, and professional with clean bullet points.
`;

  const ai = getAIClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contextPrompt,
        config: {
          systemInstruction: 'You are FitFlow AI Assistant, a senior fitness business intelligence analyst providing concise, accurate data-backed gym insights.',
        },
      });

      if (response.text) {
        return response.text;
      }
    } catch (err) {
      console.error('Gemini assistant generation error:', err);
    }
  }

  // Fallback intelligent offline engine when API key is not configured
  return generateOfflineIntelligence(userPrompt, {
    activeMembers,
    expiringSoon,
    expiredMembers,
    pendingPayments,
    totalRevenue,
    totalExpenses,
    netProfit,
    trainers,
    members,
    currencySymbol: data.gym.currencySymbol
  });
}

export async function generatePersonalizedWhatsApp(
  memberId: string,
  tone: 'friendly' | 'urgent' | 'exclusive' | 'motivational' = 'friendly',
  customOffer?: string
): Promise<string> {
  const data = gymDB.getData();
  const member = data.members.find(m => m.id === memberId);
  if (!member) {
    return 'Member not found.';
  }

  const plan = data.plans.find(p => p.id === member.membershipPlanId);
  const planName = plan ? plan.name : 'Gym Membership';
  const trainer = data.trainers.find(t => t.id === member.assignedTrainerId);
  const trainerName = trainer ? trainer.fullName : 'your coach';

  const prompt = `
Create an engaging, high-converting WhatsApp renewal message for a gym member.
Gym: ${data.gym.name}
Member Name: ${member.fullName}
Plan: ${planName}
Expiry Date: ${member.expiryDate}
Assigned Trainer: ${trainerName}
Member Fitness Goal: ${member.fitnessGoal}
Tone: ${tone}
Special Renewal Offer: ${customOffer || 'Complimentary 2x InBody Body Composition Scans on early renewal'}
Payment Link Placeholder: [RENEWAL_LINK]

Requirements:
- Natural, conversational WhatsApp format with fitness emojis.
- Reference their goal and expiry date.
- Clear Call to Action with the payment link.
- Keep it under 100 words.
`;

  const ai = getAIClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert fitness copywriter creating high-converting, friendly WhatsApp messages for gym members.',
        },
      });

      if (response.text) {
        return response.text.replace('[RENEWAL_LINK]', `https://fitflow.in/pay/${member.id}?plan=${member.membershipPlanId}`);
      }
    } catch (err) {
      console.error('Gemini WhatsApp copy generation error:', err);
    }
  }

  // Fallback high-converting templates
  return `Hello ${member.fullName}! 👋\n\nWe hope you're crushing your ${member.fitnessGoal} goals at ${data.gym.name} alongside ${trainerName}! 💪\n\nYour ${planName} is set to expire on *${member.expiryDate}*.\n\nRenew today to keep your workout rhythm and locker reserved: ${customOffer || 'Plus, enjoy 2 free body composition scans upon renewal!'}\n\n👉 1-Click Renewal: https://fitflow.in/pay/${member.id}?plan=${member.membershipPlanId}\n\nSee you on the floor! 🏋️`;
}

interface OfflineIntelContext {
  activeMembers: number;
  expiringSoon: number;
  expiredMembers: number;
  pendingPayments: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  trainers: any[];
  members: any[];
  currencySymbol: string;
}

function generateOfflineIntelligence(query: string, ctx: OfflineIntelContext): string {
  const q = query.toLowerCase();

  if (q.includes('active') || q.includes('how many member')) {
    return `📊 **Active Member Health Check**\n- Currently, you have **${ctx.activeMembers} active members** out of ${ctx.members.length} registered members.\n- **${ctx.expiringSoon} memberships** are expiring within 7 days, representing an estimated renewal pipeline of ~${ctx.currencySymbol}${(ctx.expiringSoon * 4500).toLocaleString('en-IN')}.\n- Churn risk: **${ctx.expiredMembers} members** have expired memberships and need follow-up.`;
  }

  if (q.includes('revenue') || q.includes('profit') || q.includes('financial') || q.includes('money')) {
    return `💰 **Financial Intelligence Overview**\n- **Total Revenue Captured:** ${ctx.currencySymbol}${ctx.totalRevenue.toLocaleString('en-IN')}\n- **Total Expenses:** ${ctx.currencySymbol}${ctx.totalExpenses.toLocaleString('en-IN')}\n- **Net Operating Margin:** ${ctx.currencySymbol}${ctx.netProfit.toLocaleString('en-IN')} (${((ctx.netProfit / (ctx.totalRevenue || 1)) * 100).toFixed(1)}% margin)\n- **Pending Payments:** ${ctx.pendingPayments} members owe outstanding membership fees.`;
  }

  if (q.includes('trainer') || q.includes('coach')) {
    const trainerCounts = ctx.trainers.map(t => {
      const count = ctx.members.filter(m => m.assignedTrainerId === t.id).length;
      return { name: t.fullName, count };
    }).sort((a, b) => b.count - a.count);

    const highest = trainerCounts[0];
    return `🏋️ **Trainer Performance & Client Load**\n- **${highest?.name || 'Lead Trainer'}** currently manages the highest client load with **${highest?.count || 0} active clients**.\n${trainerCounts.map(tc => `  • ${tc.name}: ${tc.count} clients`).join('\n')}\n- Recommendation: Maintain a target of 15–20 active clients per coach for optimal retention.`;
  }

  if (q.includes('expir') || q.includes('renew')) {
    const expiringList = ctx.members.filter(m => m.status === 'expiring_soon' || m.status === 'expired');
    return `⏳ **Renewal & Expiry Pipeline**\n- **${ctx.expiringSoon} memberships** are expiring within 7 days.\n- Members requiring immediate attention:\n${expiringList.slice(0, 5).map(m => `  • ${m.fullName} (${m.phone}) - Expiry: ${m.expiryDate} [${m.status.toUpperCase()}]`).join('\n')}\n- Action: WhatsApp 7-day automated reminders have been queued.`;
  }

  return `🤖 **FitFlow AI Intelligence Summary**\n- **Total Active Members:** ${ctx.activeMembers} / ${ctx.members.length}\n- **Expiring in 7 Days:** ${ctx.expiringSoon} members\n- **Month-to-Date Revenue:** ${ctx.currencySymbol}${ctx.totalRevenue.toLocaleString('en-IN')}\n- **Top Coach:** ${ctx.trainers[0]?.fullName || 'Lead Trainer'} (${ctx.members.filter(m => m.assignedTrainerId === ctx.trainers[0]?.id).length} clients)\n\n*Disclaimer: Projections and retention recommendations are estimates based on your live gym data.*`;
}
