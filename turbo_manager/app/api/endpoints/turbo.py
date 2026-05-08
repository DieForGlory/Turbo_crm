from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models.domain import Domain
from app.db.models.page import Page
from app.services.rss_builder import build_turbo_feed

router = APIRouter()


@router.get("/{domain_id}/feed.xml", response_class=Response)
async def get_domain_feed(domain_id: int, db: AsyncSession = Depends(get_db)):
    domain_result = await db.execute(select(Domain).where(Domain.id == domain_id))
    domain = domain_result.scalars().first()

    if not domain:
        raise HTTPException(status_code=404, detail="Domain not found")

    pages_result = await db.execute(select(Page).where(Page.domain_id == domain_id, Page.is_active == True))
    pages = pages_result.scalars().all()

    page_data = [
        {
            "url_path": page.url_path,
            "html_body": page.content_data.get("html", "")
        } for page in pages
    ]

    feed_xml = build_turbo_feed(f"https://{domain.name}", page_data)

    return Response(content=feed_xml, media_type="application/xml")