from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import domains, pages, turbo

app = FastAPI()

# Список разрешенных адресов
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Явно указываем список вместо ["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роутеры подключаем ПОСЛЕ middleware
app.include_router(domains.router, prefix="/api/domains", tags=["domains"])
app.include_router(pages.router, prefix="/api/pages", tags=["pages"])
app.include_router(turbo.router, prefix="/api/turbo", tags=["turbo"])