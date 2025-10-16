# SportsTech AI - API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": [ ... ] // Optional validation errors
}
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "athlete" // or "coach"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "userId": "64abc123..."
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64abc123...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "athlete",
    "profilePhoto": "/uploads/photos/...",
    "isEmailVerified": true
  }
}
```

### Verify Email
```http
GET /auth/verify-email/:token
```

**Response:**
```json
{
  "message": "Email verified successfully"
}
```

### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If an account exists, a reset link has been sent"
}
```

### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "64abc123...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "athlete",
  "profilePhoto": "/uploads/photos/...",
  "isEmailVerified": true,
  "coachId": "64def456...",
  "createdAt": "2023-12-01T10:00:00.000Z",
  "updatedAt": "2023-12-15T14:30:00.000Z"
}
```

---

## User Endpoints

### Update Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### Upload Profile Photo
```http
POST /users/profile/photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

photo: <file>
```

**Response:**
```json
{
  "message": "Profile photo uploaded successfully",
  "profilePhoto": "/uploads/photos/abc123.jpg"
}
```

---

## Video Endpoints

### Upload Video
```http
POST /videos/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

video: <file>
title: "Training Session - Shooting Practice"
description: "Working on shooting technique"
sport: "football"
```

**Response:**
```json
{
  "message": "Video uploaded successfully",
  "video": {
    "_id": "64xyz789...",
    "userId": "64abc123...",
    "title": "Training Session - Shooting Practice",
    "description": "Working on shooting technique",
    "sport": "football",
    "filename": "abc123.mp4",
    "filepath": "uploads/videos/abc123.mp4",
    "fileSize": 15728640,
    "uploadDate": "2023-12-15T10:00:00.000Z",
    "analysisStatus": "pending"
  }
}
```

### Get All Videos
```http
GET /videos
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "64xyz789...",
    "title": "Training Session",
    "sport": "football",
    "uploadDate": "2023-12-15T10:00:00.000Z",
    "analysisStatus": "completed",
    "analysisResult": {
      "performanceScore": 85,
      "strengths": ["Good ball control", "Active movement"],
      "weaknesses": ["Positioning needs work"],
      "improvements": ["Practice footwork drills"],
      "youtubeRecommendations": [...],
      "detectedLabels": ["kick", "run", "ball"],
      "timestamp": "2023-12-15T10:05:00.000Z"
    }
  }
]
```

### Get Video by ID
```http
GET /videos/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "64xyz789...",
  "userId": "64abc123...",
  "title": "Training Session",
  "description": "Working on technique",
  "sport": "football",
  "filename": "abc123.mp4",
  "filepath": "uploads/videos/abc123.mp4",
  "uploadDate": "2023-12-15T10:00:00.000Z",
  "analysisStatus": "completed",
  "analysisResult": { ... }
}
```

### Analyze Video
```http
POST /videos/:id/analyze
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Analysis completed",
  "video": {
    "_id": "64xyz789...",
    "analysisStatus": "completed",
    "analysisResult": {
      "performanceScore": 85,
      "strengths": [
        "Good ball control visible",
        "Active movement throughout the performance"
      ],
      "weaknesses": [
        "Limited technique variety observed"
      ],
      "improvements": [
        "Practice more diverse movements and techniques",
        "Focus on footwork and positioning"
      ],
      "youtubeRecommendations": [
        {
          "videoId": "abc123",
          "title": "Football Footwork Drills",
          "thumbnail": "https://i.ytimg.com/vi/abc123/mqdefault.jpg",
          "channel": "Soccer Training",
          "url": "https://www.youtube.com/watch?v=abc123"
        }
      ],
      "detectedLabels": ["kick", "run", "ball", "field"],
      "timestamp": "2023-12-15T10:05:00.000Z"
    }
  }
}
```

### Delete Video
```http
DELETE /videos/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Video deleted successfully"
}
```

---

## Coach Endpoints

**Note:** All coach endpoints require the user to have the "coach" or "admin" role.

### Get Athletes
```http
GET /coach/athletes
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "64abc123...",
    "email": "athlete@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "athlete",
    "profilePhoto": "/uploads/photos/...",
    "coachId": "64def456..."
  }
]
```

### Add Athlete
```http
POST /coach/athletes
Authorization: Bearer <token>
Content-Type: application/json

