// ASSUMPTION: POST /users/login returns a JWT (consistent with "authenticated
// via Spring Security" in the PRD's US-001 acceptance criteria) whose payload
// contains the user's id, under a claim named "userId", "id", or the
// standard "sub" claim. This is a common Spring Security JWT pattern, but it
// was NOT confirmed by the provided controller/DTO code — if your backend's
// token doesn't carry the id this way, either add that claim server-side or
// change POST /users/login to return { token, userId } as a JSON object
// instead of a raw string, and simplify this helper accordingly.
export function extractUserIdFromToken(token: string): number | null {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);
    const candidate = payload.userId ?? payload.id ?? payload.sub;
    const parsed = Number(candidate);
    return Number.isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
}
