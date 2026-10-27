# Sign Bridge Backend :sign_language: → :speech_balloon:

![Docker](https://img.shields.io/badge/Docker-✓-blue?logo=docker)
![Kubernetes](https://img.shields.io/badge/Kubernetes-✓-326CE5?logo=kubernetes)
![Express.js](https://img.shields.io/badge/Express.js-✓-000000?logo=express)

**Real-time API for Sign Language to Text Conversion in Messaging Applications**  
Version: 1.0.0

## :sparkles: Key Features
- **Sign Language Processing API** for video/image analysis
- Real-time message conversion from sign language gestures to text
- WebSocket support for live communication
- Integration with ML models for gesture recognition
- Message history storage and retrieval
- User authentication for personalized experiences
- Containerized microservices architecture
- Kubernetes-ready horizontal scaling

## :wrench: Prerequisites
- Node.js v18+
- Python 3.9+ (for ML model integration)
- TensorFlow Serving (for gesture recognition)
- MongoDB v6+ (message storage)
- Redis (real-time pub/sub)
- Docker Engine 24.0+
- Kubernetes Cluster (AWS EC2)

## :computer: Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-username/sign-bridge-backend.git
cd sign-bridge-backend
```
Dockerhub link:<a href="https://hub.docker.com/repository/docker/mubaraklouis/signbridgebackend/general">signe-brigde-backend-image<a/>

## :key: Configuration

All configuration and secrets are read from environment variables. Nothing secret is
committed to this repository, and the app exits at startup with a clear error if a
required variable is missing.

| Variable          | Required | Default       | Description                                                      |
|-------------------|----------|---------------|------------------------------------------------------------------|
| `MONGODB_URI`     | yes      | –             | MongoDB connection string, e.g. `mongodb+srv://<user>:<password>@<cluster>/<db>` |
| `TOKEN_SECRET`    | yes      | –             | Secret used to sign JWT access tokens. Generate with `openssl rand -hex 32` |
| `EXPIRATION_TIME` | no       | `1h`          | JWT lifetime (any value accepted by `jsonwebtoken`, e.g. `15m`, `1h`, `7d`) |
| `PORT`            | no       | `4000`        | HTTP port                                                        |
| `NODE_ENV`        | no       | –             | Set to `production` in deployments; `.env` is only loaded when it is not `production` |

**Local development:** `cp .env.example .env` and fill in real values. `.env` is git-ignored.

**Kubernetes:** values come from the `sign-bridge-secrets` Secret (see `kube/secret.example.yaml`).
Create it with `kubectl`; never commit a Secret with real values:
```bash
kubectl create secret generic sign-bridge-secrets \
  --from-literal=MONGODB_URI='mongodb+srv://<user>:<password>@<cluster>/<db>' \
  --from-literal=TOKEN_SECRET="$(openssl rand -hex 32)"
```

**GitHub Actions:** any secret a workflow needs is stored under *Settings → Secrets and variables → Actions*
and referenced as `${{ secrets.NAME }}`, never read from files in the repo.

### 1. Docker installation
```bash
docker pull mubaraklouis/signbridgebackend:1.1.0

