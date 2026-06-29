from pydantic import BaseModel, Field
from typing import Literal


class Message(BaseModel):
    """
    Represents a single message in the conversation history.
    Role must be either 'user' or 'assistant'.
    """
    role: Literal["user", "assistant"] = Field(
        ...,
        description="The role of the message sender. Must be 'user' or 'assistant'."
    )
    content: str = Field(
        ...,
        min_length=1,
        description="The text content of the message. Cannot be empty."
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"role": "user", "content": "Hello, how are you?"},
                {"role": "assistant", "content": "I'm doing well, thank you!"}
            ]
        }
    }


class ChatRequest(BaseModel):
    """
    The request body sent by the frontend to the /chat endpoint.
    Contains the full conversation history so the AI has context.
    """
    messages: list[Message] = Field(
        ...,
        min_length=1,
        description="Full conversation history. Must contain at least one message."
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "messages": [
                        {"role": "user", "content": "What is the capital of France?"}
                    ]
                }
            ]
        }
    }


class ChatResponse(BaseModel):
    """
    The response body returned by the /chat endpoint to the frontend.
    Contains the AI's reply and a success flag.
    """
    reply: str = Field(
        ...,
        description="The AI-generated reply to the latest user message."
    )
    success: bool = Field(
        default=True,
        description="Indicates whether the request was handled successfully."
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "reply": "The capital of France is Paris.",
                    "success": True
                }
            ]
        }
    }


class ErrorResponse(BaseModel):
    """
    Returned when an error occurs during request processing.
    Used for consistent error formatting across the API.
    """
    detail: str = Field(
        ...,
        description="A human-readable explanation of what went wrong."
    )
    success: bool = Field(
        default=False,
        description="Always False for error responses."
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "detail": "Groq API key is invalid or missing.",
                    "success": False
                }
            ]
        }
    }