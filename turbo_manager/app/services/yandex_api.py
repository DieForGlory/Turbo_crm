import httpx
from typing import Dict, Any

class YandexAPIClient:
    BASE_URL = "https://api.webmaster.yandex.net/v4/user"

    def __init__(self, token: str, user_id: str):
        self.token = token
        self.user_id = user_id
        self.headers = {"Authorization": f"OAuth {self.token}"}

    async def get_hosts(self) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/{self.user_id}/hosts",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()

    async def trigger_content_update(self, host_id: str) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/{self.user_id}/hosts/{host_id}/turbo/batchContentUpdates",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()