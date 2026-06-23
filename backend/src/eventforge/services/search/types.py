from dataclasses import dataclass


@dataclass(frozen=True)
class WebSearchResult:
    """One web page returned by a search provider."""

    url: str
    title: str
    snippet: str
