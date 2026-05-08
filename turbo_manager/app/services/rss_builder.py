from lxml import etree
from typing import List, Dict, Any


def render_blocks_to_html(blocks: List[Dict[str, Any]]) -> str:
    html_out = ""
    for block in blocks:
        b_type = block.get("type")
        data = block.get("data", {})

        if b_type == "header":
            level = data.get("level", 1)
            html_out += f"<h{level}>{data.get('text')}</h{level}>"
        elif b_type == "paragraph":
            html_out += f"<p>{data.get('text')}</p>"
        elif b_type == "button":
            html_out += f'<button formaction="{data.get("url")}" data-background-color="{data.get("color", "#000")}">{data.get("text")}</button>'

    return f"<header><h1>Сгенерировано</h1></header>{html_out}"


def build_turbo_feed(domain_url: str, pages: List[Dict[str, Any]]) -> bytes:
    rss = etree.Element("rss", version="2.0", nsmap={
        "yandex": "http://news.yandex.ru",
        "turbo": "http://turbo.yandex.ru"
    })
    channel = etree.SubElement(rss, "channel")

    etree.SubElement(channel, "title").text = f"Turbo Feed: {domain_url}"
    etree.SubElement(channel, "link").text = domain_url

    for page in pages:
        item = etree.SubElement(channel, "item", turbo="true")
        etree.SubElement(item, "link").text = f"{domain_url}{page['url_path']}"

        html_content = render_blocks_to_html(page.get('content_data', {}).get('blocks', []))

        content = etree.SubElement(item, "{http://turbo.yandex.ru}content")
        content.text = etree.CDATA(html_content)

    return etree.tostring(rss, encoding="UTF-8", xml_declaration=True)