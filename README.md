# Plex API Dashboard

A real-time dashboard for monitoring Plex Media Server download activities. Built with React, Vite, and Tailwind CSS, featuring a dark mode interface and automatic updates.

![Preview](preview.png)

## Features

- Real-time monitoring of Plex download activities
- Dark mode interface
- Auto-refresh every 15 seconds
- Progress bars for download tracking
- Responsive grid layout
- Docker support
- HTTPS enabled
- Debug logging

## Prerequisites

- Node.js 18 or higher
- Docker (for containerized deployment)
- Plex Media Server with API access
- Plex Token for authentication

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/yourusername/plex-api
cd plex-api
```

2. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your Plex server details:

```
VITE_PLEX_SERVER_URL=https://your-plex-server:32400
VITE_PLEX_TOKEN=YOUR-PLEX-TOKEN
```

3. Build and run with Docker:

```bash
docker build -t plex-api .
docker run -p 3005:3005 plex-api
```

The dashboard will be available at `http://localhost:3005`

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Project Structure

```
📁 plex-api/
├── 📄 Dockerfile
├── 📄 .env
├── 📁 src/
│   ├── 📄 index.html
│   ├── 📄 App.jsx
│   ├── 📄 main.jsx
│   ├── 📄 PlexActivity.jsx
│   └── 📄 index.css
├── 📄 package.json
└── 📄 vite.config.js
```

## Configuration

### Environment Variables

- `VITE_PLEX_SERVER_URL`: Your Plex server URL with port
- `VITE_PLEX_TOKEN`: Your Plex authentication token

### Port Configuration

The application runs on port 3005 by default. To change this:

1. Update `vite.config.js`
2. Modify the Dockerfile EXPOSE directive
3. Update the docker run command with the new port

## API Endpoints

The dashboard connects to the following Plex endpoint:

```
GET https://{PLEX_SERVER_URL}/activities?X-Plex-Token={TOKEN}
```

Response format:

```xml
<MediaContainer size="n">
  <Activity
    uuid="..."
    type="media.download"
    title="..."
    subtitle="..."
    progress="..."
  />
  ...
</MediaContainer>
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project as you wish.

## Troubleshooting

### Common Issues

1. **Connection Errors**

   - Verify Plex server URL and port
   - Check if Plex token is valid
   - Ensure HTTPS certificate is trusted

2. **Docker Issues**

   - Check if port 3005 is available
   - Verify Docker daemon is running
   - Check container logs: `docker logs plex-api`

3. **Display Issues**
   - Clear browser cache
   - Check console for JavaScript errors
   - Verify Tailwind CSS is building correctly

### Debug Logging

The application logs activities to the console. Access these logs:

- In browser: Open DevTools (F12) > Console
- In Docker: `docker logs plex-api`

## Support

For issues and feature requests, please open an issue on the GitHub repository.

---

Built with ❤️ for the Plex community
