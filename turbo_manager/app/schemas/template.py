from pydantic import BaseModel
from typing import Any, Dict

class TemplateBase(BaseModel):
    name: str
    schema_data: Dict[str, Any]

class TemplateCreate(TemplateBase):
    pass

class TemplateOut(TemplateBase):
    id: int

    class Config:
        from_attributes = True