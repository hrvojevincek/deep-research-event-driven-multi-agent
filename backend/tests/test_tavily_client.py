from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest

from eventforge.core.config import Settings
from eventforge.events.schemas import QueryDepth
from eventforge.services.search.tavily import (
    DEFAULT_SOURCE_COUNT_BY_DEPTH,
    TavilyClient,
    resolve_source_count,
    resolve_tavily_search_depth,
)


def test_resolve_source_count_uses_max_sources_when_set() -> None:
    assert resolve_source_count(depth="standard", max_sources=7) == 7


def test_resolve_source_count_uses_depth_default_when_max_sources_missing() -> None:
    assert resolve_source_count(depth="quick", max_sources=None) == DEFAULT_SOURCE_COUNT_BY_DEPTH[
        QueryDepth.QUICK
    ]
    assert resolve_source_count(
        depth="standard", max_sources=None
    ) == DEFAULT_SOURCE_COUNT_BY_DEPTH[QueryDepth.STANDARD]
    assert resolve_source_count(depth="deep", max_sources=None) == DEFAULT_SOURCE_COUNT_BY_DEPTH[
        QueryDepth.DEEP
    ]


def test_resolve_tavily_search_depth_maps_query_depth() -> None:
    assert resolve_tavily_search_depth("quick") == "basic"
    assert resolve_tavily_search_depth("standard") == "basic"
    assert resolve_tavily_search_depth("deep") == "advanced"


@pytest.mark.asyncio
async def test_tavily_client_raises_when_api_key_missing() -> None:
    client = TavilyClient(Settings(tavily_api_key=""))
    with pytest.raises(ValueError, match="TAVILY_API_KEY"):
        await client.search("test query", max_results=3)


@pytest.mark.asyncio
async def test_tavily_client_parses_search_results() -> None:
    settings = Settings(tavily_api_key="tvly-test-key")
    client = TavilyClient(settings)

    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {
        "results": [
            {
                "title": "Event-Driven Architecture",
                "url": "https://example.org/eda",
                "content": "Overview of event-driven patterns.",
            },
            {"title": "", "url": "", "content": "skipped"},
        ]
    }

    mock_http = AsyncMock()
    mock_http.post = AsyncMock(return_value=mock_response)
    mock_http.__aenter__ = AsyncMock(return_value=mock_http)
    mock_http.__aexit__ = AsyncMock(return_value=None)

    with patch("eventforge.services.search.tavily.httpx.AsyncClient", return_value=mock_http):
        results = await client.search("event-driven architecture", max_results=5)

    assert len(results) == 1
    assert results[0].url == "https://example.org/eda"
    assert results[0].title == "Event-Driven Architecture"
    assert results[0].snippet == "Overview of event-driven patterns."

    mock_http.post.assert_awaited_once()
    call_kwargs = mock_http.post.await_args.kwargs
    assert call_kwargs["json"]["query"] == "event-driven architecture"
    assert call_kwargs["json"]["max_results"] == 5
    assert call_kwargs["headers"]["Authorization"] == "Bearer tvly-test-key"


@pytest.mark.asyncio
async def test_tavily_client_clamps_max_results_to_api_limit() -> None:
    settings = Settings(tavily_api_key="tvly-test-key")
    client = TavilyClient(settings)

    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {"results": []}

    mock_http = AsyncMock()
    mock_http.post = AsyncMock(return_value=mock_response)
    mock_http.__aenter__ = AsyncMock(return_value=mock_http)
    mock_http.__aexit__ = AsyncMock(return_value=None)

    with patch("eventforge.services.search.tavily.httpx.AsyncClient", return_value=mock_http):
        await client.search("test", max_results=100, search_depth="advanced")

    assert mock_http.post.await_args.kwargs["json"]["max_results"] == 20
    assert mock_http.post.await_args.kwargs["json"]["search_depth"] == "advanced"


@pytest.mark.asyncio
async def test_tavily_client_propagates_http_errors() -> None:
    settings = Settings(tavily_api_key="tvly-test-key")
    client = TavilyClient(settings)

    mock_response = MagicMock()
    mock_response.raise_for_status.side_effect = httpx.HTTPStatusError(
        "Unauthorized",
        request=MagicMock(),
        response=MagicMock(status_code=401),
    )

    mock_http = AsyncMock()
    mock_http.post = AsyncMock(return_value=mock_response)
    mock_http.__aenter__ = AsyncMock(return_value=mock_http)
    mock_http.__aexit__ = AsyncMock(return_value=None)

    with patch("eventforge.services.search.tavily.httpx.AsyncClient", return_value=mock_http):
        with pytest.raises(httpx.HTTPStatusError):
            await client.search("test", max_results=3)
