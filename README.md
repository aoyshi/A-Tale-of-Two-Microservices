# A-Tale-of-Two-Microservices

2 Node microservices (Romeo and Juliet) with a simple React client and event broker, all made from scratch and souped up with Docker, Kubernetes, Ingress NGINX and Skaffold.

### Clone repo and create working branch

`git init`

`git clone git@github.com:aoyshi/A-Tale-of-Two-Microservices.git`

`cd A-Tale-of-Two-Microservices/`

`git checkout -b "feature/your-local-branch-name"`

### Create base node project

`npm init`

`npm install express nodemon axios crypto`

I created a GET route to `/romeo/rocks`

Listening at port `3001`

### Containerize using Docker

Create base `Dockerfile` and `.dockerignore` file in project dir

Create docker image with custom tag

`docker build -t aoyshi/romeo .`

Create and start container from above image tag

`docker run aoyshi/romeo`

Print out all runnning containers and confirm above steps

`docker ps`

Push to docker hub

`docker push aoyshi/romeo`

### Wrap container in Kubernetes Pod

Create pod config file `romeo.yaml` in `infra/k8s` dir

Tell kubernetes to process config and create pod

`kubectl apply -f romeo.yaml`

Confirm your pod is created and running

`kubectl get pods`

Get logs and info about your pod

`kubectl logs romeo`

`kubectl describe pod romeo`

### Create Kubernetes Deployment to manage Pod

Delete the `romeo.yaml` file or inactivate it by renaming `romeo.yaml.old`, because we will include Pod details in deployment config file directly `romeo-depl.yaml`

Tell kubernetes to process config and create deployment

`kubectl apply -f romeo-depl.yaml`

Confirm your deployment is created and running

`kubectl get deployments`

Get info about your deployment

`kubectl describe deployment romeo-depl`

Confirm that your deployment created a running pod with name `romeo-depl-xxxxxxxxxx-xxxxx`

`kubectl get pods`

Delete that pod

`kubectl delete pod romeo-depl-xxxxxxxxxx-xxxxx`

Now if you list out all pods, another romeo-depl-xxx... pod should be re-created by your deployment automatically

`kubectl get pods`

### Create Kubernetes Node Port Service to access Pod from outside (dev only)

Create service config file `romeo-np-srv.yaml`

Tell kubernetes to process config and create deployment

`kubectl apply -f romeo-np-srv.yaml`

Confirm your deployment is created and running

`kubectl get services`

Get info about your service

`kubectl describe service romeo-np-srv`

`romeo-np-srv` service should appear in the list. The PORTS column should have a 3xxxx randomly assigned port that you can use to access your service from outside k8s cluster.

Using browser/POSTMAN, reach pod via:

`http://localhost:3xxxx/romeo/rocks`

### Making code updates

Every time source code changes are made:

Re-build docker image and push to hub (in project dir)

`docker build -t aoyshi/romeo .`

`docker push aoyshi/romeo`

Restart deployment file (in infra/k8s dir)

`kubectl rollout restart deployment`

### Create Kubernetes ClusterIP Service to access Pod from within cluster

Co-locate clusterIP service configs within depl file, since they are always 1:1 ratio.

Re-apply deply config file to create the service

`kubectl apply -f romeo-depl.yaml`

Confirm creation

`kubectl get services`

From other pods in cluster, reach romeo pod via:

`http://romeo-srv:3001/romeo/rocks`

### Install Ingress-NGINX

Follow directions from their website:

`https://kubernetes.github.io/ingress-nginx/deploy/`

### Configure Ingress-NGINX Controller

Create Ingress config file `ingress-srv.yaml` with routing rules (mapping URL to Services)

Apply config

`kubectl apply -f ingress-srv.yaml`

My host in the config file is `host: romeojuliet.com`

### Window Hosts File Changes

Open Windows Hosts File as Admin

`C:\Windows\System32\drivers\etc\hosts`

Add this line to the end of the file (so all DNS hits to romeojuliet.com will be re-routed to localhost)

`127.0.0.1 romeojuliet.com`

Open Windows cmd as admin and flush DNS cache

`ipconfig /flushdns`

Now from browser/POSTMAN, we can access pods via:

`http://romeojuliet.com/romeo/rocks`

### Skaffold Setup

Skaffold runs OUTSIDE of k8s cluster and automates a lot of the above processes when updating source code or config files.

1. Upon startup: applies all k8s config files
2. Running/watching: re-apply any config to our cluster if it changes
3. Upon shutdown: delete all objects related to these config files from cluster

Install Skaffold (Windows: use powershell, not cmd)

`https://skaffold.dev/docs/install/`

Create Skaffold config file in root dir of entire project (outside infra): `skaffold.yaml`

Start Skaffold

`skaffold dev`

Now if you make changes to sourcecode/configs, skaffold should auto update everything for you. `Ctrl+C` to stop Skaffold.

## Remote Development using Google Cloud

1. Sign up for Google Cloud account and create a new project. For exampe, `romeojuliet-dev`.
2. Create a Cluster under Kubernetes Engine. Name the cluster `romeojuliet-dev` and set the Location to the one closest to you geographically. Mine was`us-east1-c`.
3. Install Google SDK. Confirm by typing "gcloud" in terminal to see help text. Login using `gcloud auth login`.
4. Initialize Google SDK - `gcloud init` -> choose your current Google Cloud account email and project ID (this might be different based on what GCloud randomly assigned it to be unique - go to projects page and find the exact unique ID). Choose same Zone as `us-east1-c` in Step 2.
5. Install GCloud Context: `gcloud container clusters get-credentials romeojuliet-dev`. 
6. Make sure your PC kubernetes is now using the GCloud context instead of your local docker-desktop context for creating all clusters: `kubectl config get-contexts`. Change default context using `kubectl config use-context <context-name>`
7. Go to Google Cloud account and ENABLE Google Cloud Build (the History tab in this section will house all logs of builds using `skaffold dev`)
8. Make changes to `skaffold.yml` and `romeo-depl.yml` (see `skaffold.yaml.remote` and `romeo-depl.yml.remote` for syntax) to work with gcloud context.
9. Once in the gcloud context, set up ingress-nginx using same steps as installing it locally.
10. In your PC's hosts file -> map `romeojuliet.com` to IP address of the load balancer created by Ingress-Nginx on GCloud. Go to GC's Networking > Networking Services > Load Balancing ----> It will have its own IP address, e.g. `33.33.333.333   romeojuliet.com`

