from pydantic import BaseModel
from typing import Optional

class DomainBase(BaseModel):
    name: str
    yandex_token: Optional[str] = None
    yandex_host_id: Optional[str] = None

class DomainCreate(DomainBase):
    pass

class DomainOut(DomainBase):
    id: int

    class Config:
        from_attributes = True