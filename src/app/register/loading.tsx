import Spinner from "@/components/ui/Spinner";

export default function Loading() {
    return (
        <div
            style={{
                minHeight: "100svh",
                display: "grid",
                placeItems: "center",
            }}
        >
            <Spinner />
        </div>
    );
}