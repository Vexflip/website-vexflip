const MultiImageControl = window.createClass({
  getInitialState() {
    return { fileNames: [], previews: [], images: [] };
  },

  handleFiles(event) {
    const files = Array.from(event.target.files);

    // Append new files to existing ones
    const allFiles = this.state.images.concat(files);

    // Update fileNames and images state
    const fileNames = allFiles.map(f => f.name);

    // Read all files as data URLs for preview
    const previews = [];
    let filesProcessed = 0;

    allFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = e => {
        previews[index] = e.target.result;
        filesProcessed++;
        if (filesProcessed === allFiles.length) {
          this.setState({ previews, fileNames, images: allFiles });
          // Update frontmatter data
          const paths = allFiles.map(file => ({ image: file.name, alt: '' }));
          this.props.onChange(paths);
        }
      };
      reader.readAsDataURL(file);
    });
  },

  removeImage(index) {
    const images = [...this.state.images];
    images.splice(index, 1);

    // Update previews and fileNames accordingly
    const fileNames = images.map(f => f.name);
    const previews = [];

    if (images.length === 0) {
      this.setState({ images: [], previews: [], fileNames: [] });
      this.props.onChange([]);
      return;
    }

    let filesProcessed = 0;
    images.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = e => {
        previews[i] = e.target.result;
        filesProcessed++;
        if (filesProcessed === images.length) {
          this.setState({ images, previews, fileNames });
          const paths = images.map(file => ({ image: file.name, alt: '' }));
          this.props.onChange(paths);
        }
      };
      reader.readAsDataURL(file);
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
        'Upload Images'
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
                  borderRadius: '6px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                },
              },
              [
                window.h('img', {
                  src,
                  alt: this.state.fileNames[i],
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  },
                }),
                window.h(
                  'button',
                  {
                    onClick: () => this.removeImage(i),
                    style: {
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      lineHeight: '18px',
                      padding: 0,
                    },
                    title: 'Remove image',
                    type: 'button',
                  },
                  '×'
                ),
              ]
            )
          )
        ),
    ]);
  },
});

const MultiImagePreview = window.createClass({
  render() {
    const images = this.props.value || [];
    return window.h(
      'ul',
      {},
      images.map((img, index) =>
        window.h('li', { key: index }, img.image || 'No file name')
      )
    );
  },
});

CMS.registerWidget('multiimagegallery', MultiImageControl, MultiImagePreview);
