# Plex Activity Monitor

A React-based web application for monitoring Plex download activities with a dark mode interface, customizable output formatting, and Docker support.

![Activity Monitor Preview](preview.png)

## Features

- 🎯 Real-time monitoring of Plex download activities
- 🌙 Dark mode interface
- 📊 Progress tracking with visual indicators
- 🔄 Auto-refresh every 15 seconds
- 🎨 Customizable output format
- 🚀 REST API for external access
- 📝 Detailed logging system
- 💾 Persistent format settings
- 🐳 Docker support

## Deployment Options

### 1. Docker Deployment (Recommended)

#### Prerequisites

- Docker
- Docker Compose

#### Using Docker Compose

1. Clone the repository:

```bash
git clone https://github.com/cyb3rgh05t/plex-api.git
cd plex-api
```

2. Create a `.env` file with your Plex credentials:

```env
REACT_APP_PLEX_SERVER_URL=https://your-plex-server:32400
REACT_APP_PLEX_TOKEN=your-plex-token
```

3. Build and run using docker-compose:

```bash
docker-compose up -d
```

4. Access the application at `http://localhost:3005`

#### Docker Commands

- Stop the container:

```bash
docker-compose down
```

- View logs:

```bash
docker-compose logs -f
```

- Rebuild the container:

```bash
docker-compose up -d --build
```

### 2. Local Development Setup

#### Prerequisites

- Node.js (v14 or higher)
- NPM (v6 or higher)
- A Plex Media Server
- Plex Token for authentication

#### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory:

```env
REACT_APP_PLEX_SERVER_URL=https://your-plex-server:32400
REACT_APP_PLEX_TOKEN=your-plex-token
PORT=3005
```

#### Running the Application

Development Mode:

```bash
npm run dev
```

Production Mode:

```bash
npm run build
npm start
```

## API Endpoints

### Get Activities

```http
GET /api/activities
```

Returns formatted and raw activity data

### Update Activities

```http
POST /api/update
```

Updates the current activities and format

### Debug Information (Development)

```http
GET /api/debug
```

Returns server state and available endpoints

## Format Customization

Available variables for custom formats:

- {uuid} - Unique identifier
- {type} - Activity type
- {title} - Activity title
- {subtitle} - Media name
- {progress} - Download progress
- {cancellable} - Can be cancelled
- {userID} - User ID

Example format:

```
{subtitle} - {progress}% ({title})
```

## Project Structure

```
plex-api/
├── Dockerfile
├── docker-compose.yml
├── public/
│   ├── favicon.svg
│   ├── index.html
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── ActivityCard.jsx
│   │   ├── ActivityList.jsx
│   │   ├── Layout.jsx
│   │   └── Settings.jsx
│   ├── config/
│   │   └── config.js
│   ├── context/
│   │   └── FormatContext.jsx
│   ├── services/
│   │   ├── apiService.js
│   │   └── plexService.js
│   ├── utils/
│   │   └── logger.js
│   ├── App.jsx
│   └── index.jsx
├── server/
│   └── server.js
├── .dockerignore
├── .env.example
└── package.json
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Build Docker image
npm run docker:build

# Run Docker container
npm run docker:run
```

### Environment Variables

| Variable                  | Description                    |
| ------------------------- | ------------------------------ |
| REACT_APP_PLEX_SERVER_URL | Your Plex server URL           |
| REACT_APP_PLEX_TOKEN      | Your Plex authentication token |
| PORT                      | Server port (default: 3005)    |

## Troubleshooting

### Common Issues

1. **Docker Issues**

   - Ensure Docker daemon is running
   - Check container logs: `docker-compose logs -f`
   - Verify environment variables in .env file

2. **API 404 Errors**

   - Ensure the server is running
   - Check if the correct port is being used
   - Verify API endpoints are not being blocked

3. **Plex Connection Issues**

   - Verify Plex server URL is correct
   - Ensure Plex token is valid
   - Check network connectivity

4. **Format Not Saving**
   - Clear browser cache
   - Check localStorage permissions
   - Verify browser console for errors

### Debug Mode

Access the debug endpoint for detailed information:

```http
GET /api/debug
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React
- Styled with Tailwind CSS
- Express.js for backend
- Docker for containerization
- Plex Media Server API

## Support

For support:

1. Check the troubleshooting section
2. Review existing issues
3. Create a new issue with detailed information about your problem

## Security

- All sensitive information should be stored in the .env file
- The .env file is included in .gitignore and .dockerignore
- API endpoints are protected by Plex token authentication
- Docker container runs with minimal permissions

## Updates and Maintenance

- The application auto-refreshes data every 15 seconds
- Docker containers can be configured to auto-restart
- Use `docker-compose pull` to update to the latest version
- Check the releases page for changelog and updates
