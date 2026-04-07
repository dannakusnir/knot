import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ApplicantsRedirectPage({ params }: Props) {
  const { id } = await params;
  redirect(`/b/offers/${id}`);
}