{
  "athleteId": "64abc123..."
}
```

**Response:**
```json
{
  "message": "Athlete added successfully",
  "athlete": { ... }
}
```

### Remove Athlete
```http
DELETE /coach/athletes/:athleteId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Athlete removed successfully"
}
```

### Add Note
```http
POST /coach/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "athleteId": "64abc123...",
  "videoId": "64xyz789...", // Optional
  "note": "Great improvement in shooting technique",
  "category": "technique" // performance, technique, fitness, mental, other
}
```

**Response:**
```json
{
  "message": "Note added successfully",
  "note": {
    "_id": "64note123...",
    "coachId": "64def456...",
    "athleteId": "64abc123...",
    "videoId": "64xyz789...",
    "note": "Great improvement in shooting technique",
    "category": "technique",
    "createdAt": "2023-12-15T14:30:00.000Z"
  }
}
```

### Get Notes
```http
GET /coach/notes/:athleteId
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "64note123...",
    "coachId": "64def456...",
    "athleteId": "64abc123...",
    "note": "Great improvement in shooting technique",
    "category": "technique",
    "createdAt": "2023-12-15T14:30:00.000Z"
  }
]
```

### Get Athlete Videos
```http
GET /coach/athletes/:athleteId/videos
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "64xyz789...",
    "userId": "64abc123...",
    "title": "Training Session",
    "sport": "football",
    "uploadDate": "2023-12-15T10:00:00.000Z",
    "analysisStatus": "completed",
    "analysisResult": { ... }
  }
]
```

---

## Message Endpoints

### Get Conversations
```http
GET /messages/conversations
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "user": {
      "_id": "64def456...",
      "firstName": "Coach",
      "lastName": "Smith",
      "profilePhoto": "/uploads/photos/...",
      "role": "coach"
    },
    "lastMessage": {
      "_id": "64msg123...",
      "senderId": "64def456...",
      "receiverId": "64abc123...",
      "content": "Great progress today!",
      "type": "text",
      "read": true,
      "createdAt": "2023-12-15T16:00:00.000Z"
    },
    "unreadCount": 0
  }
]
```

### Get Messages with User
```http
GET /messages/:userId
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "64msg123...",
    "senderId": "64abc123...",
    "receiverId": "64def456...",
    "content": "Hi coach!",
    "type": "text",
    "read": true,
    "createdAt": "2023-12-15T15:00:00.000Z"
  },
  {
    "_id": "64msg124...",
    "senderId": "64def456...",
    "receiverId": "64abc123...",
    "content": "Hello! How can I help?",
    "type": "text",
    "read": true,
    "createdAt": "2023-12-15T15:05:00.000Z"
  }
]
```

### Mark Message as Read
```http
PUT /messages/:messageId/read
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Message marked as read"
}
```

---

## Schedule Endpoints

### Create Schedule
```http
POST /schedules
Authorization: Bearer <token>
Content-Type: application/json

{
  "athleteId": "64abc123...",
  "title": "Training Session",
  "description": "Shooting practice",
  "startTime": "2023-12-20T10:00:00.000Z",
  "endTime": "2023-12-20T12:00:00.000Z",
  "location": "Main Field",
  "type": "training" // training, match, meeting
}
```

**Response:**
```json
{
  "message": "Schedule created successfully",
  "schedule": {
    "_id": "64sched123...",
    "coachId": "64def456...",
    "athleteId": "64abc123...",
    "title": "Training Session",
    "description": "Shooting practice",
    "startTime": "2023-12-20T10:00:00.000Z",
    "endTime": "2023-12-20T12:00:00.000Z",
    "location": "Main Field",
    "type": "training",
    "createdAt": "2023-12-15T10:00:00.000Z"
  }
}
```

### Get Schedules
```http
GET /schedules
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "64sched123...",
    "coachId": {
      "_id": "64def456...",
      "firstName": "Coach",
      "lastName": "Smith",
      "profilePhoto": "/uploads/photos/..."
    },
    "athleteId": {
      "_id": "64abc123...",
      "firstName": "Jane",
      "lastName": "Doe",
      "profilePhoto": "/uploads/photos/..."
    },
    "title": "Training Session",
    "description": "Shooting practice",
    "startTime": "2023-12-20T10:00:00.000Z",
    "endTime": "2023-12-20T12:00:00.000Z",
    "location": "Main Field",
    "type": "training"
  }
]
```

### Update Schedule
```http
PUT /schedules/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Training Session",
  "startTime": "2023-12-20T11:00:00.000Z",
  "endTime": "2023-12-20T13:00:00.000Z"
}
```

**Response:**
```json
{
  "message": "Schedule updated successfully",
  "schedule": { ... }
}
```

### Delete Schedule
```http
DELETE /schedules/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Schedule deleted successfully"
}
```

---

## Lineup Endpoints

**Note:** Coach-only endpoints

### Create Lineup
```http
POST /lineups
Authorization: Bearer <token>
Content-Type: application/json

