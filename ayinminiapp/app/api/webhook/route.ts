export async function POST(request: Request) {
  const body = await request.json();

  // Log webhook events for now
  console.log("[AYIN Webhook]", JSON.stringify(body));

  // TODO Phase 4: Handle notification token grants,
  // send notifications when agent scores change, mandates expire, etc.

  return Response.json({ success: true });
}
