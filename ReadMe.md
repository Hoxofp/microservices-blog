1. Proje Mimari Planı (Blueprint)
Bu planı projeyi savunurken veya raporlarken de kullanabilirsin.

Mimari Tipi: Containerized Microservices (Dockerize Edilmiş Mikroservisler)

İletişim Protokolü: HTTP/REST (JSON)

Orkestrasyon: Docker Compose (Local Geliştirme için)

Veritabanı: MongoDB (Her servis için mantıksal ayrım, ancak kolaylık için tek instance)

🏢 Servisler ve Görevleri:
API Gateway (/gateway) - Port: 3000

Teknoloji: Node.js, express-http-proxy

Görevi: Tüm dış trafiği karşılar. /auth isteklerini Auth servisine, /posts isteklerini Post servisine yönlendirir.

Auth Service (/auth-service) - Port: 3001

Teknoloji: Node.js, jsonwebtoken (JWT), bcryptjs, mongoose

Görevi: User şeması tutar. Kayıt (Register) ve Giriş (Login) işlemlerini yapar. Başarılı girişte JWT döner.

Post Service (/post-service) - Port: 3002

Teknoloji: Node.js, mongoose

Görevi: Post şeması tutar (title, content, author).

Güvenlik: Gelen istekteki JWT'yi doğrular (Middleware). Sadece geçerli token'ı olanlar yazı yazabilir.

mongodb+srv://Hoxofph:<db_password>@cluster0.32k8hhq.mongodb.net/?appName=Cluster0