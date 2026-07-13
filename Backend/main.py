from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from agents.navigation_agent import get_route


app = FastAPI(title="Navigation Agent")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Navigation Agent is Running"
    }


@app.get("/navigation")
def navigation(source: str, destination: str):
    return get_route(source, destination)
