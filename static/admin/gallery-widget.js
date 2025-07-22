const MultiImageFolderControl = window.createClass({
  getInitialState() {
    return {
      uploading: false,
      previews: [],
    };
  },

  componentDidMount() {
    const value = this.props.value;
    if (value && Array.isArray(value.images)) {
      this.setState({ previews: value.images });
    }
  },

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value && this.props.value && Array.isArray(this.props.value.images)) {
      this.setState({ previews: this.props.value.images });
    }
  },

  getFolderPath() {
    const slug = this.props.entry && this.props.entry.getIn(['data', 'slug']) || 'default-slug';
    return `images/activities/${slug}/${slug}-gallery`;
  },

  handleFiles(event) {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    this.setState({ uploading: true });

    this.props.onUpload(files).then(uploadedFiles => {
      // uploadedFiles: array of { path: 'relative path', url: 'full url' }
      const folder = this.getFolderPath();
      const newImagePaths = uploadedFiles.map(f => '/' + f.path);
      const currentImages = (this.props.value && this.props.value.images) || [];
      const updatedImages = [...currentImages, ...newImagePaths];

      this.props.onChange({
        folder,
        images: updatedImages,
      });

      this.setState({ previews: updatedImages, uploading: false });
    }).catch(err => {
      console.error('Upload failed:', err);
      alert('Upload failed, check console');
      this.setState({ uploading: false });
    });

    event.target.value = '';
  },



  handleDeletePreview(index) {
    const previews = [...this.state.previews];
    previews.splice(index, 1);
    this.setState({ previews });

    this.props.onChange({
      folder: this.props.value && this.props.value.folder || this.getFolderPath(),
      images: previews,
    });
  },

  triggerFileInput() {
    this.fileInput.click();
  },

  render() {
    return window.h('div', { style: { fontFamily: 'sans-serif' } }, [
      window.h(
        'button',
        {
          type: 'button',
          onClick: () => this.triggerFileInput(),
          disabled: this.state.uploading,
          style: {
            backgroundColor: this.state.uploading ? '#ccc' : '#ff4081',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            cursor: this.state.uploading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            boxShadow: '0 4px 8px rgba(255, 64, 129, 0.3)',
            transition: 'background-color 0.3s ease',
            marginBottom: '10px',
          },
          onMouseOver: e => !this.state.uploading && (e.currentTarget.style.backgroundColor = '#e73370'),
          onMouseOut: e => !this.state.uploading && (e.currentTarget.style.backgroundColor = '#ff4081'),
        },
        this.state.uploading ? 'Uploading...' : 'Upload Images'
      ),

      window.h('input', {
        type: 'file',
        multiple: true,
        accept: 'image/*',
        style: { display: 'none' },
        ref: input => (this.fileInput = input),
        onChange: e => this.handleFiles(e),
      }),

      this.state.previews.length > 0 &&
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
          this.state.previews.map((src, i) =>
            window.h(
              'div',
              {
                key: i,
                style: {
                  position: 'relative',
                  width: '100px',
                  height: '100px',
                },
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
                    onClick: () => this.handleDeletePreview(i),
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

      this.props.value &&
        window.h(
          'p',
          { style: { marginTop: '1rem', fontStyle: 'italic', color: '#666' } },
          `Current gallery folder: ${this.props.value.folder || this.getFolderPath()}`
        ),
    ]);
  },
});

const MultiImageFolderPreview = window.createClass({
  render() {
    const value = this.props.value;
    if (!value || !value.images || value.images.length === 0) {
      return window.h('p', {}, 'No images in gallery');
    }
    return window.h(
      'div',
      {
        style: {
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        },
      },
      value.images.map((src, i) =>
        window.h('img', {
          key: i,
          src,
          alt: '',
          style: {
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          },
        })
      )
    );
  },
});

CMS.registerWidget('galleryWidget', MultiImageFolderControl, MultiImageFolderPreview);
