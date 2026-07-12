import { createContext, useContext, useState } from "react";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";

const AuthContext = createContext(null);

// Backend olmadığı için gerçek bir kimlik sunucusu yok. Bu, demo/portfolyo amaçlı
// istemci tarafında üretilen, base64 ile kodlanmış sahte bir JWT'dir. Gerçek bir
// üründe bu doğrulama mutlaka bir backend servisi tarafından yapılmalıdır.
const ADMIN_CREDENTIALS = { username: "admin", password: "yakamoz2026" };
const TOKEN_TTL_MS = 1000 * 60 * 60 * 8; // 8 saat

function base64urlEncode(obj) {
  return btoa(JSON.stringify(obj)).replace(/=/g, "");
}

function base64urlDecode(str) {
  try {
    return JSON.parse(atob(str));
  } catch {
    return null;
  }
}

function createFakeToken(username) {
  const header = base64urlEncode({ alg: "none", typ: "JWT" });
  const payload = base64urlEncode({
    sub: username,
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS,
  });
  return `${header}.${payload}.demo-signature`;
}

function decodeToken(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payload = base64urlDecode(parts[1]);
  if (!payload || payload.exp < Date.now()) return null;
  return payload;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => loadFromStorage(STORAGE_KEYS.AUTH_TOKEN, null));
  const payload = decodeToken(token);
  const isAuthenticated = Boolean(payload);

  function login(username, password) {
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      throw new Error("INVALID_CREDENTIALS");
    }
    const newToken = createFakeToken(username);
    setToken(newToken);
    saveToStorage(STORAGE_KEYS.AUTH_TOKEN, newToken);
    return newToken;
  }

  function logout() {
    setToken(null);
    saveToStorage(STORAGE_KEYS.AUTH_TOKEN, null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUsername: payload?.sub ?? null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalı");
  return ctx;
}
