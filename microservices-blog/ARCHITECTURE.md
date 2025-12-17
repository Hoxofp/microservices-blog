# 🏗️ MikroBlog - Mimari ve Tasarım Analizi

Bu belge, projenin mikroservis mimarisini ve kullanılan tasarım desenlerini detaylı şekilde açıklar.

---

## 📐 Mikroservis Mimarisi Analizi

### Bu Proje Gerçek Bir Mikroservis Mi?

**✅ EVET**, bu proje temel mikroservis prensiplerini takip eder:

| Prensip | Uygulanma Durumu | Açıklama |
|---------|-----------------|----------|
| **Bağımsız Servisler** | ✅ | Auth, Post ve Gateway ayrı container/process olarak çalışır |
| **Tek Sorumluluk (SRP)** | ✅ | Her servis tek bir iş yapar (Auth: kimlik doğrulama, Post: içerik yönetimi) |
| **Bağımsız Deploy** | ✅ | Her servis ayrı ayrı deploy edilebilir |
| **Ayrı Veri Tabanı** | ⚠️ | Şu an aynı MongoDB kullanılıyor (production'da ayrılmalı) |
| **API Gateway** | ✅ | Tek giriş noktası, routing ve CORS yönetimi |
| **Loose Coupling** | ✅ | Servisler HTTP üzerinden haberleşir, birbirine bağımlı değil |

### Servis Haritası


```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                           │
│               (Vite + TailwindCSS)                          │
│            Space Theme & Animations                         │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP Requests
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY                              │
│                    (Port 3000)                               │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ PRODUCTION FEATURES:                                    │ │
│  │ • Rate Limiting (100 req/15min)                        │ │
│  │ • Circuit Breaker (opossum)                            │ │
│  │ • Winston Logger (JSON)                                │ │
│  │ • Request ID Tracing (UUID)                            │ │
│  │ • API Versioning (/api/v1/)                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────┬──────────────┬──────────────────────┐     │
│  │ /api/v1/auth │ /api/v1/posts│  /api/v1/categories  │     │
│  └──────┬───────┴──────┬───────┴──────────┬───────────┘     │
└─────────┼──────────────┼──────────────────┼─────────────────┘
          │              │                  │
          ▼              ▼                  ▼
┌──────────────┐  ┌──────────────────────────────────┐
│ AUTH SERVICE │  │         POST SERVICE              │
│  (Port 3001) │  │         (Port 3002)               │
│              │  │                                   │
│  + Winston   │  │  + Winston Logger                 │
│  + Health    │  │  + Enhanced Health Check          │
│              │  │  ┌────────────┬─────────────┐     │
│  - Register  │  │  │   Posts    │ Categories  │     │
│  - Login     │  │  │   Votes    │ Comments    │     │
│  - JWT Gen   │  │  └────────────┴─────────────┘     │
└──────┬───────┘  └────────────────┬──────────────────┘
       │                           │
       └───────────┬───────────────┘
                   ▼
         ┌──────────────────┐
         │     MongoDB      │
         │   (Atlas Cloud)  │
         └──────────────────┘
```

### Production Özellikleri

| Özellik | Durum | Açıklama |
|---------|-------|----------|
| **Rate Limiting** | ✅ | `express-rate-limit` - 100 istek/15dk |
| **Circuit Breaker** | ✅ | `opossum` - Servis çökünce fallback |
| **Structured Logging** | ✅ | `winston` - JSON formatında loglar |
| **Request ID Tracing** | ✅ | `uuid` - Her istek için benzersiz ID |
| **API Versioning** | ✅ | `/api/v1/` prefix'i destekleniyor |
| **Enhanced Health Checks** | ✅ | DB durumu, uptime bilgisi |
| Service Discovery | ❌ | Consul/Eureka yok - URL'ler env variable |
| Message Queue | ❌ | RabbitMQ/Kafka yok - ayrı altyapı gerektirir |
| Centralized Logging | ❌ | ELK Stack yok - ayrı altyapı gerektirir |
| Distributed Tracing | ❌ | Jaeger/Zipkin yok - ayrı altyapı gerektirir |

---

## 🎨 Tasarım Desenleri

### 1. API Gateway Pattern
**Kullanıldığı Yer:** `gateway/index.js`

```javascript
app.use('/api/v1/auth', proxy(AUTH_SERVICE_URL, authProxyOptions));
app.use('/api/v1/posts', proxy(POST_SERVICE_URL, postProxyOptions));
```

**Açıklama:** Tüm client istekleri tek bir noktadan (Gateway) geçer. Bu pattern:
- Cross-cutting concerns (CORS, auth, rate limiting) merkezi yönetim
- Client'ın birden fazla servisi bilmesine gerek yok
- Load balancing ve rate limiting kolaylaşır

---

### 2. Circuit Breaker Pattern
**Kullanıldığı Yer:** `gateway/index.js` (opossum)

```javascript
const CircuitBreaker = require('opossum');
const breaker = new CircuitBreaker(proxyFunc, {
    timeout: 10000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000
});
```

**Açıklama:** Servis çöktüğünde:
- Breaker OPEN → Hızlı hata dönüşü, cascade failure önlenir
- 30 saniye sonra HALF-OPEN → Tekrar dener
- Başarılı → CLOSED, normal çalışma

---

### 3. Proxy Pattern
**Kullanıldığı Yer:** `express-http-proxy` kullanımı

**Açıklama:** Gateway, gelen istekleri değiştirmeden (veya minimal değişiklikle) hedef servise iletir.

---

### 4. Repository Pattern (Implicit)
**Kullanıldığı Yer:** Mongoose Model'leri (`models/Post.js`, `models/Category.js`)

```javascript
const posts = await Post.find().sort({ createdAt: -1 });
const newPost = new Post({ title, content });
await newPost.save();
```

---

### 5. Middleware Pattern
**Kullanıldığı Yer:** Express middleware zinciri

```javascript
app.use(rateLimiter);        // 1. Rate Limiting
app.use(requestIdMiddleware); // 2. Request ID
app.use(cors(...));          // 3. CORS
app.use(express.json());     // 4. Body parsing
```

---

### 6. Token-Based Authentication (JWT)
**Flow:**
1. Client → Login request
2. Auth Service → JWT üret, client'a gönder
3. Client → Her istekte `Authorization: Bearer <token>` header'ı
4. Post Service → Token'ı doğrula, userId'yi çıkar

---

### 7. Component Pattern (React)
**Kullanıldığı Yer:** Frontend React componentleri

```javascript
// Reusable animated components
<StarField />      // Background stars
<GlowCard />       // Glassmorphism card
<AnimatedText />   // Letter-by-letter animation
<PostCard />       // Post display with voting
```

---

## 📊 Veri Akışı

### Post Oluşturma Akışı (Production)
```
1. Frontend form + JWT token
   ↓
2. POST /api/v1/posts → Gateway
   ↓
3. Rate Limit Check (100 req/15min)
   ↓
4. Request ID eklenir (X-Request-ID: uuid)
   ↓
5. Winston Log: { method, url, requestId }
   ↓
6. Circuit Breaker → Proxy to Post Service
   ↓
7. Post Service → JWT verify → MongoDB.save()
   ↓
8. Response with Request-ID header
```

---

## 🔐 Güvenlik Önlemleri

| Önlem | Uygulama |
|-------|----------|
| Password Hashing | bcrypt ile salt + hash |
| JWT Authentication | Stateless token-based auth |
| CORS | Configurable origin whitelist |
| Rate Limiting | 100 requests per 15 minutes |
| Input Validation | Mongoose schema validation |
| XSS Prevention | React auto-escaping |

---

## 📁 Proje Yapısı

```
microservices-blog/
├── gateway/                    # API Gateway
│   ├── index.js               # Production features
│   └── package.json           # opossum, winston, rate-limit
├── auth-service/              # Authentication Service
│   ├── models/User.js
│   ├── routes/auth.js
│   └── index.js               # Winston logger
├── post-service/              # Content Service
│   ├── models/
│   │   ├── Post.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── posts.js
│   │   └── categories.js
│   └── index.js               # Winston logger
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── components/        # StarField, GlowCard, etc.
│   │   ├── pages/             # Home, Login, Register, CreatePost
│   │   └── services/api.js    # API client
│   ├── tailwind.config.js     # Space theme colors
│   └── package.json
└── docker-compose.yml
```
