import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";
import { nameKey } from "../utils/validation";

const BlockedCustomerContext = createContext(null);

export function BlockedCustomerProvider({ children }) {
  const [blockedCustomers, setBlockedCustomers] = useState(() =>
    loadFromStorage(STORAGE_KEYS.BLOCKED_CUSTOMERS, [])
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BLOCKED_CUSTOMERS, blockedCustomers);
  }, [blockedCustomers]);

  function blockCustomer(fullName, phone, reason = "") {
    const entry = {
      id: `blk-${Date.now()}`,
      fullName,
      phone,
      reason,
      blockedAt: new Date().toISOString(),
    };
    setBlockedCustomers((prev) => [...prev, entry]);
    return entry;
  }

  function unblockCustomer(id) {
    setBlockedCustomers((prev) => prev.filter((b) => b.id !== id));
  }

  /** Ad-soyad kontrolü ile müşterinin engelli listede olup olmadığını döner. */
  function isCustomerBlocked(fullName) {
    const key = nameKey(fullName);
    return blockedCustomers.some((b) => nameKey(b.fullName) === key);
  }

  return (
    <BlockedCustomerContext.Provider
      value={{ blockedCustomers, blockCustomer, unblockCustomer, isCustomerBlocked }}
    >
      {children}
    </BlockedCustomerContext.Provider>
  );
}

export function useBlockedCustomers() {
  const ctx = useContext(BlockedCustomerContext);
  if (!ctx) throw new Error("useBlockedCustomers, BlockedCustomerProvider içinde kullanılmalı");
  return ctx;
}
