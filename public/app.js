class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        };

        this.handleToggle = this.handleToggle.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleToggle() {
        this.setState({ open: !this.state.open });
    }

    handleSelect() {
        this.props.onFolderSelect(this.props.path);
    }

    render() {
        let hiddenIfClosed = this.state.open ? '' : 'is-hidden';
        let hiddenIfOpen = this.state.open ? 'is-hidden' : '';
        let isActive = this.props.path === this.props.activeFolder ? 'is-active' : '';
        if (!this.props.has_child_dirs) {
            return (<li>
                <a className={isActive} onClick={this.handleSelect}>
                    {this.props.text}
                </a>
            </li>);
        } else {
            return (<li>
                <div style={{ position: 'relative' }}>
                    <span className="icon" onClick={this.handleToggle} style={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        left: '-1.5rem',
                        backgroundColor: '#fff'
                    }}>
                        <span className={hiddenIfClosed}><i className="far fa-lg fa-minus-square"></i></span>
                        <span className={hiddenIfOpen}><i className="far fa-lg fa-plus-square"></i></span>
                    </span>
                    <a className={isActive} onClick={this.handleSelect}>
                        <span>
                            {this.props.text}
                        </span>
                    </a>
                </div>
                <span className={hiddenIfClosed}>{this.props.children}</span>
            </li>);
        }
    }
}

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    basename(filepath) {
        let splat = filepath.split('/');
        let len = splat.length;
        if (splat[len - 1] === '') {
            return splat[len - 2];
        } // else
        return splat[len - 1];
    }

    to_list_item(filepath, subdirsIndex) {
        if (!subdirsIndex) {
            return null;
        }
        let child_dirs = subdirsIndex[filepath];
        let basename = this.basename(filepath);
        let has_child_dirs = child_dirs && child_dirs.length > 0;
        return (
            <MenuItem
                key={filepath}
                path={filepath}
                has_child_dirs={has_child_dirs}
                text={basename}
                onFolderSelect={this.props.onFolderSelect}
                activeFolder={this.props.activeFolder}
            >
                {has_child_dirs && <ul>
                    {child_dirs.map((n) => {
                        return (this.to_list_item(n, subdirsIndex));
                    })}
                </ul>}</MenuItem>
        );
    }

    render() {
        return (<aside className="menu">
            <ul className="menu-list">{this.to_list_item(this.props.root, this.props.subdirs)}</ul>
        </aside>)
    }
}

function LeftArrow() {
    return (<p className="icon">
        &#9668;
    </p>);
}

function RightArrow() {
    return (<p className="icon">
        &#9658;
    </p>);
}

class Thumbnail extends React.Component {
    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect() {
        this.props.onImageSelect(this.props.url);
    }

    render () {
        return (
            <div className="column">
                <figure className="image">
                        <a onClick={this.handleSelect}>
                            <img src={this.props.url} style={{ objectFit: 'cover', width: '322px', height: '200px' }} />
                        </a>
                </figure>
            </div>
        );
    }
}

class ThumbnailBar extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
        if (this.props.images && this.props.activeFolder) {
            let images = this.props.images[this.props.activeFolder];
            let elems = images.map((img) => {
                return (
                <Thumbnail
                    key={img}
                    url={img}
                    onImageSelect={this.props.onImageSelect}
                />);
            });
            return (<div className="columns">{elems}</div>);
        } else {
            return null;
        }
    }
}

function Viewer(props) {
    return (<div className="columns is-vcentered">
        <div className="column has-text-centered is-narrow">
            <LeftArrow />
        </div>

        <div className="column">
            {props.children}
        </div>

        <div className="column has-text-centered is-narrow">
            <RightArrow />
        </div>
    </div>
    );
}

function Section(props) {
    return (
        <section className="section">{props.children}</section>
    );
}

function Image(props) {
    return (<figure className="image">
        <img src={props.url} />
    </figure>);
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: 'media/foo/635-1600x900.jpg',
            subdirs: null,
            images: null,
            root: 'media/',
            activeFolder: 'media/',
        };

        this.handleFolderSelect = this.handleFolderSelect.bind(this);
        this.handleImageSelect = this.handleImageSelect.bind(this);

        let xhr = new XMLHttpRequest;
        xhr.open('GET', 'rpc/index/media');
        xhr.responseType = 'json';
        xhr.send();
        xhr.onload = () => {
            if (xhr.status !== 200) {
                alert(`Error ${xhr.status}: ${xhr.statusText}`);
            } else {
                let subdirs = {};
                let images = {};
                for (let k in xhr.response) {
                    subdirs[k] = xhr.response[k]['directories'];
                    images[k] = xhr.response[k]['files'].filter((fn) => fn.match(/\.jpg$/));
                }
                this.setState({
                    subdirs: subdirs,
                    images: images
                });
            }
        }
    }

    handleFolderSelect(path) {
        this.setState({ activeFolder: path });
    }

    handleImageSelect(path) {
        this.setState({ url: path });
    }

    render() {
        return (<section className="section">
            <div className="container">
                <div className="columns">
                    <div className="column is-one-fifth">
                        <Menu
                            subdirs={this.state.subdirs}
                            root={this.state.root}
                            onFolderSelect={this.handleFolderSelect}
                            activeFolder={this.state.activeFolder}
                        />
                    </div>
                    <div className="column">
                        <div className="level">
                            <Viewer>
                                <Image url={this.state.url} />
                            </Viewer>
                        </div>
                        <div className="level">
                            <ThumbnailBar
                                activeFolder={this.state.activeFolder}
                                images={this.state.images}
                                onImageSelect={this.handleImageSelect}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>);
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
);