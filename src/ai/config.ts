import type { AIRequestConfig, AIResponse } from "@/lib/types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function runAI<T>({
    apiKey,
    model,
    systemPrompt,
    userPrompt,
    temperature = 0.2,
    maxTokens = 1000,
}: AIRequestConfig): Promise<AIResponse<T>> {

    const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": globalThis.location.origin,
            "X-Title": "AI Engine",
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature,
            max_tokens: maxTokens,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            `OpenRouter API error: ${response.status} - ${errorData?.error?.message || response.statusText
            }`
        );
    }
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
        throw new Error("AI returned empty response");
    }
    const cleaned = content
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

    let parsed: T;

    try {
        parsed = JSON.parse(cleaned);
    } catch {
        throw new Error(`Invalid JSON response: ${cleaned}`);
    }
    const usage = data.usage ?? {};
    const promptTokens = usage.prompt_tokens ?? 0;
    const completionTokens = usage.completion_tokens ?? 0;
    const totalTokens = promptTokens + completionTokens;
    const promptPrice = parseFloat(data.model_pricing?.prompt ?? "0");
    const completionPrice = parseFloat(data.model_pricing?.completion ?? "0");
    const promptCost = promptTokens * promptPrice;
    const completionCost = completionTokens * completionPrice;
    const totalCost = promptCost + completionCost;
    return {
        data: parsed,
        cost: {
            model,
            completionCost: completionCost,
            promptCost: promptCost,
            totalTokens,
            completionTokens,
            promptTokens,
            totalCost,
        },
    };
}