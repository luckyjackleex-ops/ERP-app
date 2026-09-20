// Client-side AI service: proxies all requests to secure backend server endpoints (/api/ai/*)
// CRITICAL: The browser client never touches or sees GEMINI_API_KEY.

export interface AICustomerReplyResult {
  replyForeign: string;
  replyChinese: string;
  analysis: string;
  suggestedAction: string;
}

export interface AIListingResult {
  optimizedTitle: string;
  bulletPoints: string[];
  searchTerms: string;
  productDescription: string;
  recommendedAdKeywords: string[];
}

export interface AIInventoryAdvisorResult {
  riskLevel: 'CRITICAL' | 'WARNING' | 'NORMAL';
  analysis: string;
  recommendedPurchaseQty: number;
  shippingMethodAdvice: string;
  actionPlan: string;
}

export interface AIResponse<T> {
  success: boolean;
  mode?: string;
  note?: string;
  data: T;
}

export async function generateAICustomerReply(params: {
  buyerMessage: string;
  buyerName?: string;
  storeName?: string;
  orderId?: string;
  targetLanguage?: string;
  customInstructions?: string;
}): Promise<AIResponse<AICustomerReplyResult>> {
  const res = await fetch('/api/ai/customer-reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || '后端 AI 服务请求失败');
  }

  return res.json();
}

export async function generateAIListing(params: {
  productName: string;
  category?: string;
  platform?: string;
  targetMarket?: string;
  features?: string[];
  sellingPoints?: string;
}): Promise<AIResponse<AIListingResult>> {
  const res = await fetch('/api/ai/generate-listing', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || '后端 AI 刊登生成服务请求失败');
  }

  return res.json();
}

export async function generateAIInventoryAdvice(params: {
  sku: string;
  currentStock: number;
  dailySales: number;
  leadTimeDays: number;
  safetyDays?: number;
}): Promise<AIResponse<AIInventoryAdvisorResult>> {
  const res = await fetch('/api/ai/inventory-advisor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || '后端 AI 供应链分析失败');
  }

  return res.json();
}
