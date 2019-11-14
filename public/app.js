function basename(filepath) {
  const splat = filepath.split('/');
  const len = splat.length;

  if (splat[len - 1] === '') {
    return splat[len - 2];
  } // else


  return splat[len - 1];
}

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.root.includes(this.props.path) ? true : false
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleToggle() {
    this.setState({
      open: !this.state.open
    });
  }

  handleSelect() {
    this.props.onFolderSelect(this.props.path);
  }

  render() {
    if (!this.props.subdirsIndex) {
      return null;
    }

    const hiddenIfClosed = this.state.open ? '' : 'is-hidden';
    const hiddenIfOpen = this.state.open ? 'is-hidden' : '';
    const isActive = this.props.path === this.props.activeFolder ? 'is-active' : '';
    const has_child_dirs = this.props.child_dirs && this.props.child_dirs.length > 0;

    if (!has_child_dirs) {
      return React.createElement("li", null, React.createElement("a", {
        className: isActive,
        onClick: this.handleSelect
      }, this.props.text));
    } else {
      return React.createElement("li", null, React.createElement("div", {
        style: {
          position: 'relative'
        }
      }, React.createElement("span", {
        className: "icon",
        onClick: this.handleToggle,
        style: {
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: '-1.5rem',
          backgroundColor: '#fff'
        }
      }, React.createElement("span", {
        className: hiddenIfClosed
      }, React.createElement("i", {
        className: "far fa-lg fa-minus-square"
      })), React.createElement("span", {
        className: hiddenIfOpen
      }, React.createElement("i", {
        className: "far fa-lg fa-plus-square"
      }))), React.createElement("a", {
        className: isActive,
        onClick: this.handleSelect
      }, React.createElement("span", null, this.props.text))), React.createElement("span", {
        className: hiddenIfClosed
      }, this.state.open && React.createElement("ul", null, this.props.child_dirs.map(n => {
        return React.createElement(MenuItem, {
          child_dirs: this.props.subdirsIndex[n],
          text: basename(n),
          key: n,
          path: n,
          subdirsIndex: this.props.subdirsIndex,
          root: this.props.root,
          onFolderSelect: this.props.onFolderSelect,
          activeFolder: this.props.activeFolder
        });
      }))));
    }
  }

}

class Menu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.subdirs) {
      return null;
    }

    return React.createElement("aside", {
      className: "menu"
    }, React.createElement("ul", {
      className: "menu-list"
    }, this.props.root.map(n => React.createElement(MenuItem, {
      child_dirs: this.props.subdirs[n],
      text: basename(n),
      key: n,
      path: n,
      subdirsIndex: this.props.subdirs,
      root: this.props.root,
      onFolderSelect: this.props.onFolderSelect,
      activeFolder: this.props.activeFolder
    }))));
  }

}

function LeftArrow() {
  return React.createElement("p", {
    className: "icon"
  }, React.createElement("i", {
    className: "fas fa-angle-left"
  }));
}

function RightArrow() {
  return React.createElement("p", {
    className: "icon"
  }, React.createElement("i", {
    className: "fas fa-angle-right"
  }));
}

class Thumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect() {
    let url = this.props.url.replace(/_thumb\.jpg$/, '.jpg');
    this.props.onImageSelect(url);
  }

  render() {
    return React.createElement("div", {
      className: "column"
    }, this.props.url && React.createElement("figure", {
      className: "image",
      style: {
        borderRadius: this.props.isActive ? '2px' : '',
        boxShadow: this.props.isActive ? 'inset -3px -3px 0 hsl(217, 71%, 53%), inset 3px 3px 0 hsl(217, 71%, 53%)' : '',
        border: this.props.isActive ? '3px solid hsl(217, 71%, 53%)' : ''
      }
    }, React.createElement("a", {
      onClick: this.handleSelect
    }, React.createElement("img", {
      src: this.props.url,
      style: {
        objectFit: 'cover',
        height: '180px'
      }
    }))));
  }

}

class ThumbnailBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleShiftLeft = this.handleShiftLeft.bind(this);
    this.handleShiftRight = this.handleShiftRight.bind(this);
  }

  handleShiftLeft() {
    this.props.onShift('LEFT');
  }

  handleShiftRight() {
    this.props.onShift('RIGHT');
  }

  render() {
    if (this.props.images && this.props.activeFolder) {
      const images = this.props.images[this.props.activeFolder];
      const thumbs = this.props.thumbs[this.props.activeFolder];
      const numColumns = this.props.numColumns;
      const offset = this.props.offset;
      let visibleImages;

      if (images && images.length < numColumns) {
        const range = [...Array(numColumns).keys()].slice(0, numColumns - images.length);
        visibleImages = images.concat(range.map(x => '__' + x.toString() + '__')); // placeholder
      } else if (images && images.length > numColumns) {
        visibleImages = images.slice(offset, offset + numColumns);
      }

      const visibleThumbs = visibleImages && visibleImages.map(img => {
        const thm = img.replace(/\.jpg$/, '_thumb.jpg');

        if (thumbs.indexOf(thm) < 0) {
          return img;
        } else {
          return thm;
        }
      });

      if (!visibleThumbs) {
        return null;
      }

      const elems = visibleThumbs.map(img => {
        return React.createElement(Thumbnail, {
          key: img,
          url: img.match(/^__[0-9]+__$/) ? null : img // replace with null if placeholder
          ,
          onImageSelect: this.props.onImageSelect,
          isActive: this.props.activeImage === img.replace(/_thumb\.jpg$/, '.jpg')
        });
      });
      return React.createElement("div", {
        className: "columns is-vcentered",
        style: {
          width: '100%'
        }
      }, React.createElement("div", {
        className: "column has-text-centered is-narrow",
        onClick: this.handleShiftLeft
      }, React.createElement(LeftArrow, null)), elems, React.createElement("div", {
        className: "column has-text-centered is-narrow",
        onClick: this.handleShiftRight
      }, React.createElement(RightArrow, null)));
    } else {
      return null;
    }
  }

}

function Image(props) {
  return React.createElement("figure", {
    className: "image",
    style: {
      margin: '0 auto'
    }
  }, React.createElement("img", {
    src: props.url,
    style: {
      maxHeight: '548px',
      objectFit: 'cover',
      objectPosition: '0 10%'
    }
  }));
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      subdirs: null,
      images: null,
      thumbs: null,
      root: ['media/sneps/', 'media/jedav/'],
      activeFolder: 'media/sneps/',
      thumbnailBarOffset: 0,
      thumbnailBarNumColumns: 5
    };
    this.handleFolderSelect = this.handleFolderSelect.bind(this);
    this.handleImageSelect = this.handleImageSelect.bind(this);
    this.handleThumbnailBarShift = this.handleThumbnailBarShift.bind(this);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'rpc/index/media');
    xhr.responseType = 'json';
    xhr.send();

    xhr.onload = () => {
      if (xhr.status !== 200) {
        alert(`Error ${xhr.status}: ${xhr.statusText}`);
      } else {
        let subdirs = {};
        let images = {};
        let thumbs = {};

        for (let k in xhr.response) {
          subdirs[k] = xhr.response[k]['directories'];
          images[k] = xhr.response[k]['files'].filter(fn => fn.match(/\.jpg$/i) && !fn.match(/\_thumb.jpg$/i));
          thumbs[k] = xhr.response[k]['files'].filter(fn => fn.match(/\_thumb.jpg$/i));
        }

        this.setState({
          subdirs: subdirs,
          images: images,
          thumbs: thumbs
        });
      }
    };
  }

  handleFolderSelect(path) {
    this.setState({
      activeFolder: path
    });
  }

  handleImageSelect(path) {
    this.setState({
      url: path
    });
  }

  handleThumbnailBarShift(direction) {
    const currentImages = this.state.images[this.state.activeFolder];
    let newOffset;

    if (direction === 'LEFT') {
      newOffset = this.state.thumbnailBarOffset - this.state.thumbnailBarNumColumns;

      if (newOffset < 0) {
        newOffset = 0;
      }
    } else if (direction === 'RIGHT') {
      newOffset = this.state.thumbnailBarOffset + this.state.thumbnailBarNumColumns;
      const max = currentImages.length - this.state.thumbnailBarNumColumns;

      if (newOffset > max) {
        newOffset = max;
      }
    }

    this.setState({
      thumbnailBarOffset: newOffset
    });
  }

  render() {
    return React.createElement("section", {
      className: "section"
    }, React.createElement("div", {
      className: "container"
    }, React.createElement("div", {
      className: "columns"
    }, React.createElement("div", {
      className: "column is-one-fifth"
    }, React.createElement(Menu, {
      subdirs: this.state.subdirs,
      root: this.state.root,
      onFolderSelect: this.handleFolderSelect,
      activeFolder: this.state.activeFolder
    })), React.createElement("div", {
      className: "column"
    }, React.createElement("div", {
      className: "level"
    }, React.createElement(Image, {
      url: this.state.url
    })), React.createElement("div", {
      className: "level"
    }, React.createElement(ThumbnailBar, {
      activeFolder: this.state.activeFolder,
      activeImage: this.state.url,
      images: this.state.images,
      thumbs: this.state.thumbs,
      numColumns: this.state.thumbnailBarNumColumns,
      offset: this.state.thumbnailBarOffset,
      onImageSelect: this.handleImageSelect,
      onShift: this.handleThumbnailBarShift
    }))))));
  }

}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
