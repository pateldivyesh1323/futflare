import { useParams } from "react-router-dom";

export default function OpenedCapsule() {
    const params = useParams();

    return <div>{params.id}</div>;
}
