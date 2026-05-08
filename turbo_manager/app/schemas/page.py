from pydantic import BaseModel
from typing import Dict, Any, Optional, List

class PageUpdate(BaseModel):
    content_data: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class PageCreate(BaseModel):
    domain_id: int
    url_path: str
    content_data: Dict[str, Any]
    is_active: bool = True

class PageOut(BaseModel):
    id: int
    domain_id: int
    url_path: str
    content_data: Dict[str, Any]
    is_active: bool
    updated_at: Any

class BulkDatasetRequest(BaseModel):
    base_page_id: int
    dataset: List[Dict[str, Any]]