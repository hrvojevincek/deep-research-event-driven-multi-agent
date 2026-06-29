from fastapi import APIRouter

from eventforge.api.routes import queries, stream

router = APIRouter()

router.include_router(queries.router)
router.include_router(stream.router)


@router.get("/")
async def api_v1_root() -> dict[str, str]:
    return {"message": "EventForge API v1"}
