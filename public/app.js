class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        };

        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle() {
        this.setState({ open: !this.state.open });
    }

    render() {
        let hiddenIfClosed = this.state.open ? '' : 'is-hidden';
        let hiddenIfOpen = this.state.open ? 'is-hidden' : '';
        if (!this.props.has_child_dirs) {
            return (<li><a>{this.props.text}</a></li>);
        } else {
            return (<li>
                <a>
                    <span className="icon" onClick={this.handleToggle}>
                        <span className={hiddenIfClosed}><i className="fas fa-folder-plus"></i></span>
                        <span className={hiddenIfOpen}><i className="fas fa-folder-minus"></i></span>
                    </span>{this.props.text}
                </a>
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

    to_list_item(filepath, index, is_open) {
        if (!index) {
            return null;
        }
        let child_dirs = index[filepath];
        let basename = this.basename(filepath);
        let has_child_dirs = child_dirs && child_dirs.length > 0;
        return (
            <MenuItem
                key={filepath}
                has_child_dirs={has_child_dirs}
                is_open={is_open}
                text={basename}
            >
                {has_child_dirs && <ul>
                    {child_dirs.map((n) => {
                        return (this.to_list_item(n, index));
                    })}
                </ul>}</MenuItem>
        );
    }

    render() {
        return (<aside className="menu">
            <ul className="menu-list">{this.to_list_item(this.props.root, this.props.index, this.props.is_open)}</ul>
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

function ThumbnailBar() {
    return (
        <p>Ullam rerum aut dicta labore non iusto dolorem ratione. Nihil quia rerum numquam. Ut est beatae aut quia ipsum. Nulla cumque quasi explicabo assumenda corporis possimus itaque rerum.…</p>
    );
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
            url: 'https://picsum.photos/1600/900',
            index: null,
            isMenuItemOpen: {},
            root: 'media/'
        };

        this.handleMenuItemToggle = this.handleMenuItemToggle.bind(this);

        let xhr = new XMLHttpRequest;
        xhr.open('GET', 'rpc/index/media');
        xhr.responseType = 'json';
        xhr.send();
        xhr.onload = () => {
            if (xhr.status !== 200) {
                alert(`Error ${xhr.status}: ${xhr.statusText}`);
            } else {
                let response = xhr.response;
                for (let k in xhr.response) {
                    response[k] = response[k]['directories'];
                }
                let index = response;
                this.setState({
                    index: index
                });
            }
        }
    }

    handleMenuItemToggle(path) {
        let isMenuItemOpen = this.state.isMenuItemOpen;
        isMenuItemOpen[path] = !isMenuItemOpen[path];
        this.setState({ isMenuItemOpen: isMenuItemOpen });
    }

    render() {
        return (<section className="section">
            <div className="container">
                <div className="columns">
                    <div className="column is-one-fifth">
                        <Menu
                            index={this.state.index}
                            root={this.state.root}
                        />
                    </div>
                    <div className="column">
                        <div className="level">
                            <Viewer>
                                <Image url={this.state.url} />
                            </Viewer>
                        </div>
                        <div className="level">
                            <ThumbnailBar />
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