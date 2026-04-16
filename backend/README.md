# FoodHub Backend API

Spring Boot REST API for FoodHub food delivery system.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 15+ (or Supabase account)

### Setup

1. **Clone and navigate**
```bash
cd backend
```

2. **Configure database**
```bash
# Copy example config
cp src/main/resources/application.yml.example src/main/resources/application.yml

# Edit with your database credentials
DATABASE_URL=jdbc:postgresql://localhost:5432/foodhub
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
```

3. **Run database schema**
```bash
psql -U postgres -d foodhub -f ../database/schema.sql
```

4. **Build and run**
```bash
mvn clean install
mvn spring-boot:run
```

5. **Verify**
```bash
curl http://localhost:8080/api/v1/actuator/health
```

## 📁 Project Structure

```
src/main/java/com/foodhub/
├── config/              # Configuration classes
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── AsyncConfig.java
├── controller/          # REST controllers
│   ├── AuthController.java
│   ├── OrderController.java
│   ├── MenuController.java
│   └── RiderController.java
├── service/             # Business logic
│   ├── UserService.java
│   ├── OrderService.java
│   ├── OtpService.java
│   ├── SmsService.java
│   └── NotificationService.java
├── repository/          # Data access
│   ├── UserRepository.java
│   ├── OrderRepository.java
│   └── OtpCodeRepository.java
├── model/               # JPA entities
│   ├── User.java
│   ├── Order.java
│   └── OtpCode.java
├── dto/                 # Data transfer objects
│   ├── request/
│   └── response/
├── security/            # Security components
│   ├── JwtTokenProvider.java
│   └── JwtAuthenticationFilter.java
└── exception/           # Exception handling
    ├── GlobalExceptionHandler.java
    └── custom/
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/foodhub
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password

# JWT
JWT_SECRET=your-256-bit-secret-key

# SMS (Hubtel)
HUBTEL_API_KEY=your_api_key
HUBTEL_API_SECRET=your_api_secret
HUBTEL_SENDER_ID=FoodHub

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_key

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

### Profiles

**Development** (default)
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=development
```

**Production**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=production
```

## 📚 API Documentation

See [API_SPECIFICATION.md](../docs/API_SPECIFICATION.md) for complete API documentation.

### Key Endpoints

```
POST   /api/v1/auth/register          # Register user
POST   /api/v1/auth/login             # Login
GET    /api/v1/menu/products          # Get menu
POST   /api/v1/orders                 # Place order
PUT    /api/v1/orders/{id}/confirm    # Confirm order (vendor)
POST   /api/v1/otp/verify             # Verify OTP (rider)
GET    /api/v1/notifications          # Get notifications
```

## 🧪 Testing

### Run all tests
```bash
mvn test
```

### Run specific test
```bash
mvn test -Dtest=OrderServiceTest
```

### Integration tests
```bash
mvn verify
```

## 🔒 Security

- **Authentication**: JWT Bearer tokens
- **Password Hashing**: BCrypt (strength 12)
- **CORS**: Configured for frontend origins
- **Rate Limiting**: 100 requests/minute per user
- **SQL Injection**: Prevented via JPA/Hibernate
- **XSS**: Input sanitization

## 📊 Database Migrations

Using Flyway (optional):

```bash
# Add to pom.xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>

# Migrations in src/main/resources/db/migration/
V1__initial_schema.sql
V2__add_otp_table.sql
```

## 🐛 Debugging

### Enable SQL logging
```yaml
logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

### View logs
```bash
tail -f logs/foodhub.log
```

## 📦 Building for Production

```bash
# Build JAR
mvn clean package -DskipTests

# Run JAR
java -jar target/foodhub-api-1.0.0.jar

# With profile
java -jar -Dspring.profiles.active=production target/foodhub-api-1.0.0.jar
```

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md) for production deployment instructions.

## 🆘 Troubleshooting

### Database connection failed
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U postgres -d foodhub -c "SELECT 1"
```

### Port already in use
```bash
# Change port in application.yml
server:
  port: 8081
```

### Out of memory
```bash
# Increase heap size
java -Xmx512m -jar target/foodhub-api-1.0.0.jar
```

## 📞 Support

- Technical issues: tech@foodhub.gh
- Documentation: See `/docs` folder
- API spec: [API_SPECIFICATION.md](../docs/API_SPECIFICATION.md)
