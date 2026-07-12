# Yakamoz Erkek Kuaförü — Randevu Sistemi

React ile geliştirilmiş, mobil öncelikli bir berber randevu sistemi. Müşteriler online randevu
alır, berber (admin) randevuları onaylar/yönetir. Backend yoktur; tüm veri tarayıcının
`localStorage`'ında tutulur.

## Özellikler

- **Randevu alma akışı**: Ad-soyad, telefon (`0555 555 55 55` formatı), tarih, işlem seçimi;
  seçilen işleme göre süre ve ücret otomatik gösterilir.
- **Kapasite kontrolü**: Aynı saatte en fazla 2 randevu alınabilir; dolan saatler otomatik pasif
  hale gelir.
- **Çalışma saatleri**: Salı hariç her gün 09:00–19:00, 30 dakikalık dilimler.
- **Admin onayı**: Her randevu "Bekliyor" durumunda oluşur, berber onayladıktan sonra
  "Onaylandı" olur.
- **Engellenen müşteriler**: Admin sorunlu müşteriyi engelleyebilir; engellenen isimle yeni
  randevu oluşturulamaz. Engellenenler listesi admin panelinde her zaman görüntülenebilir.
- **Admin paneli**: Günlük randevu tablosu, randevu detayına tıklayınca (mobilde bildirim
  ekranı gibi açılan modal) tüm bilgiler, onaylama/iptal/silme/tarih değiştirme işlemleri.
- **Hizmet yönetimi**: Admin hizmet (saç kesimi, sakal tıraşı vb.), süre ve ücret
  ekleyip düzenleyebilir.
- **Randevularım**: Müşteri, telefon numarasıyla kendi randevu geçmişini sorgulayabilir.
- **Bildirimler**: React Toastify ile randevu oluşturuldu / saat dolu / telefon hatalı / admin
  onayı bekleniyor gibi anlık bildirimler.

## Teknoloji

React 19 · Vite · React Router v7 · React Hook Form · Day.js (tr locale) · React Toastify ·
Lucide React · Context API · LocalStorage

## Kurulum

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde açılır.

Prodüksiyon derlemesi için:

```bash
npm run build
npm run preview
```

## Admin girişi (demo)

Backend olmadığı için admin kimlik doğrulaması istemci tarafında simüle edilmiştir
(sahte/`none`-imzalı bir JWT üretilip `localStorage`'a yazılır). Gerçek bir üründe bu mutlaka
bir backend servisi tarafından yapılmalıdır.

- Kullanıcı adı: `admin`
- Şifre: `yakamoz2026`

Giriş bilgileri `src/context/AuthContext.jsx` içinde değiştirilebilir.

## Klasör yapısı

```
src/
  components/
    layout/     Header, Footer, ProtectedRoute
    ui/         Button, Input, Select, Modal, Card, Spinner, Badge, Calendar
    visuals/    Logo, BarberStripe (görsel/dekoratif bileşenler)
    services/   ServiceCard, ServiceForm, ServiceManagerList (işlem bileşenleri)
    pages/      Home, Services, BookAppointment, MyAppointments, AdminPanel, Login, NotFound
  context/      AppointmentContext, ServiceContext, BlockedCustomerContext, AuthContext, SettingsContext
  hooks/        useFetch, useAvailability, useDebounce
  utils/        dateUtils, validation, storage
  App.jsx       Provider ağacı + routing
  App.css       Projenin tüm stilleri (tek dosya)
```

## Bilinen sınırlamalar

- Backend yok; veriler yalnızca tarayıcıda saklanır (tarayıcı verisi temizlenirse randevular
  silinir).
- Admin kimlik doğrulaması demo amaçlıdır, prodüksiyonda kullanılmamalıdır.
- SMS/e-posta bildirimi gönderilmez, sadece uygulama içi toast bildirimleri vardır.
