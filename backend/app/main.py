from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config.settings import settings
from app.routes.chat import router as chat_router
import logging

# Configure logging for the entire application
logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan — runs once on startup and once on shutdown.
# This is the modern FastAPI replacement for @app.on_event("startup").
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"Starting {settings.app_name}...")
    logger.info(f"Debug mode : {settings.debug}")
    logger.info(f"Model      : {settings.model_name}")
    logger.info("Backend is ready to accept requests.")
    yield
    # Shutdown
    logger.info(f"Shutting down {settings.app_name}. Goodbye.")


# ---------------------------------------------------------------------------
# FastAPI application instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.app_name,
    description=(
        "A production-quality AI Chatbot API powered by Groq and FastAPI. "
        "Send a conversation history to /chat/ and receive an AI reply."
    ),
    version="1.0.0",
    docs_url="/docs",  # Swagger UI  → http://localhost:8000/docs
    redoc_url="/redoc",  # ReDoc UI    → http://localhost:8000/redoc
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# CORS Middleware
# Allows the Next.js frontend (running on port 3000) to call this backend.
# In production, replace the wildcard with your actual frontend domain.
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://127.0.0.1:3000",  # Next.js dev server (alternate)
    ],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, OPTIONS, etc.
    allow_headers=["*"],  # Content-Type, Authorization, etc.
)


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(chat_router, prefix="/api/v1")


# ---------------------------------------------------------------------------
# Health check endpoint
# A quick way for the frontend (or a load balancer) to verify the backend
# is running without touching the Groq API at all.
# ---------------------------------------------------------------------------
@app.get(
    "/health",
    tags=["Health"],
    summary="Health check",
    description="Returns 200 OK if the backend is running.",
)
async def health_check() -> dict:
    return {
        "status": "ok",
        "app": settings.app_name,
        "model": settings.model_name,
    }


# ---------------------------------------------------------------------------
# Root endpoint
# Redirects anyone visiting / to the Swagger docs so the API is
# immediately explorable without any extra setup.
# ---------------------------------------------------------------------------
@app.get(
    "/",
    tags=["Root"],
    summary="Root — redirects to docs",
    include_in_schema=False,
)
async def root() -> dict:
    return {
        "message": f"Welcome to {settings.app_name}. Visit /docs for the API reference."
    }
