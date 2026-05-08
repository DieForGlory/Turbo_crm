from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.db.session import get_db
from app.db.models.page import Page
from app.db.models.domain import Domain
from app.schemas.page import PageCreate, PageUpdate, PageOut
from app.schemas.page import PageCreate

import json
import uuid
from app.schemas.page import BulkDatasetRequest
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


@router.get("/{page_id}", response_model=PageOut)
async def read_page(page_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Page).where(Page.id == page_id))
    page = result.scalars().first()
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@router.put("/{page_id}", response_model=PageOut)
async def update_page(
        page_id: int,
        page_in: PageUpdate,
        db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Page).where(Page.id == page_id))
    db_page = result.scalars().first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")

    update_data = page_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_page, key, value)

    await db.commit()
    await db.refresh(db_page)
    return db_page

@router.post("/", response_model=PageOut)
async def create_page(page_in: PageCreate, db: AsyncSession = Depends(get_db)):
    db_page = Page(**page_in.model_dump())
    db.add(db_page)
    await db.commit()
    await db.refresh(db_page)
    return db_page




@router.post("/bulk-from-dataset/{domain_id}")
async def bulk_generate_from_dataset(
        domain_id: int,
        req: BulkDatasetRequest,
        db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Page).where(Page.id == req.base_page_id))
    base_page = result.scalars().first()
    if not base_page:
        raise HTTPException(status_code=404, detail="Base page not found")

    new_pages = []
    base_content_str = json.dumps(base_page.content_data)
    base_url = base_page.url_path.replace(".html", "")

    for row in req.dataset:
        row_content_str = base_content_str
        # Замена плейсхолдеров {ColumnName} на значения из Excel
        for col_name, val in row.items():
            placeholder = f"{{{col_name}}}"
            row_content_str = row_content_str.replace(placeholder, str(val))

        new_page = Page(
            domain_id=domain_id,
            url_path=f"{base_url}-{uuid.uuid4().hex[:6]}.html",
            content_data=json.loads(row_content_str),
            is_active=True
        )
        new_pages.append(new_page)

    db.add_all(new_pages)
    await db.commit()
    return {"status": "success", "created": len(new_pages)}
@router.delete("/{page_id}")
async def delete_page(page_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Page).where(Page.id == page_id))
    db_page = result.scalars().first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")
    await db.delete(db_page)
    await db.commit()
    return {"status": "deleted"}