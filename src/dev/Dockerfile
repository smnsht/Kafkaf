FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published backend
COPY  Kafkaf.API/bin/Release/net9.0/publish/ ./api/

# Copy prebuilt Angular static files
COPY kafkaf-client/dist/kafkaf-client/browser ./api/wwwroot

# Install handy packages
RUN apt-get update && apt-get install -y vim && \ 
    apt-get install -y curl && \ 
    apt-get install -y wget && \
    apt-get install -y telnet && \
    apt-get install -y less

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

WORKDIR /app/api
ENTRYPOINT ["dotnet", "Kafkaf.API.dll"]