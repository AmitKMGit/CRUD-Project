# Contact Desk

A contact-management CRUD app with an Angular frontend and a Spring Boot REST API. Contacts are stored in an H2 in-memory database and are cleared when the backend stops.

## Requirements

- Node.js 20.19+ and npm
- Java 17+
- Maven 3.6+

## Run locally

Start the API in one terminal:

```powershell
cd backend
mvn spring-boot:run
```

Start Angular in a second terminal:

```powershell
cd frontend
npm start
```

Open http://localhost:4200. The Angular dev server proxies `/api` requests to Spring Boot on port 8081.

## API

| Method | Endpoint | Action |
| --- | --- | --- |
| `GET` | `/api/contacts` | List contacts |
| `POST` | `/api/contacts` | Create a contact |
| `PUT` | `/api/contacts/{id}` | Update a contact |
| `DELETE` | `/api/contacts/{id}` | Delete a contact |

The H2 console is available at http://localhost:8081/h2-console with JDBC URL `jdbc:h2:mem:contactdesk`, username `sa`, and a blank password.

## Checks

```powershell
cd frontend
npm test -- --watch=false
npm run build

cd ../backend
mvn test
```