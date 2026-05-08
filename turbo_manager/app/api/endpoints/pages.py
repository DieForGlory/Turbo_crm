from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.db.session import get_db
from app.db.models.page import Page
from app.db.models.domain import Domain
from app.schemas.page import PageCreate, PageUpdate, PageOut

router = APIRouter()


@router.post("/bulk-generate/{domain_id}")
async def bulk_generate_pages(
        domain_id: int,
        count: int = 100,
        db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Domain).where(Domain.id == domain_id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Domain not found")

    new_pages = []
    for i in range(count):
        page = Page(
            domain_id=domain_id,
            url_path=f"/page-{i + 1}.html",
            content_data={
                "blocks": [
                    {"type": "header", "data": {"text": f"Турбо-страница {i + 1}", "level": 1}},
                    {"type": "paragraph", "data": {"text": f"Сгенерированный контент для страницы номер {i + 1}."}},
                    {"type": "button", "data": {"text": "Перейти", "url": "https://example.com", "color": "#FFCC00"}}
                ]
            },
            is_active=True
        )
        new_pages.append(page)

    db.add_all(new_pages)
    await db.commit()
    return {"status": "success", "created": count}


@router.get("/domain/{domain_id}", response_model=List[PageOut])
async def read_pages_by_domain(domain_id: int, skip: int = 0, limit: int = 1000, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Page).where(Page.domain_id == domain_id).offset(skip).limit(limit)
    )
    return result.scalars().all()


@router.delete("/{page_id}")
async def delete_page(page_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Page).where(Page.id == page_id))
    db_page = result.scalars().first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")
    await db.delete(db_page)
    await db.commit()
    return {"status": "deleted"}