{
  "teamName": "First Team",
  "sport": "football",
  "formation": "4-4-2",
  "players": [
    {
      "playerId": "64abc123...",
      "playerName": "John Doe",
      "position": "Forward",
      "photo": "/uploads/photos/...",
      "x": 50,
      "y": 80
    }
  ]
}
```

**Response:**
```json
{
  "message": "Lineup created successfully",
  "lineup": {
    "_id": "64lineup123...",
    "coachId": "64def456...",
    "teamName": "First Team",
    "sport": "football",
    "formation": "4-4-2",
    "players": [...],
    "createdAt": "2023-12-15T10:00:00.000Z"
  }
}
```

### Get Lineups
```http
GET /lineups
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "64lineup123...",
    "coachId": "64def456...",
    "teamName": "First Team",
    "sport": "football",
    "formation": "4-4-2",
    "players": [...],
    "createdAt": "2023-12-15T10:00:00.000Z"
  }
]
```

### Get Lineup by ID
```http
GET /lineups/:id
Authorization: Bearer <token>
```

### Update Lineup
```http
PUT /lineups/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "teamName": "Updated Team Name",
  "formation": "4-3-3",
  "players": [...]
}
```

### Delete Lineup
```http
DELETE /lineups/:id
Authorization: Bearer <token>
```

---

## Dashboard Endpoints

### Get Dashboard Stats
```http
GET /dashboard/stats
Authorization: Bearer <token>
```

**Athlete Response:**
```json
{
  "totalVideos": 12,
  "analyzedVideos": 10,
  "upcomingSchedules": 3,
  "averagePerformanceScore": 82.5,
  "recentVideos": [...]
}
```

**Coach Response:**
```json
{
  "totalAthletes": 25,
  "totalNotes": 48,
  "upcomingSchedules": 15,
  "athletesList": [...]
}
```

### Get Performance History
```http
GET /dashboard/performance-history
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "date": "2023-12-01T10:00:00.000Z",
    "score": 75,
    "title": "Training Session 1",
    "sport": "football"
  },
  {
    "date": "2023-12-08T10:00:00.000Z",
    "score": 82,
    "title": "Training Session 2",
    "sport": "football"
  }
]
```

---

## WebSocket API

### Connection

Connect to WebSocket server:
```
ws://localhost:5000/ws?token=<jwt_token>
```

### Send Message
```json
{
  "type": "chat",
  "receiverId": "64def456...",
  "content": "Hello!",
  "messageType": "text"
}
```

### Typing Indicator
```json
{
  "type": "typing",
  "receiverId": "64def456...",
  "isTyping": true
}
```

### Receive Message
```json
{
  "type": "message",
  "data": {
    "_id": "64msg123...",
    "senderId": "64abc123...",
    "receiverId": "64def456...",
    "content": "Hello!",
    "type": "text",
    "read": false,
    "createdAt": "2023-12-15T16:00:00.000Z"
  }
}
```

### Message Sent Confirmation
```json
{
  "type": "message_sent",
  "data": {
    "_id": "64msg123...",
    "senderId": "64abc123...",
    "receiverId": "64def456...",
    "content": "Hello!",
    "type": "text",
    "read": false,
    "createdAt": "2023-12-15T16:00:00.000Z"
  }
}
```

### Typing Indicator
```json
{
  "type": "typing",
  "senderId": "64abc123...",
  "isTyping": true
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

Production deployments should implement rate limiting:
- Authentication endpoints: 5 requests per minute
- Upload endpoints: 10 requests per hour
- General API: 100 requests per minute

## Support

For API support:
- GitHub Issues: [repository-url]/issues
- Email: api@sportstech.ai
