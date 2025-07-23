import os
import frontmatter
import requests

# LibreTranslate public endpoint or your self-hosted one
LIBRETRANSLATE_URL = "https://libretranslate.com/translate"

SOURCE_LANG = "en"
TARGET_LANG = "fr"      # Change to "es", "de", etc. as needed
TARGET_SUFFIX = "fr"    # Suffix for translated files
SOURCE_DIR = "content"  # Hugo content folder

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
            path = os.path.join(root, file)
            post = frontmatter.load(path)

            print(f"🔁 Translating: {path}")
            translated_content = translate_text(post.content, SOURCE_LANG, TARGET_LANG)

            # Create translated file with same frontmatter
            new_post = frontmatter.Post(translated_content, **post.metadata)

            base, ext = os.path.splitext(file)
            translated_filename = f"{base}.{TARGET_SUFFIX}{ext}"
            translated_path = os.path.join(root, translated_filename)

            with open(translated_path, "wb") as f:
                frontmatter.dump(new_post, f)

            print(f"✅ Saved: {translated_path}")
