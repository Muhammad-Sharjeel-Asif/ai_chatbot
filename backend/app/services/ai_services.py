from groq import Groq, APIConnectionError, APIStatusError, RateLimitError
from groq.types.chat import (
    ChatCompletionMessageParam,
    ChatCompletionSystemMessageParam,
    ChatCompletionUserMessageParam,
    ChatCompletionAssistantMessageParam,
)
from app.config.settings import settings
from app.schemas.chat import Message
import logging

# Configure logging so errors appear clearly in the terminal
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AIService:
    """
    Handles all communication with the Groq API.
    Initialized once at application startup and reused across requests.
    """

    def __init__(self):
        """
        Creates the Groq client using the API key from settings.
        Raises a RuntimeError immediately if the key is missing,
        so the problem is caught at startup rather than mid-request.
        """
        if not settings.groq_api_key:
            raise RuntimeError(
                "GROQ_API_KEY is missing. "
                "Make sure it is set inside backend/.env"
            )

        self.client = Groq(api_key=settings.groq_api_key)
        self.model = settings.model_name

        logger.info(f"AIService initialized. Model: {self.model}")

    def _build_system_prompt(self) -> ChatCompletionSystemMessageParam:
        """
        Returns the system message that shapes the AI's personality
        and behaviour for every conversation.
        """
        return ChatCompletionSystemMessageParam(
            role="system",
            content=(
                "You are a helpful, friendly, and concise AI assistant. "
                "Answer questions accurately and clearly. "
                "If you do not know something, say so honestly. "
                "Never fabricate facts or sources."
            )
        )

    def _format_messages(
        self,
        messages: list[Message]
    ) -> list[ChatCompletionMessageParam]:
        """
        Converts a list of Pydantic Message objects into the strongly-typed
        list that the Groq SDK expects, prepended with the system prompt.

        Args:
            messages: Validated conversation history from the request.

        Returns:
            A list of ChatCompletionMessageParam objects starting with
            the system prompt, followed by the conversation history.
        """
        formatted: list[ChatCompletionMessageParam] = [
            self._build_system_prompt()
        ]

        for message in messages:
            if message.role == "user":
                formatted.append(
                    ChatCompletionUserMessageParam(
                        role="user",
                        content=message.content
                    )
                )
            elif message.role == "assistant":
                formatted.append(
                    ChatCompletionAssistantMessageParam(
                        role="assistant",
                        content=message.content
                    )
                )

        return formatted

    async def get_chat_response(self, messages: list[Message]) -> str:
        """
        Sends the conversation history to the Groq API and returns
        the assistant's reply as a plain string.

        Args:
            messages: The full validated conversation history.

        Returns:
            The AI-generated reply string.

        Raises:
            RuntimeError: Wraps any Groq API error with a clean message
                          so the route layer can return a proper HTTP error.
        """
        formatted_messages = self._format_messages(messages)

        logger.info(
            f"Sending {len(formatted_messages)} message(s) to Groq "
            f"(including system prompt)."
        )

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=formatted_messages,
                temperature=0.7,
                max_tokens=1024,
                top_p=1,
            )

            reply = completion.choices[0].message.content

            if not reply or not reply.strip():
                raise RuntimeError(
                    "The Groq API returned an empty response. "
                    "Please try again."
                )

            logger.info("Groq API responded successfully.")
            return reply.strip()

        except RateLimitError:
            logger.error("Groq rate limit reached.")
            raise RuntimeError(
                "The AI service is currently rate-limited. "
                "Please wait a moment and try again."
            )

        except APIConnectionError:
            logger.error("Could not connect to the Groq API.")
            raise RuntimeError(
                "Could not connect to the AI service. "
                "Please check your internet connection and try again."
            )

        except APIStatusError as e:
            logger.error(f"Groq API status error: {e.status_code} — {e.message}")
            raise RuntimeError(
                f"The AI service returned an error (HTTP {e.status_code}). "
                "Please check your API key and model name in backend/.env"
            )

        except Exception as e:
            logger.error(f"Unexpected error from Groq: {str(e)}")
            raise RuntimeError(
                "An unexpected error occurred while contacting the AI service. "
                "Please try again later."
            )


# Single shared instance — created once when the module is first imported.
# This avoids recreating the Groq client on every request.
ai_service = AIService()