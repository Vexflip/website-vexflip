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
            rel_path = os.path.relpath(src_path, SOURCE_DIR)  # path relative to 'content'
            filename = os.path.basename(file)

            # Load and translate
            post = frontmatter.load(src_path)
            print(f"🔁 Translating: {src_path}")

            translated_content = translate_text(post.content, SOURCE_LANG, TARGET_LANG)

            # Translate metadata (except excluded fields)
            translated_metadata = {}
            for key, value in post.metadata.items():
                if key in EXCLUDED_FIELDS:
                    translated_metadata[key] = value
                elif isinstance(value, str):
                    translated_metadata[key] = translate_text(value, SOURCE_LANG, TARGET_LANG)
                else:
                    translated_metadata[key] = value

            new_post = frontmatter.Post(translated_content, **translated_metadata)

            # Save to content/<lang>/<original-path>.md
            translated_output_path = os.path.join(SOURCE_DIR, TARGET_LANG, filename)
            os.makedirs(os.path.dirname(translated_output_path), exist_ok=True)

            with open(translated_output_path, "wb") as f:
                frontmatter.dump(new_post, f)

            print(f"✅ Saved: {translated_output_path}")
