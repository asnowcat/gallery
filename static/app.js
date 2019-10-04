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

function Image(props) {
    return (<figure className="image">
        <img src={props.url} />
    </figure>);
}

function Viewer(props) {
    return (
        <div className="container">
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
        </div>);
}

function Section(props) {
    return (
        <section className="section">{props.children}</section>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "https://picsum.photos/1600/900",
        };
    }

    render() {
        return (<Section>
            <Viewer>
                <Image url={this.state.url} />
            </Viewer>
        </Section>);
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
);