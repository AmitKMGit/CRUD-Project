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

## Publish the frontend on GitHub Pages

GitHub Pages serves static files only. Deploy the Spring Boot API separately (for example, as a Java web service on Render or Railway) before publishing the Angular frontend. Configure the backend's `CORS_ALLOWED_ORIGIN` environment variable to the Pages origin, such as `https://your-user.github.io` (no repository path).

1. Push this repository to GitHub on the `main` branch.
2. On Render, create a **Docker** web service for this repository. Set **Root Directory** to `backend`; leave Docker build and start commands blank so Render uses `backend/Dockerfile`. Add the environment variable `CORS_ALLOWED_ORIGIN` with your GitHub Pages origin, such as `https://your-user.github.io` (no repository path). Render supplies `PORT` automatically.
3. In the GitHub repository, open **Settings → Secrets and variables → Actions → Variables** and add `API_BASE_URL` with the backend URL ending in `/api`, for example `https://your-api.example.com/api`.
4. Open **Settings → Pages**, set the source to **GitHub Actions**, then push to `main` or run **Deploy Angular to GitHub Pages** from the Actions tab.

The workflow sets the correct Angular base path for either a project site (`owner.github.io/repository`) or a user site (`owner.github.io`). The H2 database is in-memory, so records are not durable and are lost whenever the backend restarts; choose a persistent database if the live app must retain data.

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