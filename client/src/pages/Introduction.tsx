import { Link } from "react-router-dom";

const Introduction = (): React.ReactElement => {
    return (
        <>
            <div>Welcome to introduction page</div>
            <Link to="/home">
                <button>Go to home page</button>
            </Link>
        </>
    );
};

export default Introduction;
