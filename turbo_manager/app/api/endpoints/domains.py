from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.db.session import get_db
from app.db.models.domain import Domain
from app.schemas.domain import DomainCreate, DomainOut

router = APIRouter()

@router.post("/", response_model=DomainOut)
async def create_domain(domain_in: DomainCreate, db: AsyncSession = Depends(get_db)):
    # Проверка на дубликат
    query = select(Domain).where(Domain.name == domain_in.name)
    result = await db.execute(query)
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Domain already exists")

    db_domain = Domain(**domain_in.model_dump())
    db.add(db_domain)
    await db.commit()
    await db.refresh(db_domain)
    return db_domain

@router.get("/", response_model=List[DomainOut])
async def read_domains(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Domain))
    return result.scalars().all()