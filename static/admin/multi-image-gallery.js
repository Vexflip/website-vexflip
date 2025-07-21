const MultiImageFolderControl = window.createClass({
  getInitialState() {
    return {
      uploadingPreviews: [], // base64 previews of newly added files
      uploadingFiles: [],    // actual File objects to upload later (if needed)
      images: [],            // list of image URLs (or paths) to show (both existing and newly added)
    };
  },

  componentDidMount() {
    // On mount, try to fetch the list of images in the folder path if possible
    // NOTE: Without backend API, this is not possible in default DecapCMS widget environment.
    // So if you can provide an array of existing images in frontmatter or via props, initialize state here.
    if (this.props.value && Array.isArray(this.props.value.images)) {
      this.setState({ images: this.props.value.images });
    }
  },

  handleFiles(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const previews = [];
    const filesToAdd = [];
    let loadedCount = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        previews.push(e.target.result);
        filesToAdd.push(file);
        loadedCount++;
        if (loadedCount === files.length) {
          this.setState(state => ({
            uploadingPreviews: [...state.uploadingPreviews, ...previews],
            uploadingFiles: [...state.uploadingFiles, ...filesToAdd],
            images: [...state.images, ...previews], // temporarily show previews as image URLs
          }));
          // Update frontmatter with folder path and images list
          // You may only want to store folder path, but storing images array helps preview
          this.emitChange();
        }
      };
      reader.readAsDataURL(file);
    });
  },

  emitChange() {
    // Save just the folder path to frontmatter (this.props.value.folder)
    // Optionally, save images array if you want to store list of images for preview
    this.props.onChange({
      folder: this.props.value?.folder || 'gallery-uploads',
      images: this.state.images,
    });
  },

  removeImage(index) {
    this.setState(state => {
      const newImages = [...state.images];
      newImages.splice(index, 1);

      // Also remove from uploadingPreviews if it's a preview image
      const newUploadingPreviews = [...state.uploadingPreviews];
      if (index < newUploadingPreviews.length) {
        newUploadingPreviews.splice(index, 1);
      }

      return {
        images: newImages,
        uploadingPreviews: newUploadingPreviews,
      };
    }, () => this.emitChange());
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
        'Add Images'
      ),
      window.h('input', {
        type: 'file',
        multiple: true,
        accept: 'image/*',
        style: { display: 'none' },
        ref: input => (this.fileInput = input),
        onChange: e => this.handleFiles(e),
      }),
      this.state.images.length > 0 &&
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
          this.state.images.map((src, i) =>
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
                    onClick: () => this.removeImage(i),
                    style: {
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(0,0,0,0.6)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      lineHeight: '20px',
                      textAlign: 'center',
                    },
                    title: 'Delete image',
                  },
                  '×'
                ),
              ]
            )
          )
        ),
      this.props.value?.folder &&
        window.h(
          'p',
          { style: { marginTop: '1rem', fontStyle: 'italic', color: '#666' } },
          `Current gallery folder: ${this.props.value.folder}`
        ),
    ]);
  },
});

const MultiImageFolderPreview = window.createClass({
  render() {
    const folder = this.props.value?.folder || 'No folder selected';
    return window.h('p', {}, folder);
  },
});

CMS.registerWidget('multiimagefolder', MultiImageFolderControl, MultiImageFolderPreview);
