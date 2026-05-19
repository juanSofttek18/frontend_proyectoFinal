import GenericCard from "./GenericCard";

function NotFoundView() {
    return (
        <div>
            <GenericCard title="404 - Not Found" subtitle="The page you are looking for does not exist.">
                <p>Please use the navigation menu to access other pages.</p>
            </GenericCard>
        </div>
    )
}

export default NotFoundView;