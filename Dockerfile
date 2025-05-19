FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy pom.xml
COPY pom.xml ./

# Install Maven
RUN apt-get update && apt-get install -y maven

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn package -DskipTests

# Runtime image
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Create uploads directory
RUN mkdir -p /app/uploads
VOLUME /app/uploads

# Expose application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]