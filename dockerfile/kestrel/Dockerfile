# Stage 1: Build the Angular frontend
FROM node:lts-alpine AS angular-build
WORKDIR /app/kafkaf-client
COPY kafkaf-client/package.json kafkaf-client/package-lock.json ./
RUN npm install
COPY kafkaf-client/ .
RUN npm run build

# Stage 2: Build the .NET Core backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dotnet-build
WORKDIR /app/api
COPY Kafkaf.API/*.csproj ./
RUN dotnet restore
COPY Kafkaf.API/ .
RUN dotnet build -c Release -o /app/build

# Stage 3: Publish the .NET Core application
FROM dotnet-build AS publish
WORKDIR /app/api
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Stage 4: Final image for running the application
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app/api

# Copy published backend and built frontend
COPY --from=publish /app/publish .
COPY --from=angular-build /app/kafkaf-client/dist/kafkaf-client/browser ./wwwroot

# Create non-root user
RUN addgroup --system kafkaf && adduser --system --ingroup kafkaf kafkaf

# Give ownership of app files
RUN chown -R kafkaf:kafkaf /app/api

# Switch to non-root user
USER kafkaf

EXPOSE 8080
ENTRYPOINT ["dotnet", "Kafkaf.API.dll"]