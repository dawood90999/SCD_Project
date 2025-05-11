# MERN Application with Kubernetes Deployment

This project demonstrates a MERN (MongoDB, Express.js, React.js, Node.js) application deployed using Kubernetes and Minikube.

## Prerequisites

- Docker
- Minikube
- kubectl
- Node.js 18+
- MongoDB Atlas account (for database)

## Project Structure

```
.
├── frontend/           # React frontend application
├── backend/           # Node.js backend application
├── k8s/              # Kubernetes configuration files
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-service.yaml
│   └── backend-service.yaml
└── .github/
    └── workflows/
        └── deploy.yml
```

## Local Development

1. Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

2. Start the backend:

```bash
cd backend
npm install
npm start
```

## Docker Build

1. Build frontend image:

```bash
cd frontend
docker build -t your-dockerhub-username/mern-frontend:latest .
```

2. Build backend image:

```bash
cd backend
docker build -t your-dockerhub-username/mern-backend:latest .
```

## Kubernetes Deployment

1. Start Minikube:

```bash
minikube start
```

2. Create namespace:

```bash
kubectl create namespace mern-app
```

3. Create MongoDB secret:

```bash
kubectl create secret generic mongodb-secret \
  --namespace mern-app \
  --from-literal=uri=your-mongodb-uri
```

4. Deploy the application:

```bash
cd k8s
kubectl apply -f frontend-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f backend-service.yaml
```

5. Access the application:

```bash
minikube service frontend-service -n mern-app
```

## GitHub Actions Setup

1. Add the following secrets to your GitHub repository:

   - DOCKER_USERNAME
   - DOCKER_PASSWORD
   - MONGODB_URI

2. Set up a self-hosted runner on your machine where Minikube is running.

3. Push your code to the main branch to trigger the deployment.

## Monitoring

1. Check pod status:

```bash
kubectl get pods -n mern-app
```

2. Check services:

```bash
kubectl get services -n mern-app
```

3. Check deployments:

```bash
kubectl get deployments -n mern-app
```

## Troubleshooting

1. View pod logs:

```bash
kubectl logs <pod-name> -n mern-app
```

2. Describe resources:

```bash
kubectl describe pod <pod-name> -n mern-app
kubectl describe service <service-name> -n mern-app
```

## Cleanup

1. Delete the deployment:

```bash
kubectl delete -f k8s/
```

2. Delete the namespace:

```bash
kubectl delete namespace mern-app
```

3. Stop Minikube:

```bash
minikube stop
```
