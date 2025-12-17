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
│                        FRONTEND                             │
│                    (Static Files)                           │
│                  index.html, login.html                     │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP Requests
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY                              │
│                    (Port 3000)                               │
│  ┌──────────────┬──────────────┬──────────────────────┐     │
│  │   /auth/*    │  /posts/*    │    /categories/*     │     │
│  └──────┬───────┴──────┬───────┴──────────┬───────────┘     │
└─────────┼──────────────┼──────────────────┼─────────────────┘
          │              │                  │
          ▼              ▼                  ▼
┌──────────────┐  ┌──────────────────────────────────┐
│ AUTH SERVICE │  │         POST SERVICE              │
│  (Port 3001) │  │         (Port 3002)               │
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

### Production için Eksikler

| Özellik | Durum | Açıklama |
|---------|-------|----------|
| Service Discovery | ❌ | Consul/Eureka yok - URL'ler environment variable ile yönetiliyor |
| Circuit Breaker | ❌ | Hystrix/Resilience4j yok - servis çökerse cascade failure olabilir |
| Message Queue | ❌ | RabbitMQ/Kafka yok - async işlemler için gerekli |
| Centralized Logging | ❌ | ELK Stack yok - her servis kendi log'unu tutuyor |
| Distributed Tracing | ❌ | Jaeger/Zipkin yok - request takibi zor |
| API Versioning | ❌ | /v1/auth gibi versiyonlama yok |

---

## 🎨 Tasarım Desenleri

### 1. API Gateway Pattern
**Kullanıldığı Yer:** `gateway/index.js`

```javascript
app.use('/auth', proxy(AUTH_SERVICE_URL, {...}));
app.use('/posts', proxy(POST_SERVICE_URL, {...}));
```

**Açıklama:** Tüm client istekleri tek bir noktadan (Gateway) geçer. Bu pattern:
- Cross-cutting concerns (CORS, auth) merkezi yönetim
- Client'ın birden fazla servisi bilmesine gerek yok
- Load balancing ve rate limiting kolaylaşır

---

### 2. Proxy Pattern
**Kullanıldığı Yer:** `express-http-proxy` kullanımı

**Açıklama:** Gateway, gelen istekleri değiştirmeden (veya minimal değişiklikle) hedef servise iletir. Request/Response'u intercept edebilir.

---

### 3. Repository Pattern (Implicit)
**Kullanıldığı Yer:** Mongoose Model'leri (`models/Post.js`, `models/Category.js`)

```javascript
const posts = await Post.find().sort({ createdAt: -1 });
const newPost = new Post({ title, content });
await newPost.save();
```

**Açıklama:** Mongoose modelleri, veri erişim katmanı (DAL) görevi görür. Business logic, veri erişim detaylarından soyutlanmış olur.

---

### 4. Middleware Pattern
**Kullanıldığı Yer:** Express middleware zinciri

```javascript
app.use(cors(...));                    // 1. CORS
app.use(express.json());               // 2. Body parsing
app.use('/posts', isAuthenticated);    // 3. Auth check
```

**Açıklama:** İstekler bir zincirden geçer, her middleware kendi işini yapar ve next()'i çağırır.

---

### 5. MVC-lite (Model-Route-Response)
**Yapı:**
```
Service/
├── models/      → Model (Mongoose Schema)
├── routes/      → Controller (Request handling)
├── middleware/  → Cross-cutting concerns
└── index.js     → Bootstrap
```

**Açıklama:** Klasik MVC'de View katmanı var, ama API'lerde View yerine JSON response kullanılır.

---

### 6. Token-Based Authentication (JWT)
**Kullanıldığı Yer:** `auth-service/routes/auth.js`, `post-service/middleware/auth.js`

**Flow:**
1. Client → Login request
2. Auth Service → JWT üret, client'a gönder
3. Client → Her istekte `Authorization: Bearer <token>` header'ı
4. Gateway/Service → Token'ı doğrula, userId'yi çıkar

---

### 7. Module Pattern
**Kullanıldığı Yer:** Frontend JS dosyaları (`api.js`, `auth.js`, `theme.js`)

```javascript
const api = {
    async request(endpoint, options) {...},
    async login(username, password) {...}
};
```

**Açıklama:** Related functions bir obje altında gruplandırılır, global namespace kirliliği önlenir.

---

## 📊 Veri Akışı

### Kullanıcı Kayıt Akışı
```
1. Frontend form submit
   ↓
2. fetch('/auth/register', { username, password })
   ↓
3. Gateway → Proxy to Auth Service
   ↓
4. Auth Service → bcrypt.hash(password) → MongoDB.save()
   ↓
5. Response → { message: "User registered" }
```

### Post Oluşturma Akışı
```
1. Frontend form + JWT token
   ↓
2. fetch('/posts', { title, content, categoryId })
   ↓
3. Gateway → Proxy to Post Service
   ↓
4. Post Service → isAuthenticated middleware → JWT verify
   ↓
5. Post.create({ author: userId, ... }) → Category.updatePostCount()
   ↓
6. Response → { post object }
```

---

## 🔐 Güvenlik Önlemleri

| Önlem | Uygulama |
|-------|----------|
| Password Hashing | bcrypt ile salt + hash |
| JWT Authentication | Stateless token-based auth |
| CORS | Configurable origin whitelist |
| Input Validation | Mongoose schema validation |
| XSS Prevention | Frontend'de escapeHtml() |

---

## 📁 Proje Yapısı

```
microservices-blog/
├── gateway/           # API Gateway
│   ├── index.js      # CORS, proxy routing
│   └── package.json
├── auth-service/      # Authentication Service
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js   # login, register
│   └── index.js
├── post-service/      # Content Service
│   ├── models/
│   │   ├── Post.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── posts.js
│   │   └── categories.js
│   ├── middleware/
│   │   └── auth.js   # JWT verify
│   └── index.js
├── frontend/          # Static Frontend
│   ├── css/style.css
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── theme.js
│   │   └── config.js
│   └── *.html
└── docker-compose.yml # Local orchestration
```
