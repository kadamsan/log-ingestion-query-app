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

**Note**: This implementation is designed for development, testing, and small-scale production use. For high-volume production systems, consider migrating to a dedicated database solution.



### Frontend (react)
