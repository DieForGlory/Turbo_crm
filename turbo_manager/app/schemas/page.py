from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class PageBase(BaseModel):
    domain_id: int
    template_id: Optional[int] = None
    url_path: str
    content_data: Dict[str, Any]
    is_active: bool = True

class PageCreate(PageBase):
    pass

class PageUpdate(BaseModel):
    template_id: Optional[int] = None
    url_path: Optional[str] = None
    content_data: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class PageOut(PageBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True