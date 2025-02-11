# Plex Activity Monitor

A dockerized web application that monitors and displays Plex media download activities with customizable output formatting.

## Features

- 🔄 Real-time activity monitoring with 30-second auto-refresh
- 🌙 Dark mode interface
- 📊 Progress bar visualization for downloads
- ⚙️ Customizable output format
- 🔌 REST API endpoints
- 🐳 Docker support
- 💾 Persistent configuration

## Prerequisites

- Docker and Docker Compose
- Plex Media Server
- Plex authentication token

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/yourusername/plex-activity-monitor.git
cd plex-activity-monitor
```

2. Create an .env file with your Plex credentials:

```bash
PLEX_TOKEN=your_plex_token_here
PLEX_SERVER=http://your_plex_server:32400
```

3. Build and run with Docker:

```bash
docker-compose up --build
```

4. Access the application at http://localhost:3008

## Development

To run the application locally without Docker:

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. For production build:

```bash
npm run build
npm start
```

## API Endpoints

### GET /api/activities

Returns current Plex activities

Query Parameters:

- `raw=true` - Returns raw Plex API output

### GET /api/config

Returns current format configuration

### POST /api/config

Updates format configuration

Request body:

```json
{
  "variables": ["title", "subtitle", "progress", "type"],
  "outputFormat": "{title} - {subtitle} ({progress}%)"
}
```

## Configuration

The format configuration is stored in `src/data/format-config.json` and persists across container restarts.

Available variables:

- title
- subtitle
- progress
- type

Example format string:

```
{title} - {subtitle} ({progress}%)
```

## Project Structure

```
plex-activity-monitor/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── components/
│   │   ├── config/
│   │   ├── hooks/
│   │   └── lib/
│   └── data/
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
