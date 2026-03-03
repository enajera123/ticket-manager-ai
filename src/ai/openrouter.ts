import type { AITicketResponse, AIClassificationResult } from "@/model/Ticket";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `Eres un asistente de gestión de proyectos experto. Tu trabajo es analizar solicitudes de usuarios y generar tickets estructurados.

Cuando recibas un mensaje del usuario, debes:
1. Detectar el TIPO de ticket:
   - BUG: Errores, fallos, comportamientos inesperados
   - FEATURE: Nuevas funcionalidades o características
   - IMPROVEMENT: Mejoras a funcionalidades existentes
   - TASK: Tareas generales de desarrollo o mantenimiento
   - SUPPORT: Solicitudes de ayuda o soporte técnico

2. Asignar una PRIORIDAD:
   - CRITICAL: Bloquea el sistema o afecta a todos los usuarios
   - HIGH: Afecta funcionalidades importantes pero hay workaround
   - MEDIUM: Mejora deseable pero no urgente
   - LOW: Nice-to-have, puede esperar

3. Estimar TIEMPO en horas para completar la tarea

4. Calcular una FECHA LÍMITE razonable basada en la prioridad:
   - CRITICAL: 1 día
   - HIGH: 3 días
   - MEDIUM: 7 días
   - LOW: 14 días

5. Generar TAGS relevantes (máximo 5)

6. Crear un TÍTULO conciso y una DESCRIPCIÓN detallada

La fecha actual es: {{CURRENT_DATE}}

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido, sin markdown, sin bloques de código, sin texto adicional. El JSON debe tener exactamente esta estructura:
{
  "title": "string",
  "description": "string",
  "type": "BUG | FEATURE | IMPROVEMENT | TASK | SUPPORT",
  "priority": "CRITICAL | HIGH | MEDIUM | LOW",
  "estimatedHours": number,
  "deadline": "YYYY-MM-DD",
  "tags": ["string"]
}`;

export async function classifyTicketWithAI(
    prompt: string,
    apiKey: string,
    model: string = "google/gemini-2.0-flash-001"
): Promise<AIClassificationResult> {
    const currentDate = new Date().toISOString().split("T")[0];
    const systemPrompt = SYSTEM_PROMPT.replace("{{CURRENT_DATE}}", currentDate);

    const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "AI Ticket Generator",
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 1000,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            `OpenRouter API error: ${response.status} - ${errorData?.error?.message || response.statusText}`
        );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("No se recibió respuesta de la IA");
    }

    // Extract usage/cost info from response
    const usage = data.usage ?? {};
    const promptTokens = usage.prompt_tokens ?? 0;
    const completionTokens = usage.completion_tokens ?? 0;
    const totalTokens = promptTokens + completionTokens;

    // OpenRouter may include pricing in the response or model metadata
    // We calculate cost based on model pricing (per token)
    const promptCostPerMillion = parseFloat(data.model_pricing?.prompt ?? "0") * 1_000_000;
    const completionCostPerMillion = parseFloat(data.model_pricing?.completion ?? "0") * 1_000_000;

    // Calculate actual cost
    const promptCost = promptTokens * parseFloat(data.model_pricing?.prompt ?? "0");
    const completionCost = completionTokens * parseFloat(data.model_pricing?.completion ?? "0");
    const totalCost = promptCost + completionCost;

    // Clean possible markdown code blocks
    const cleanedContent = content
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

    try {
        const parsed: AITicketResponse = JSON.parse(cleanedContent);

        // Validate required fields
        const requiredFields: (keyof AITicketResponse)[] = [
            "title", "description", "type", "priority", "estimatedHours", "deadline", "tags",
        ];
        for (const field of requiredFields) {
            if (parsed[field] === undefined || parsed[field] === null) {
                throw new Error(`Campo requerido faltante: ${field}`);
            }
        }

        return {
            ticket: parsed,
            cost: {
                model,
                usage: { promptTokens, completionTokens, totalTokens },
                promptCostPerMillion,
                completionCostPerMillion,
                totalCost,
            },
        };
    } catch (e) {
        if (e instanceof SyntaxError) {
            throw new Error(`Error al parsear la respuesta de la IA: ${cleanedContent}`);
        }
        throw e;
    }
}
