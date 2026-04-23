# 1단계: 빌드 환경 (Build Stage)
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Gradle 래퍼와 설정 파일 복사 (캐싱 활용을 위해 소스보다 먼저 복사)
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# 의존성 미리 다운로드 (소스 변경 시에도 의존성 층은 캐싱됨)
RUN chmod +x ./gradlew
RUN ./gradlew dependencies --no-daemon

# 소스 코드 복사 및 빌드
COPY src src
RUN ./gradlew bootJar -x test --no-daemon

# 2단계: 실행 환경 (Run Stage)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 빌드 단계에서 생성된 JAR 파일만 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 운영 시 보안을 위해 root가 아닌 일반 유저로 실행 (권장 사항)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# 컨테이너 실행 명령
ENTRYPOINT ["java", "-jar", "app.jar"]