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

    to_list_item(filepath, index) {
        let children = index[filepath];
        let basename = this.basename(filepath);
        if (!children || children.length === 0) {
            return (<li key={filepath}><a>{basename}</a></li>);
        } // else
        return (<li key={filepath}><a>{basename}</a>
            <ul>
                {children.map((n) => { return (this.to_list_item(n, index)); })}
            </ul>
        </li>);
    }

    render() {
        return (<aside className="menu">
            <ul className="menu-list">{this.to_list_item(this.props.root, this.props.index)}</ul>
        </aside>)
        /*
        return (<aside className="menu">
            <ul className="menu-list">
                <li><a>foo</a></li>
                <li><a>bar</a>
                    <ul>
                        <li><a>baz</a></li>
                    </ul>
                </li>
            </ul>
        </aside>);
        */
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

function Viewer(props) {
    return (
        <div className="container">
            <div className="columns">
                <div className="column is-one-fifth">
                    <Menu index={props.index} root='media/' />
                </div>
                <div className="column">
                    <div className="level">
                        <div className="columns is-vcentered">
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
                    </div>
                    <div className="level">
                        <p>Ullam rerum aut dicta labore non iusto dolorem ratione. Nihil quia rerum numquam. Ut est beatae aut quia ipsum. Nulla cumque quasi explicabo assumenda corporis possimus itaque rerum.…</p>
                    </div>
                </div>
            </div>
        </div>);
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
            index: ''
        };
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
                this.setState({ index: index });
            }
        }
    }

    render() {
        return (<Section>
            <Viewer index={this.state.index}>
                <Image url={this.state.url} />
            </Viewer>
        </Section>);
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
);