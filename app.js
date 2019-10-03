class Container extends React.Component {
    render() {
        return (<div className="container">
            <div className="columns is-vcentered">
                <div className="column has-text-centered is-narrow">
                    <p className="icon">
                        &#9668;
                        </p>
                </div>

                <div className="column">
                    <figure className="image">
                        <img src={this.props.url} />
                    </figure>
                </div>

                <div className="column has-text-centered is-narrow">
                    <p className="icon">
                        &#9658;
                    </p>
                </div>
            </div>
        </div>);
    };
}

ReactDOM.render(
    <Container url="https://picsum.photos/1600/900" />,
    document.getElementById('root')
);