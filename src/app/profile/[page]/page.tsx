import MainLayout from "@/components/layout/MainLayout/MainLayout";
import ProfilePage from "@/components/pages/Profile";

export function generateStaticParams() {
    return [
        { page: "info" },
        { page: "stats" },
    ];
}

export default async function Page({
    params,
}: {
    params: Promise<{ page: "info" | "stats" }>;
}) {
    const { page } = await params;

    return (
        <MainLayout>
            <ProfilePage page={page} />
        </MainLayout>
    );
}
