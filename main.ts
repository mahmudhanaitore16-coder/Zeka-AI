// Zeka AI - Зерделі ассистент
Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  // CORS заголовкалары (HTML-ден сұрау келу үшін)
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  
  // OPTIONS сұрауына жауап (браузер алдын ала тексереді)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  if (url.pathname === "/ask" && req.method === "POST") {
    try {
      const { message } = await req.json();
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get("OPENROUTER_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "x-ai/grok-3-beta",
          messages: [
            { role: "system", content: "Сен Zeka AI - қазақ тілінде сөйлейтін зерделі ассистент." },
            { role: "user", content: message }
          ],
          max_tokens: 500,
        }),
      });
      
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Кешіріңіз, жауап ала алмадым.";
      
      return new Response(JSON.stringify({ reply }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Қате кетті" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
  }
  
  return new Response("🤖 Zeka AI жұмыс істеп тұр! POST /ask жіберіңіз", {
    headers: {
      "Content-Type": "text/plain",
      ...corsHeaders,
    },
  });
});
