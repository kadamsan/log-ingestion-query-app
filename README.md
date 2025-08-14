# Log Ingestion and Querying System

A Node.js/Express backend application for ingesting, storing, and querying log data using a JSON file as the database.

## 🏗️ Architecture Overview

### Backend (Nodejs and Express)
This system implements a **JSON file-based database** using Node.js's built-in `fs` module for data persistence. The choice of JSON file storage was made for simplicity, ease of development, and to avoid external database dependencies.


## 🚀 Quick Start

### Prerequisites

- Node.js 14+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **For development with auto-restart:**
   ```bash
   npm run dev
   ```

4. **Test the database functionality:**
   ```bash
   node test.js
   ```

The server will start on `http://localhost:3000`


## 🛠️ Implementation Details

### JSON Database Service (`services/database.js`)

The core database service provides:

- **File System Operations**: Uses `fs.promises` for async file operations
- **Auto-directory Creation**: Creates data directory if it doesn't exist
- **CRUD Operations**: Create, Read, Update, Delete log entries

### Key Features

1. **Atomic Operations**: Each operation reads the entire file, modifies data, and writes back
2. **Error Handling**: Comprehensive error handling for file operations
3. **Data Validation**: Input validation for log levels and required fields
4. **UUID Generation**: Unique IDs for each log entry
5. **Timestamp Management**: Automatic timestamp handling
6. **Flexible Filtering**: Multiple filter options for querying logs

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development, production)

### Rate Limiting

- 100 requests per 15 minutes per IP address
- Configurable in `server.js`


## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Sanitization of user inputs
- **Error Handling**: No sensitive information in error responses

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

---

### Frontend (React)

A modern React application built with Vite for fast development and optimal performance. The frontend provides a clean, responsive interface for viewing and filtering log data.

#### Features
- **Modern React**: Built with React 18 and functional components
- **Vite Build Tool**: Fast development server and optimized builds
- **Responsive Design**: Works well on desktop browsers
- **Real-time Filtering**: Dynamic log filtering with instant results
- **Visual Log Levels**: Color-coded log entries for easy identification
- **Pagination**: Efficient navigation through large log datasets
- **Backend Integration**: Seamless communication with the JSON database backend

#### Project Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── FilterBar.jsx    # Log filtering controls
│   │   ├── LogEntry.jsx     # Individual log display
│   │   └── Pagination.jsx   # Navigation controls
│   ├── hooks/               # Custom React hooks
│   │   └── useLogs.js       # Log state management
│   ├── services/            # API communication
│   │   └── api.js           # Backend API integration
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── index.html               # HTML template
```

#### Quick Start

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

The frontend will be available at `http://localhost:3001`

#### Key Components

**FilterBar**: Provides comprehensive filtering options including:
- Text search in log messages
- Log level dropdown (error, warn, info, debug, trace)
- Resource ID filtering
- Date range selection (start and end dates)
- Sorting options (timestamp, level, message, resourceId)
- Sort order (ascending/descending)
- Clear filters functionality

**LogEntry**: Displays individual log entries with:
- Visual level indicators (color-coded borders and badges)
- Formatted timestamps
- Structured metadata display
- All log fields (resourceId, traceId, spanId, commit, etc.)

**Pagination**: Smart pagination with:
- Page navigation controls
- Current page indicator
- Total count display
- Efficient page number generation

#### API Integration

The frontend communicates with the backend through a clean API service layer:
- **Axios**: HTTP client for API requests
- **Interceptors**: Request/response logging and error handling
- **Proxy Configuration**: Development proxy to backend (localhost:3000)
- **Health Checks**: Backend connectivity monitoring

#### State Management

Uses React hooks for state management:
- **useState**: Component-level state
- **useEffect**: Side effects and API calls
- **useCallback**: Optimized function references
- **Custom Hooks**: Reusable state logic (useLogs)

#### Styling

Modern CSS with:
- **Responsive Grid**: Flexible layout system
- **CSS Variables**: Consistent theming
- **Hover Effects**: Interactive feedback
- **Mobile Considerations**: Basic responsive design
- **Visual Hierarchy**: Clear information organization

#### Development Features

- **Hot Reload**: Instant code updates during development
- **ESLint**: Code quality and consistency
- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during API calls
- **Error Messages**: Clear error communication

#### Browser Compatibility

Designed for modern browsers with support for:
- ES2020+ features
- CSS Grid and Flexbox
- Modern JavaScript APIs
- React 18 features


---

**Note**: This implementation is designed for development, testing, and small-scale production use. For high-volume production systems, consider migrating to a dedicated database solution.
