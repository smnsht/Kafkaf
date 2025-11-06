<!-- This is a docker suitable for developers - to play arond with. In order to build it you need  dotnet SDK 9 installed on 
your machine, and Angular 20 cli. 

Docker image does not includes any real web server - Angular static files served by build it dotnet server - Kestrel.

Backend app runs as root, it not ment to be used in production environment. 
Also, image comes with couple of preinstalled utils, like less, vim, telnet, curl and wget.

How to build: (assuming developer on Windows machine, in the project root foolder Kafkaf)

cd Kafkaf.API
dotnet publish /p:UseAppHost=false
# replace appsettings.json file with required configuration
mv /Y bin\Release\net9.0\publish\appsettings.Development.json bin\Release\net9.0\publish\appsettings.json
cd ../kafkaf-client
ng build  --configuration production
cd ..

docker build -f dockerfile/dev/Dockerfile -t kafkaf-dev .
docker run -it --rm -p 8080:8080 kafkaf-dev -->

# KafkaF Web UI – Developer Docker Image

This Docker image is intended for **developers** to experiment and play around with the KafkaF web application.  
It is **not suitable for production use**.

## Requirements

Before building the image, ensure you have the following installed on your machine:

- **[.NET SDK 9](guide://action?prefill=Tell%20me%20more%20about%3A%20.NET%20SDK%209)**
- **[Angular CLI 20](guide://action?prefill=Tell%20me%20more%20about%3A%20Angular%20CLI%2020)**

## Notes

- The Docker image does not include a full web server. Angular static files are served by the built-in **[Kestrel](guide://action?prefill=Tell%20me%20more%20about%3A%20Kestrel)** server in .NET.
- The backend application runs as **[root](guide://action?prefill=Tell%20me%20more%20about%3A%20root)**. This setup is for development only and should not be used in production.
- The image comes with a few preinstalled utilities for convenience:
  - **[less](guide://action?prefill=Tell%20me%20more%20about%3A%20less)**
  - **[vim](guide://action?prefill=Tell%20me%20more%20about%3A%20vim)**
  - **[telnet](guide://action?prefill=Tell%20me%20more%20about%3A%20telnet)**
  - **[curl](guide://action?prefill=Tell%20me%20more%20about%3A%20curl)**
  - **[wget](guide://action?prefill=Tell%20me%20more%20about%3A%20wget)**

## Build Instructions (Windows Example)

Assuming you are in the project root folder `Kafkaf`:

```bash
cd Kafkaf.API
dotnet publish /p:UseAppHost=false

# Replace appsettings.json with the required configuration
mv /Y bin\Release\net9.0\publish\appsettings.Development.json bin\Release\net9.0\publish\appsettings.json

cd ../kafkaf-client
ng build --configuration production
cd ..
```

Now build and run the Docker image:

```bash
docker build -f dockerfile/dev/Dockerfile -t kafkaf-dev .
docker run -it --rm -p 8080:8080 kafkaf-dev
```
