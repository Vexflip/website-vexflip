(function registerGalleryWidgetWhenReady() {
  function register() {
    const GalleryControl = ({ value, onChange, entry, forID, className }) => {
      const slug = entry?.get('slug') || 'default-slug';
      const generatedFolder = `images/activities/${slug}/${slug}-gallery`;
      const images = value?.get('images') || [];

      React.useEffect(() => {
        if (!value?.get('folder') || value.get('folder') !== generatedFolder) {
          onChange(value.set('folder', generatedFolder));
        }
      }, [slug]);

      const handleImageAdd = (imagePath) => {
        const updatedImages = images.push(imagePath);
        onChange(value.set('images', updatedImages));
      };

      const handleImageDelete = (index) => {
        const updatedImages = images.delete(index);
        onChange(value.set('images', updatedImages));
      };

      return (
        <div id={forID} className={className}>
          <input type="hidden" value={generatedFolder} readOnly />
          <div style={{ marginBottom: '1em' }}>
            <strong>Gallery Folder:</strong> <code>{generatedFolder}</code>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {images.map((img, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <img
                  src={img}
                  alt=""
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    boxShadow: '0 0 3px rgba(0,0,0,0.2)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(idx)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'rgba(255, 0, 0, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0 4px 0 4px',
                    cursor: 'pointer',
                    padding: '2px 6px',
                  }}
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1em' }}>
            <NetlifyCmsWidgetImage
              onChange={(e) => {
                const imagePath = e?.toJS?.().value || e;
                if (imagePath) handleImageAdd(imagePath);
              }}
            />
          </div>
        </div>
      );
    };

    const GalleryPreview = ({ value }) => {
      const images = value?.get('images') || [];
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt=""
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          ))}
        </div>
      );
    };

    window.CMS.registerWidget('gallery', GalleryControl, GalleryPreview);
  }

  if (window.CMS) {
    register();
  } else {
    window.addEventListener('load', () => {
      if (window.CMS) {
        register();
      } else {
        console.error('DecapCMS not found when trying to register custom widget.');
      }
    });
  }
})();
