import os
import frontmatter
import requests

LIBRETRANSLATE_URL = "https://libretranslate.com/translate"
SOURCE_LANG = "en"
TARGET_LANG = "fr"      # e.g. 'fr', 'de'
TARGET_SUFFIX = TARGET_LANG
SOURCE_DIR = "content"
EXCLUDED_FIELDS = {"images", "gallery", "logo"}

def translate_text(text, source_lang, target_lang):
    response = requests.post(
        LIBRETRANSLATE_URL,
        data={
            "q": text,
            "source": source_lang,
            "target": target_lang,
            "format": "text"
        }
    )
    result = response.json()
    return result.get("translatedText", text)

for root, _, files in os.walk(SOURCE_DIR):
    for file in files:
        if file.endswith(".md") and not file.endswith(f".{TARGET_SUFFIX}.md"):
            src_path = os.path.join(root, file)

            # Skip already translated folders (e.g., content/fr/)
            if os.path.commonpath([src_path, os.path.join(SOURCE_DIR, TARGET_LANG)]) == os.path.join(SOURCE_DIR, TARGET_LANG):
                continue

            rel_path = os.path.relpath(src_path, SOURCE_DIR)  # like 'activities/foo.md'
            translated_path = os.path.join(SOURCE_DIR, TARGET_LANG, rel_path)  # like 'content/fr/activities/foo.md'

            post = frontmatter.load(src_path)
            print(f"🔁 Translating: {src_path}")

            # Translate content
            translated_content = translate_text(post.content, SOURCE_LANG, TARGET_LANG)

            # Translate metadata (except excluded)
            translated_metadata = {}
            for key, value in post.metadata.items():
                if key in EXCLUDED_FIELDS:
                    translated_metadata[key] = value
                elif isinstance(value, str):
                    translated_metadata[key] = translate_text(value, SOURCE_LANG, TARGET_LANG)
                else:
                    translated_metadata[key] = value

            new_post = frontmatter.Post(translated_content, **translated_metadata)

            # Ensure directory exists
            os.makedirs(os.path.dirname(translated_path), exist_ok=True)

            # Save translated file
            with open(translated_path, "wb") as f:
                frontmatter.dump(new_post, f)

            print(f"✅ Saved: {translated_path}")
