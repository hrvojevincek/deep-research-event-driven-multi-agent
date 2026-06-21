from fastapi import APIRouter

from eventforge.api.routes import queries

router = APIRouter()

router.include_router(queries.router)


@router.get("/")
async def api_v1_root() -> dict[str, str]:
    return {"message": "EventForge API v1"}
