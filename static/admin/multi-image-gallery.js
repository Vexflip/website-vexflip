CMS.registerWidget('gallery-upload', createGalleryControl, createGalleryPreview);

function createGalleryControl({ value, onChange, entry, mediaPaths, mediaLibrary }) {
  const folderSlug = entry?.get('slug') || 'default-slug';
  const folderPath = `images/activities/${folderSlug}/${folderSlug}-gallery`;
  const publicPath = `/images/activities/${folderSlug}/${folderSlug}-gallery`;

  let currentImages = [];
  if (value && typeof value === 'object') {
    if (Array.isArray(value.images)) {
      currentImages = value.images;
    }
  }

  async function handleUpload(event) {
    const files = Array.from(event.target.files);
    const uploadedUrls = [];

    for (const file of files) {
      // Upload via DecapCMS media library
      const uploaded = await mediaLibrary.persistMedia(file);
      uploadedUrls.push(uploaded.public_path); // gets the correct public URL
    }

    const updatedImages = [...currentImages, ...uploadedUrls];
    onChange({
      folder: folderPath,
      images: updatedImages,
    });
  }

  function handleDelete(index) {
    const updated = currentImages.filter((_, i) => i !== index);
    onChange({
      folder: folderPath,
      images: updated,
    });
  }

  return h('div', {},
    h('p', {}, `Folder: ${folderPath}`),
    h('input', {
      type: 'file',
      multiple: true,
      onChange: handleUpload,
    }),
    h('ul', {},
      currentImages.map((img, i) =>
        h('li', { key: i, style: { listStyle: 'none', margin: '10px 0' } },
          h('img', {
            src: img,
            style: { maxWidth: '100px', marginRight: '10px' }
          }),
          h('button', {
            onClick: () => handleDelete(i),
            style: {
              background: '#e74c3c',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }
          }, 'Delete')
        )
      )
    )
  );
}

function createGalleryPreview({ value }) {
  const images = (value && value.images) || [];
  return h('div', {},
    images.map((src, i) =>
      h('img', {
        src,
        key: i,
        style: { maxWidth: '100px', margin: '5px' }
      })
    )
  );
}
