CMS.registerWidget('gallery', GalleryControl, GalleryPreview);

function GalleryControl({ value, onChange, forID, className }) {
  // Default structure
  const data = value || { folder: '', images: [] };
  const folder = data.folder || '';
  const images = data.images || [];

  // Add new image path to images list
  function handleImageAdd(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Ensure no trailing slash on folder
    const cleanFolder = folder.replace(/\/+$/, '');

    // Create image path with leading slash
    const imagePath = `/${cleanFolder}/${file.name}`;

    // Append new image path
    const newImages = [...images, imagePath];
    onChange({ folder, images: newImages });

    // Reset file input value so same file can be uploaded again if needed
    event.target.value = null;
  }

  // Delete image at index
  function handleImageDelete(index) {
    const newImages = images.slice();
    newImages.splice(index, 1);
    onChange({ folder, images: newImages });
  }

  return h('div', { id: forID, className, style: { fontFamily: 'sans-serif' } },
    h('label', { htmlFor: forID + '-folder' }, 'Gallery Folder:'),
    h('input', {
      id: forID + '-folder',
      type: 'text',
      value: folder,
      placeholder: 'e.g. images/activities/norma-loops/norma-loops-gallery',
      style: { width: '100%', marginBottom: '10px', padding: '6px', fontSize: '14px' },
      onInput: e => onChange({ folder: e.target.value, images }),
    }),

    h('div', { style: { marginBottom: '10px' } }, 'Images:'),

    h('ul', {
      style: {
        listStyle: 'none',
        padding: 0,
        marginBottom: '10px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px'
      }
    },
      images.map((img, idx) => {
        const src = img.startsWith('/') ? img : '/' + img;
        return h('li', {
          key: idx,
          style: {
            position: 'relative',
            width: '120px',
            height: '90px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            overflow: 'hidden',
          }
        },
          h('img', {
            src,
            alt: `Gallery Image ${idx + 1}`,
            style: {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }
          }),
          h('button', {
            type: 'button',
            onClick: () => handleImageDelete(idx),
            style: {
              position: 'absolute',
              top: '4px',
              right: '4px',
              backgroundColor: 'rgba(255, 0, 0, 0.7)',
              border: 'none',
              borderRadius: '2px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '2px 6px',
            }
          }, '×')
        );
      })
    ),

    h('input', {
      type: 'file',
      accept: 'image/*',
      onChange: handleImageAdd,
      style: { fontSize: '14px' },
    }),
  );
}

function GalleryPreview({ value }) {
  const data = value || {};
  const images = data.images || [];

  return h('div', { style: { fontFamily: 'sans-serif' } },
    h('h4', {}, 'Gallery Preview'),
    h('div', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
      }
    },
      images.map((img, idx) => {
        const src = img.startsWith('/') ? img : '/' + img;
        return h('img', {
          key: idx,
          src,
          alt: `Gallery Preview ${idx + 1}`,
          style: {
            width: '150px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '4px',
          }
        });
      })
    )
  );
}
