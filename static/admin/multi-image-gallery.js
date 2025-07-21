CMS.registerWidget('gallery-upload', createGalleryControl, createGalleryPreview);

function createGalleryControl({ value, onChange, entry }) {
  const folderSlug = entry?.get('slug') || 'default-slug';
  const folderPath = `images/activities/${folderSlug}/${folderSlug}-gallery`;
  const publicPath = `/images/activities/${folderSlug}/${folderSlug}-gallery`;

  let currentImages = [];
  if (value && typeof value === 'object') {
    if (Array.isArray(value.images)) {
      currentImages = value.images;
    }
  }

  function handleUpload(e) {
    const files = Array.from(e.target.files);
    const uploaded = [];

    files.forEach((file) => {
      const path = `${publicPath}/${file.name}`;
      uploaded.push(path);
    });

    const updatedImages = [...currentImages, ...uploaded];

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
            style: { maxWidth: '100px', marginRight: '10px', display: 'inline-block' }
          }),
          h('button', {
            onClick: () => handleDelete(i),
            style: {
              display: 'inline-block',
              background: '#e74c3c',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
              borderRadius: '4px'
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
