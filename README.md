# NLW Agents Advanced API

This is the backend for the NLW Agents Advanced application, an API built with Node.js, Fastify, and TypeScript, designed to manage interactive audio "rooms". The application allows users to create rooms, upload audio, and interact with the content through a question and answer system powered by Artificial Intelligence with Google Gemini.

## Features

- **Room Creation:** Users can create themed rooms to organize their audio files.
- **Audio Upload:** Support for uploading audio files to the rooms.
- **Automatic Transcription:** Uploaded audio is automatically transcribed to text.
- **Embedding Generation:** Vector embeddings are generated from the transcriptions for semantic analysis.
- **AI-Powered Questions and Answers:** Users can ask questions about the audio content and receive AI-generated answers, which use similarity search to find the most relevant excerpts.

## Technologies and Libraries

The project uses a set of modern technologies for developing high-performance and scalable APIs:

- **Node.js:** JavaScript runtime environment for the server.
- **Fastify:** A high-performance web framework for Node.js.
- **TypeScript:** A superset of JavaScript that adds static typing to the code.
- **PostgreSQL with pgvector:** A relational database with support for storing and searching embedding vectors.
- **Drizzle ORM:** A TypeScript ORM that offers a safe and intuitive development experience.
- **Google Gemini:** Artificial Intelligence API for audio transcription, embedding generation, and answering questions.
- **Zod:** A library for schema and data type validation.
- **Docker:** A containerization platform to ensure a consistent development and production environment.
- **Biome:** A code formatting and linting tool to maintain quality and consistency.

## How to Run the Project

To run the project, follow the steps below:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Nunes-ND/nlw-agents-advanced-api.git
    cd nlw-agents-advanced-api
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the project root, based on the `.env.example` file (if it exists), and fill it with your Google Gemini credentials and database settings.

4.  **Start the database with Docker:**
    ```bash
    docker-compose up -d
    ```

5.  **Run the database migrations:**
    ```bash
    npm run db:migrate
    ```

6.  **Start the application in development mode:**
    ```bash
    npm run dev
    ```

The API will be available at `http://localhost:3333`.

## API Endpoints

Below is a list of the main API endpoints:

-   `POST /rooms`: Creates a new room.
-   `GET /rooms`: Lists all rooms.
-   `GET /rooms/:roomId`: Returns the details of a specific room.
-   `POST /rooms/:roomId/audio`: Uploads an audio file to a room.
-   `POST /rooms/:roomId/questions`: Creates a new question in a room.
-   `GET /rooms/:roomId/questions`: Lists all questions in a room.