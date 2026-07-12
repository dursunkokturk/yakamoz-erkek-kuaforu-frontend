// İsim/soyisim: sadece harf (TR karakterler dahil) ve tek boşluklar
const NAME_REGEX = /^[A-Za-zÇçĞğİıÖöŞşÜü]+(?: [A-Za-zÇçĞğİıÖöŞşÜü]+)*$/;

// Türkiye cep telefonu: 0555 555 55 55 formatı
const PHONE_DISPLAY_REGEX = /^0\d{3} \d{3} \d{2} \d{2}$/;

export function normalizeName(value) {
  return value.trim().replace(/\s+/g, " ").normalize("NFC");
}

export function isValidName(value) {
  const normalized = normalizeName(value);
  return normalized.length >= 2 && NAME_REGEX.test(normalized);
}

/** Kullanıcı yazarken ham girdiyi "0555 555 55 55" formatına dönüştürür. */
export function formatPhoneInput(rawValue) {
  const digits = rawValue.replace(/\D/g, "").slice(0, 11);
  let formatted = digits;
  if (digits.length > 0) formatted = digits.slice(0, 4);
  if (digits.length > 4) formatted += " " + digits.slice(4, 7);
  if (digits.length > 7) formatted += " " + digits.slice(7, 9);
  if (digits.length > 9) formatted += " " + digits.slice(9, 11);
  return formatted;
}

export function isValidPhone(value) {
  return PHONE_DISPLAY_REGEX.test(value.trim());
}

/** İsim/soyisim karşılaştırması için normalize edilmiş, küçük harfli anahtar üretir (engelli müşteri kontrolü için). */
export function nameKey(value) {
  return normalizeName(value).toLocaleLowerCase("tr-TR");
}
