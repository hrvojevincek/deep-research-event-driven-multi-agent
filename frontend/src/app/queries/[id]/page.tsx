import { QueryDetailLive } from "@/components/dashboard/query-detail-live";

type QueryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QueryDetailPage({ params }: QueryDetailPageProps) {
  const { id } = await params;

  return <QueryDetailLive jobId={id} />;
}
