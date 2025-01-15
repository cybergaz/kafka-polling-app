## KAFKA POLLING APP
a simple polling app with kafka as a message broker integrated with web-sockets for real-time updates on both the frontend and backend

### Setup

- I have included .env for this project willingly, but in a production environment, it is not recommended to include .env files in the repository.

## requirements:

1.  docker

Run command:

- ```bash
  docker compose up
  ```

### wait a few secs even after logging stops on the terminal
> wait for the backend server to start , kafka consumer takes about 15+ secs time to start    
> you're good to go when you see `Server running on http://localhost:3000` on the terminal

## Test and run:

### FRONTEND
- **running at**: `localhost:5173/` & `localhost:5173/vote` & `localhost:5173/leaderboard`
> if voting page doesn't work properly, try voting through curl or postman, Endpoints info is down below



### API Endpoints

#### **1. Create a Poll**
- **Endpoint**: `POST /polls`
- **Request Body**:

  ```json
  {
    "question": "What is your favorite movie?",
    "options": ["perfect sense", "memories of murder", "interstellar"]
  }
  ```

- **Response**:

  ```json
    {
      "message": "Poll created successfully",
      "poll": {
        "id": 7,
        "question": "What is your favorite question?",
        "created_at": "2024-12-13T12:46:48.056Z"
      }
    }
  ```

#### **2. Vote on a Poll**
- **Endpoint**: `POST /polls/:poll_id/vote`
- **Request Body**:

  ```json
  {
    "option_id": 2
  }
  ```

- **Response**:

  ```json
  {
    "message": "Vote Submitted."
  }
  ```

#### **3. Get Poll Results**
- **Endpoint**: `GET /polls/:poll_id`
- **Response**:

  ```json
  {"poll_results":
      [
        {
          "poll_id": "poll_id",
          "option_id": "option id",
          "option_text": "option content",
          "votes_count": 0
        }
      ]
  }
  ```

#### **4. Get Leaderboard**
- **Endpoint**: `GET /leaderboard`
- **Response**:

  ```json
  {"leaderboard":
      [
        {
          "poll_id": 0,
          "option_text": "text",
          "votes_count": 0
        }
      ]
  }
  ```

### guide (covering the edge cases)
1. if you want to run the project out of the docker container, you'll have to use `localhost` as a value of POSTGRES_DB in .env *and* in `src/actions/db_connections.ts` both file

---
