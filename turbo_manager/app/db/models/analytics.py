from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from .base import Base
from datetime import datetime, timezone


class PageAnalytics(Base):
    __tablename__ = "page_analytics"

    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("pages.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    views = Column(Integer, default=0)
    visitors = Column(Integer, default=0)
    bounce_rate = Column(Float, default=0.0)
    avg_time_seconds = Column(Float, default=0.0)
    conversions = Column(Integer, default=0)

    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    page = relationship("Page", backref="analytics")