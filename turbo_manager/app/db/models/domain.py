from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base

class Domain(Base):
    __tablename__ = "domains"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    yandex_token = Column(String, nullable=True)
    yandex_host_id = Column(String, nullable=True)

    pages = relationship("Page", back_populates="domain", cascade="all, delete-orphan")