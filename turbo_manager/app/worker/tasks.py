from app.worker.celery_app import celery_app
from app.services.yandex_api import YandexAPIClient
import asyncio


@celery_app.task(name="trigger_yandex_update")
def trigger_yandex_update_task(token: str, user_id: str, host_id: str):
    async def run():
        client = YandexAPIClient(token=token, user_id=user_id)
        await client.trigger_content_update(host_id)

    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
    return f"Update triggered for host {host_id}"