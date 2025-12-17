# Microservices Blog

A complete microservices project built with Node.js, Express, and MongoDB.

## Project Structure

```
microservices-blog/
├── gateway/                # API Gateway (Port 3000)
│   ├── index.js           # Proxy Logic
│   ├── package.json
│   └── Dockerfile
├── auth-service/           # Authentication Service (Port 3001)
│   ├── models/            # User Model
│   ├── routes/            # Auth Routes (Register, Login)
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── post-service/           # Post Service (Port 3002)
│   ├── models/            # Post Model
│   ├── middleware/        # JWT Authentication Middleware
│   ├── routes/            # Post Routes (List, Create)
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml      # Orchestration
```

## How to Run

1.  **Prerequisites**: Ensure Docker and Docker Compose are installed.
2.  **Start Services**:
    ```bash
    docker-compose up --build
    ```
3.  **Access API (Postman Kullanımı)**:

    **Yöntem 1: Kullanıcı Kaydı (Register)**
    - **URL**: `http://localhost:3000/auth/register`
    - **Method**: `POST`
    - **Body (JSON)**:
      ```json
      {
        "username": "testuser",
        "password": "testpassword"
      }
      ```

    **Yöntem 2: Giriş Yap (Login) -> Token Al** (Post atmak için zorunlu)
    - **URL**: `http://localhost:3000/auth/login`
    - **Method**: `POST`
    - **Body (JSON)**:
      ```json
      {
        "username": "testuser",
        "password": "testpassword"
      }
      ```
    - **Yanıt**: Size bir `{ "token": "..." }` verecek. Bu token'ı kopyalayın.

    **Yöntem 3: Post Paylaş (Create Post)**
    - **URL**: `http://localhost:3000/posts`
    - **Method**: `POST`
    - **Headers**:
      - `Content-Type`: `application/json`
      - `Authorization`: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQyOWZmMDM3NjlmNzk4ODJiMTFjMTgiLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNzY1OTc0MDExLCJleHAiOjE3NjU5Nzc2MTF9.m_CFDCHEIGD4A6xF0j34TgfZrU2t9UdCO8FWRPG4zvY` (Bearer ile token arasında boşluk bırakın)
    - **Body (JSON)**:
      ```json
      {
        "title": "Merhaba Mikroservisler",
        "content": "Bu benim ilk postum."
      }
      ```

    **Yöntem 4: Postları Görüntüle (List Posts)**
    - **URL**: `http://localhost:3000/posts`
    - **Method**: `GET`

See `walkthrough.md` in artifacts for detailed verification steps.
