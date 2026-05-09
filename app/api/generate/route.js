import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req) {
  try {
    const { imageBase64, mimeType, brand, category, condition } = await req.json();

    if (!imageBase64 || !brand) {
      return Response.json({ error: "Missing image or brand" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `You are an expert UK Vinted reseller who knows realistic secondhand prices.

Analyse this item photo. Brand: "${brand}". Category: ${category}. Condition: ${condition}.

Respond with ONLY a raw JSON object — no markdown fences, no explanation, just valid JSON:
{"itemName":"short descriptive name","suggestedPrice":15,"priceMin":10,"priceMax":25,"title":"compelling Vinted title under 60 chars","description":"3-4 paragraph Vinted description with line breaks. Honest, appealing, mentions condition","tags":["tag1","tag2","tag3","tag4","tag5"],"colour":"main colour","material":"likely material","style":"e.g. Streetwear, Casual, Smart"}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mimeType, data: imageBase64 },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock) {
      return Response.json({ error: "Empty response from Claude" }, { status: 500 });
    }

    const cleaned = textBlock.text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return Response.json(
        { error: "Could not parse response as JSON", raw: cleaned.slice(0, 300) },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (e) {
    return Response.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
