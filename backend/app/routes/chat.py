from fastapi import APIRouter, HTTPException, status
from app.schemas.chat import ChatRequest, ChatResponse, ErrorResponse
from app.services.ai_services import ai_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "/",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Send a message and receive an AI reply",
    description=(
        "Accepts the full conversation history and returns the AI assistant's "
        "next reply. The frontend is responsible for appending each new message "
        "to the history before sending."
    ),
    responses={
        200: {
            "description": "AI reply returned successfully.",
            "model": ChatResponse,
        },
        422: {
            "description": "Validation error — malformed request body.",
        },
        429: {
            "description": "Groq API rate limit reached.",
        },
        503: {
            "description": "AI service is unavailable or unreachable.",
        },
    },
)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Main chat endpoint.

    Receives the full conversation history from the frontend,
    forwards it to the Groq API via AIService, and returns
    the assistant's reply wrapped in a ChatResponse.

    Args:
        request: A validated ChatRequest containing the message history.

    Returns:
        A ChatResponse with the AI-generated reply and success=True.

    Raises:
        HTTPException 422: If the request body fails Pydantic validation.
        HTTPException 429: If the Groq API is rate-limiting requests.
        HTTPException 503: If the AI service cannot be reached or fails.
    """
    logger.info(
        f"POST /chat/ — received {len(request.messages)} message(s)."
    )

    # Guard: the last message must always be from the user.
    # An assistant message at the end means the frontend sent the history
    # incorrectly — the AI should never reply to itself.
    if request.messages[-1].role != "user":
        logger.warning("Last message in history is not from the user.")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The last message in the conversation must have role 'user'.",
        )

    try:
        reply = await ai_service.get_chat_response(request.messages)

        logger.info("Reply generated successfully. Returning to client.")

        return ChatResponse(reply=reply, success=True)

    except RuntimeError as e:
        error_message = str(e)
        logger.error(f"AIService error: {error_message}")

        # Rate-limit errors get a 429 so the frontend can handle them
        # differently (e.g. show "please wait" instead of "something broke").
        if "rate-limited" in error_message.lower():
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=error_message,
            )

        # Every other AI service failure is a 503 — the server is up
        # but the upstream dependency (Groq) could not be reached or failed.
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=error_message,
        )

    except Exception as e:
        # Catch-all for anything completely unexpected.
        logger.error(f"Unhandled exception in chat route: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "An unexpected error occurred. Please try again later."
            ),
        )