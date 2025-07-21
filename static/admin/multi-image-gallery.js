const MultiImageFolderControl = window.createClass({
  getInitialState() {
    const value = this.props.value || {};
    return {
      images: value.images || [],
      folder: value.folder || '',
    };
  },

  openMediaLibrary() {
    const mediaLib = window.CMS.getMediaLibrary();

    mediaLib.show({ allowMultiple: true });

    mediaLib.on('insert', selectedAssets => {
      const newImagePaths = selectedAssets.map(asset => asset.url || asset.path);

      // Derive common folder path (basic version)
      const folder = this.deriveFolderFromImage(newImagePaths[0]);

      this.setState(
        state => ({
          images: [...state.images, ...newImagePaths],
          folder: folder || state.folder,
        }),
        () => this.emitChange()
      );
    });
  },

  deriveFolderFromImage(imageUrl) {
    // Example: "/images/activities/my-event/my-event-gallery/img1.jpg"
    // => "/images/activities/my-event/my-event-gallery"
    if (!imageUrl) return '';
    const parts = imageUrl.split('/');
    return parts.slice(0, -1).join('/');
  },

  emitChange() {
    const { folder, images } = this.state;
    this.props.onChange({ folder, images });
  },

  removeImage(index) {
    this.setState(
      state => {
        const newImages = [...state.images];
        newImages.splice(index, 1);
        return { images: newImages };
      },
      () => this.emitChange()
    );
  },

  render() {
    const { images, folder } = this.state;

    return window.h('div', {}, [
      window.h(
        'button',
        {
          type: 'button',
          onClick: this.openMediaLibrary,
          style: {
            backgroundColor: '#2196f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 16px',
            cursor: 'pointer',
            marginBottom: '10px',
          },
        },
        'Add Images from Media Library'
      ),
      images.length > 0 &&
        window.h(
          'div',
          { style: { display: 'flex', flexWrap: 'wrap', gap: '10px' } },
          images.map((src, index) =>
            window.h('div', { key: index, style: { position: 'relative' } }, [
              window.h('img', {
                src,
                style: {
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                },
              }),
              window.h(
                'button',
                {
                  onClick: () => this.removeImage(index),
                  style: {
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  },
                },
                '×'
              ),
            ])
          )
        ),
      folder &&
        window.h('p', {
          style: {
            marginTop: '10px',
            fontStyle: 'italic',
            color: '#666',
          },
        }, `Folder: ${folder}`),
    ]);
  },
});

const MultiImageFolderPreview = window.createClass({
  render() {
    const { images = [], folder = '' } = this.props.value || {};
    return window.h('div', {}, [
      window.h('p', {}, `Folder: ${folder}`),
      images.map((src, i) =>
        window.h('img', {
          key: i,
          src,
          style: { maxWidth: '80px', marginRight: '5px', marginBottom: '5px' },
        })
      ),
    ]);
  },
});

CMS.registerWidget('multiimagefolder', MultiImageFolderControl, MultiImageFolderPreview);
