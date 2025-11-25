# Medical Copilot

A full-stack medical assistant application that transcribes consultations and generates structured clinical reports using AI.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **AI**: OpenAI (Whisper for transcription, GPT-4o-mini for diagnosis)

## Prerequisites

- Node.js (v18+)
- OpenAI API Key

## Setup & Running

### 1. Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `server/` with your OpenAI API Key:
   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **Audio Recording**: Record consultations directly in the browser.
- **Transcription**: Automatic speech-to-text using Whisper.
- **Diagnosis**: AI-generated clinical report (Diagnosis, Associated Diseases, Exams, Medications).
- **History**: Local storage persistence of past consultations.
- **Contextual Chat**: Ask follow-up questions about the diagnosis.
