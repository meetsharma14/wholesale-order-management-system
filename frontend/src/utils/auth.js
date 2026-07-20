export function decodeToken(token) {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    const decoded = JSON.parse(window.atob(padded));

    return {
      email: decoded.sub,
      role: decoded.role?.toUpperCase(),
      expiresAt: decoded.exp ? decoded.exp * 1000 : null,
    };
  } catch {
    return null;
  }
}

export function isTokenExpired(user) {
  return Boolean(user?.expiresAt && Date.now() >= user.expiresAt);
}

export function getHomePath(role) {
  if (role === "ADMIN") {
    return "/admin";
  }

  if (role === "SALESMAN") {
    return "/salesman";
  }

  if (role === "RETAILER") {
    return "/retailer";
  }

  return "/";
}
