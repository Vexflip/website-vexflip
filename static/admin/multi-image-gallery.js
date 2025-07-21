CMS.registerWidget('gallery-upload', createGalleryControl, createGalleryPreview);

function createGalleryControl({ value, onChange, entry, mediaLibrary }) {
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
      // Upload file using DecapCMS mediaLibrary API
      const uploaded = await mediaLibrary.persistMedia(file);
      uploadedUrls.push(uploaded.public_path);
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

  return h('div', { style: { fontFamily: 'Arial, sans-serif' } },
    h('p', { style: { fontWeight: 'bold' } }, `Folder: ${folderPath}`),
    h('input', {
      type: 'file',
      multiple: true,
      onChange: handleUpload,
      style: { marginBottom: '10px' }
    }),
    h('ul', { style: { padding: 0 } },
      currentImages.map((img, i) =>
        h('li', {
          key: i,
          style: {
            listStyle: 'none',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center'
          }
        },
          h('img', {
            src: img,
            alt: `Gallery image ${i + 1}`,
            style: {
              maxWidth: '100px',
              maxHeight: '100px',
              marginRight: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              objectFit: 'cover'
            }
          }),
          h('button', {
            onClick: () => handleDelete(i),
            style: {
              backgroundColor: '#e74c3c',
              border: 'none',
              color: 'white',
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
  const images = (value && Array.isArray(value.images)) ? value.images : [];

  return h('div', {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif'
    }
  },
    images.map((src, i) =>
      h('img', {
        key: i,
        src,
        alt: `Gallery preview ${i + 1}`,
        style: {
          maxWidth: '100px',
          maxHeight: '100px',
          objectFit: 'cover',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }
      })
    )
  );
}
