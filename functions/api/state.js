export async function onRequest({ request, env }) {
  const KEY = "global_state_v1";

  if (!env.LISTA_CASA_NOVA) {
    return new Response("KV não configurado", { status: 500 });
  }

  // Headers anti-cache (ESSENCIAL)
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0"
  };

  // GET: retorna o estado salvo
  if (request.method === "GET") {
    const data = await env.LISTA_CASA_NOVA.get(KEY);
    return new Response(data || "{}", { headers });
  }

  // PUT: salva o estado
  if (request.method === "PUT") {
    const body = await request.text();

    try {
      JSON.parse(body);
    } catch {
      return new Response("JSON inválido", { status: 400 });
    }

    await env.LISTA_CASA_NOVA.put(KEY, body);
    return new Response(JSON.stringify({ ok: true }), { headers });
  }

  return new Response("Método não permitido", {
    status: 405,
    headers
  });
}
