"""Shared worker startup: logging, OTEL, and run loop."""

import asyncio

from eventforge.core.config import get_settings
from eventforge.core.logging import setup_logging
from eventforge.core.otel import setup_otel
from eventforge.workers.base import SqsConsumer


async def run_worker(worker_cls: type[SqsConsumer], *, service_suffix: str) -> None:
    """Configure logging/OTEL and run an SQS consumer until interrupted."""
    settings = get_settings()
    setup_logging(settings)
    setup_otel(settings, service_name=f"eventforge-worker-{service_suffix}")
    worker = worker_cls()
    await worker.run_forever()


def main(worker_cls: type[SqsConsumer], *, service_suffix: str) -> None:
    """Entry point for worker modules."""
    asyncio.run(run_worker(worker_cls, service_suffix=service_suffix))
