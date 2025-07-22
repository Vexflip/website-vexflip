const MultiImageFolderControl = window.createClass({
  getInitialState() {
    return {
      folder: '', // folder path string
      images: [], // array of image URLs
    };
  },

  componentDidMount() {
    this.syncStateWithProps(this.props);
  },

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.syncStateWithProps(this.props);
    }
  },

  syncStateWithProps(props) {
    const value = props.value || {};
    const folder = value.folder || '';
    const images = Array.isArray(value.images) ? value.images : [];
    this.setState({ folder, images });
  },

  getSlug() {
    // Try to get the slug from entry or fallback
    const slug = this.props.entry ? this.props.entry.get('slug') : '';
    if (slug) return slug.toLowerCase().replace(/[^a-z0-9\-]/g, '-');
    return '';
  },

  handleFolderChange(e) {
    const folder = e.target.value;
    this.setState({ folder }, () => {
      this.props.onChange({
        folder,
        images: this.state.images,
      });
    });
  },

  openMediaLibrary() {
    if (!this.props.mediaLibrary || !this.props.mediaLibrary.open) {
      alert('Media library not available');
      return;
    }
    // Open media library with multiple selection
    this.props.mediaLibrary
      .open({ allowMultiple: true })
      .then(selectedAssets => {
        if (!selectedAssets || selectedAssets.length === 0) return;

        const currentImages = this.state.images || [];

        // Map selected asset URLs to be relative to public_folder
        // We expect uploads to happen automatically inside folder configured media_folder
        // So URLs will be like /images/activities/slug/slug-gallery/filename.jpg

        // Just add the URLs (they should already be correct)
        const newImages = selectedAssets.map(asset => asset.url);

        // Merge with existing, avoid duplicates
        const mergedImages = [...currentImages];
        newImages.forEach(url => {
          if (!mergedImages.includes(url)) mergedImages.push(url);
        });

        this.setState({ images: mergedImages }, () => {
          this.props.onChange({
            folder: this.state.folder,
            images: mergedImages,
          });
        });
      })
      .catch(err => {
        console.error('Media library error:', err);
      });
  },

  handleDeleteImage(index) {
    const images = [...this.state.images];
    images.splice(index, 1);
    this.setState({ images }, () => {
      this.props.onChange({
        folder: this.state.folder,
        images,
      });
    });
  },

  render() {
    const { folder, images } = this.state;
    const slug = this.getSlug();

    // If no folder set, suggest default folder based on slug
    const defaultFolder = slug
      ? `images/activities/${slug}/${slug}-gallery`
      : '';

    return window.h('div', { style: { fontFamily: 'sans-serif' } }, [
      window.h(
        'label',
        { htmlFor: 'folder-input', style: { fontWeight: 'bold' } },
        'Gallery Folder Path'
      ),
      window.h('input', {
        id: 'folder-input',
        type: 'text',
        value: folder || defaultFolder,
        onChange: e => this.handleFolderChange(e),
        placeholder: 'images/activities/your-slug/your-slug-gallery',
        style: {
          width: '100%',
          padding: '8px',
          marginBottom: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '14px',
        },
      }),
      window.h(
        'button',
        {
          type: 'button',
          onClick: () => this.openMediaLibrary(),
          style: {
            backgroundColor: '#ff4081',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 8px rgba(255, 64, 129, 0.3)',
            transition: 'background-color 0.3s ease',
            marginBottom: '10px',
          },
          onMouseOver: e => (e.currentTarget.style.backgroundColor = '#e73370'),
          onMouseOut: e => (e.currentTarget.style.backgroundColor = '#ff4081'),
        },
        'Add Images via Media Library'
      ),

      images.length > 0 &&
        window.h(
          'div',
          {
            style: {
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginTop: '10px',
            },
          },
          images.map((src, i) =>
            window.h(
              'div',
              {
                key: i,
                style: { position: 'relative', width: '100px', height: '100px' },
              },
              [
                window.h('img', {
                  src,
                  alt: '',
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  },
                }),
                window.h(
                  'button',
                  {
                    type: 'button',
                    onClick: () => this.handleDeleteImage(i),
                    style: {
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      borderRadius: '50%',
                      color: 'white',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      lineHeight: '18px',
                      padding: 0,
                      userSelect: 'none',
                    },
                    title: 'Delete image',
                    'aria-label': 'Delete image',
                  },
                  '×'
                ),
              ]
            )
          )
        ),

      images.length === 0 &&
        window.h(
          'p',
          { style: { fontStyle: 'italic', color: '#666' } },
          'No images added yet.'
        ),
    ]);
  },
});

const MultiImageFolderPreview = window.createClass({
  render() {
    const value = this.props.value || {};
    const folder = value.folder || 'No folder set';
    const images = Array.isArray(value.images) ? value.images : [];

    if (images.length === 0) {
      return window.h('p', {}, `Folder: ${folder} (no images)`);
    }

    return window.h('div', { style: { fontFamily: 'sans-serif' } }, [
      window.h('p', {}, `Folder: ${folder}`),
      window.h(
        'div',
        { style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } },
        images.map((src, i) =>
          window.h('img', {
            key: i,
            src,
            alt: '',
            style: {
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '4px',
            },
          })
        )
      ),
    ]);
  },
});

CMS.registerWidget('galleryWidget', MultiImageFolderControl, MultiImageFolderPreview);
